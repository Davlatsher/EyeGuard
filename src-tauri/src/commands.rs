use tauri::{AppHandle, Manager};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct TimerStatus {
    pub is_running: bool,
    pub next_break_in: u64,
    pub mode: String,
}

#[tauri::command]
pub fn start_timer(mode: String) -> Result<String, String> {
    Ok(format!("Timer started in {} mode", mode))
}

#[tauri::command]
pub fn stop_timer() -> Result<String, String> {
    Ok("Timer stopped".to_string())
}

#[tauri::command]
pub fn get_timer_status() -> TimerStatus {
    TimerStatus {
        is_running: true,
        next_break_in: 1200,
        mode: "20-20-20".to_string(),
    }
}

#[tauri::command]
pub fn show_notification(app: AppHandle, title: String, body: String) {
    let _ = tauri::api::notification::Notification::new(
        app.config().tauri.bundle.identifier.clone()
    )
    .title(title)
    .body(body)
    .show();
}

#[tauri::command]
pub fn create_overlay_window(app: AppHandle) -> Result<String, String> {
    let overlay = tauri::WindowBuilder::new(
        &app,
        "overlay",
        tauri::WindowUrl::App("index.html".into())
    )
    .fullscreen(true)
    .always_on_top(true)
    .transparent(true)
    .decorations(false)
    .build()
    .map_err(|e| e.to_string())?;

    overlay.show().map_err(|e| e.to_string())?;
    Ok("Overlay created".to_string())
}

#[tauri::command]
pub fn close_overlay_window(app: AppHandle) -> Result<String, String> {
    if let Some(window) = app.get_window("overlay") {
        window.close().map_err(|e| e.to_string())?;
    }
    Ok("Overlay closed".to_string())
}

#[tauri::command]
pub fn get_eye_health_score() -> u32 {
    85
}

#[derive(Serialize)]
pub struct DailyStats {
    pub date: String,
    pub breaks: u32,
    pub score: u32,
}

#[tauri::command]
pub fn get_daily_stats() -> Vec<DailyStats> {
    vec![
        DailyStats { date: "2026-07-12".to_string(), breaks: 8, score: 75 },
        DailyStats { date: "2026-07-13".to_string(), breaks: 12, score: 85 },
        DailyStats { date: "2026-07-14".to_string(), breaks: 10, score: 80 },
    ]
}

#[tauri::command]
pub fn save_break_record(duration: u32, completed: bool, game: Option<String>) {
    // Save to SQLite database
    let _ = (duration, completed, game);
}

#[derive(Serialize, Deserialize)]
pub struct Settings {
    pub timer_mode: String,
    pub break_mode: String,
    pub break_duration: u32,
    pub sound_enabled: bool,
    pub notifications_enabled: bool,
}

#[tauri::command]
pub fn get_settings() -> Settings {
    Settings {
        timer_mode: "20-20-20".to_string(),
        break_mode: "gentle".to_string(),
        break_duration: 20,
        sound_enabled: true,
        notifications_enabled: true,
    }
}

#[tauri::command]
pub fn update_settings(settings: Settings) -> Result<String, String> {
    let _ = settings;
    Ok("Settings updated".to_string())
}
