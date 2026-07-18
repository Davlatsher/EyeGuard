use crate::database::{self, BreakRecord, DailyStat, Db, Settings, StatsSummary};
use crate::notifications::send_break_notification;
use tauri::{AppHandle, Emitter, Manager, State, WebviewUrl, WebviewWindowBuilder};

/// Ask the backend to fire a break notification now.
#[tauri::command]
pub fn show_notification(app: AppHandle, title: String, body: String) {
    send_break_notification(&app, &title, &body);
}

/// Create the fullscreen always-on-top overlay window for strict breaks.
#[tauri::command]
pub fn create_overlay_window(app: AppHandle) -> Result<String, String> {
    if app.get_webview_window("overlay").is_some() {
        return Ok("Overlay already open".into());
    }
    let overlay = WebviewWindowBuilder::new(
        &app,
        "overlay",
        WebviewUrl::App("index.html?overlay=1".into()),
    )
    .title("EyeGuard — Break")
    .fullscreen(true)
    .always_on_top(true)
    .decorations(false)
    .skip_taskbar(true)
    .focused(true)
    .build()
    .map_err(|e| e.to_string())?;

    overlay.show().map_err(|e| e.to_string())?;
    Ok("Overlay created".into())
}

#[tauri::command]
pub fn close_overlay_window(app: AppHandle) -> Result<String, String> {
    if let Some(window) = app.get_webview_window("overlay") {
        window.close().map_err(|e| e.to_string())?;
    }
    Ok("Overlay closed".into())
}

#[tauri::command]
pub fn get_settings(db: State<'_, Db>) -> Result<Settings, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    Ok(database::load_settings(&conn))
}

#[tauri::command]
pub fn update_settings(db: State<'_, Db>, settings: Settings) -> Result<String, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    database::save_settings(&conn, &settings).map_err(|e| e.to_string())?;
    Ok("Settings updated".into())
}

#[tauri::command]
pub fn save_break_record(
    db: State<'_, Db>,
    app: AppHandle,
    duration: u32,
    completed: bool,
    game: Option<String>,
    score: Option<i64>,
) -> Result<i64, String> {
    let id = {
        let conn = db.0.lock().map_err(|e| e.to_string())?;
        database::insert_break(&conn, duration, completed, game, score)
            .map_err(|e| e.to_string())?
    };
    // Notify any listeners (dashboard/analytics) that stats changed.
    let _ = app.emit("stats-updated", ());
    Ok(id)
}

#[tauri::command]
pub fn get_break_history(
    db: State<'_, Db>,
    limit: Option<u32>,
) -> Result<Vec<BreakRecord>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    database::recent_breaks(&conn, limit.unwrap_or(50)).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_daily_stats(db: State<'_, Db>, days: Option<u32>) -> Result<Vec<DailyStat>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    database::daily_stats(&conn, days.unwrap_or(7)).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_stats_summary(db: State<'_, Db>) -> Result<StatsSummary, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    database::stats_summary(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_eye_health_score(db: State<'_, Db>) -> Result<u32, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    Ok(database::stats_summary(&conn)
        .map(|s| s.eye_health_score)
        .unwrap_or(75))
}
