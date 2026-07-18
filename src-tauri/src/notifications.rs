use tauri::AppHandle;

pub fn send_break_notification(app: &AppHandle, title: &str, body: &str) {
    let _ = tauri::api::notification::Notification::new(
        app.config().tauri.bundle.identifier.clone()
    )
    .title(title)
    .body(body)
    .show();
}
