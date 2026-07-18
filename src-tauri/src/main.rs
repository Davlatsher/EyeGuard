#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, CustomMenuItem};

mod commands;
mod database;
mod timer;
mod notifications;

use commands::*;
use database::init_db;

#[tokio::main]
async fn main() {
    // Initialize database
    init_db().expect("Failed to initialize database");

    // System tray setup
    let quit = CustomMenuItem::new("quit".to_string(), "Chiqish");
    let show = CustomMenuItem::new("show".to_string(), "Ko'rsatish");
    let toggle = CustomMenuItem::new("toggle".to_string(), "Timer: ON");

    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(toggle)
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                if let Some(window) = app.get_window("main") {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "show" => {
                    if let Some(window) = app.get_window("main") {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                }
                "toggle" => {}
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            start_timer,
            stop_timer,
            get_timer_status,
            show_notification,
            create_overlay_window,
            close_overlay_window,
            get_eye_health_score,
            get_daily_stats,
            save_break_record,
            get_settings,
            update_settings,
        ])
        .setup(|app| {
            let app_handle = app.handle();

            // Start background timer
            tokio::spawn(async move {
                timer::run_timer_loop(app_handle).await;
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
