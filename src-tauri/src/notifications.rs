use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

/// Show a native OS notification via the Tauri v2 notification plugin.
pub fn send_break_notification(app: &AppHandle, title: &str, body: &str) {
    let _ = app.notification().builder().title(title).body(body).show();
}
