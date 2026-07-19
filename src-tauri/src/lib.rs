mod commands;
mod database;
mod notifications;
mod system;
mod timer;

use std::sync::{atomic::Ordering, Arc};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent},
    Manager,
};

use commands::*;
use database::{init_db, load_settings, Db};
use timer::{
    get_timer_status, reset_timer, run_timer_loop, set_interval, set_timer_mode, snooze_timer,
    start_timer, stop_timer, TimerState,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize database (schema + defaults) before anything else.
    let conn = init_db().expect("Failed to initialize database");
    let settings = load_settings(&conn);
    // Custom mode uses the saved interval; presets use their fixed interval.
    let interval = if settings.timer_mode == "custom" {
        (settings.custom_interval as u64) * 60
    } else {
        timer::interval_for_mode(&settings.timer_mode)
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .manage(Db(std::sync::Mutex::new(conn)))
        .manage(TimerState::new(interval))
        .invoke_handler(tauri::generate_handler![
            // timer
            start_timer,
            stop_timer,
            set_timer_mode,
            set_interval,
            reset_timer,
            snooze_timer,
            get_timer_status,
            // notifications & overlay
            show_notification,
            create_overlay_window,
            close_overlay_window,
            // data
            get_eye_health_score,
            get_daily_stats,
            get_stats_summary,
            get_break_history,
            save_break_record,
            get_settings,
            update_settings,
        ])
        .setup(|app| {
            setup_tray(app.handle())?;

            // Start the background timer loop.
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                run_timer_loop(handle).await;
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_tray(app: &tauri::AppHandle) -> tauri::Result<()> {
    let show = MenuItem::with_id(app, "show", "Ko'rsatish", true, None::<&str>)?;
    let toggle = MenuItem::with_id(app, "toggle", "Timer: ON/OFF", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Chiqish", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &toggle, &quit])?;

    let _tray = TrayIconBuilder::with_id("main-tray")
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("EyeGuard")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => app.exit(0),
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "toggle" => {
                let state = app.state::<Arc<TimerState>>();
                let now = state.running.load(Ordering::Relaxed);
                state.running.store(!now, Ordering::Relaxed);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click { .. } = event {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app)?;

    Ok(())
}
