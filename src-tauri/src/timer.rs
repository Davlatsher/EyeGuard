use crate::database::{self, Db};
use crate::notifications::send_break_notification;
use serde::Serialize;
use std::sync::{
    atomic::{AtomicBool, AtomicU64, Ordering},
    Arc,
};
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::time::{sleep, Duration};

/// Shared, thread-safe timer state driven by the background loop and commands.
pub struct TimerState {
    pub running: AtomicBool,
    /// Seconds remaining until the next break.
    pub remaining: AtomicU64,
    /// Full interval (seconds) for the current mode.
    pub interval: AtomicU64,
}

impl TimerState {
    pub fn new(interval: u64) -> Arc<Self> {
        Arc::new(TimerState {
            running: AtomicBool::new(true),
            remaining: AtomicU64::new(interval),
            interval: AtomicU64::new(interval),
        })
    }
}

#[derive(Serialize, Clone)]
pub struct TimerStatus {
    pub is_running: bool,
    pub next_break_in: u64,
    pub interval: u64,
}

pub fn interval_for_mode(mode: &str) -> u64 {
    match mode {
        "pomodoro" => 25 * 60,
        "custom" => 30 * 60,
        _ => 20 * 60, // 20-20-20 default
    }
}

/// Pause the countdown after this many seconds of user inactivity.
const IDLE_THRESHOLD_SECS: u64 = 60;

/// Background loop: ticks once per second, emits a `timer-tick` event, and
/// fires a break (notification + `break-due` event) when the countdown reaches 0.
///
/// The countdown is held (not decremented) while the user is idle, in Do Not
/// Disturb, or a fullscreen video/game/presentation is in the foreground — so
/// EyeGuard never interrupts at the wrong moment.
pub async fn run_timer_loop(app: AppHandle) {
    let state = app.state::<Arc<TimerState>>().inner().clone();
    let mut was_paused = false;

    loop {
        sleep(Duration::from_secs(1)).await;

        if !state.running.load(Ordering::Relaxed) {
            continue;
        }

        let dnd = {
            match app.state::<Db>().0.lock() {
                Ok(conn) => database::load_settings(&conn).do_not_disturb,
                Err(_) => false,
            }
        };
        let paused = dnd
            || crate::system::idle_seconds() >= IDLE_THRESHOLD_SECS
            || crate::system::is_fullscreen_or_presenting();

        if paused {
            if !was_paused {
                was_paused = true;
                let _ = app.emit("timer-paused", true);
            }
            continue;
        }
        if was_paused {
            was_paused = false;
            let _ = app.emit("timer-paused", false);
        }

        let remaining = state.remaining.load(Ordering::Relaxed);
        if remaining > 1 {
            state.remaining.store(remaining - 1, Ordering::Relaxed);
            let _ = app.emit("timer-tick", remaining - 1);
        } else {
            // Time for a break.
            let notify = match app.state::<Db>().0.lock() {
                Ok(conn) => database::load_settings(&conn).notifications_enabled,
                Err(_) => true,
            };
            if notify {
                send_break_notification(
                    &app,
                    "Ko'zingizni dam oldiring!",
                    "20 soniya uzoq masofaga qarang va ko'z mushaklaringizni bo'shashtiring.",
                );
            }
            let _ = app.emit("break-due", ());

            // Reset the countdown for the next cycle.
            let interval = state.interval.load(Ordering::Relaxed);
            state.remaining.store(interval, Ordering::Relaxed);
        }
    }
}

#[tauri::command]
pub fn start_timer(state: State<'_, Arc<TimerState>>, mode: Option<String>) -> TimerStatus {
    if let Some(m) = mode {
        let interval = interval_for_mode(&m);
        state.interval.store(interval, Ordering::Relaxed);
        state.remaining.store(interval, Ordering::Relaxed);
    }
    state.running.store(true, Ordering::Relaxed);
    status(&state)
}

#[tauri::command]
pub fn stop_timer(state: State<'_, Arc<TimerState>>) -> TimerStatus {
    state.running.store(false, Ordering::Relaxed);
    status(&state)
}

#[tauri::command]
pub fn set_timer_mode(state: State<'_, Arc<TimerState>>, mode: String) -> TimerStatus {
    let interval = interval_for_mode(&mode);
    state.interval.store(interval, Ordering::Relaxed);
    state.remaining.store(interval, Ordering::Relaxed);
    status(&state)
}

/// Reset the countdown to a full interval (e.g. after a completed break).
#[tauri::command]
pub fn reset_timer(state: State<'_, Arc<TimerState>>) -> TimerStatus {
    let interval = state.interval.load(Ordering::Relaxed);
    state.remaining.store(interval, Ordering::Relaxed);
    status(&state)
}

/// Snooze: push the next break out by `seconds` (default 5 minutes).
#[tauri::command]
pub fn snooze_timer(state: State<'_, Arc<TimerState>>, seconds: Option<u64>) -> TimerStatus {
    state
        .remaining
        .store(seconds.unwrap_or(5 * 60), Ordering::Relaxed);
    status(&state)
}

#[tauri::command]
pub fn get_timer_status(state: State<'_, Arc<TimerState>>) -> TimerStatus {
    status(&state)
}

fn status(state: &TimerState) -> TimerStatus {
    TimerStatus {
        is_running: state.running.load(Ordering::Relaxed),
        next_break_in: state.remaining.load(Ordering::Relaxed),
        interval: state.interval.load(Ordering::Relaxed),
    }
}
