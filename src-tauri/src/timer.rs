use tauri::AppHandle;
use tokio::time::{sleep, Duration};
use crate::notifications::send_break_notification;

pub async fn run_timer_loop(app: AppHandle) {
    let break_interval = 20 * 60; // 20 minutes
    let break_duration = 20; // 20 seconds

    loop {
        // Wait for break interval
        sleep(Duration::from_secs(break_interval)).await;

        // Send notification
        send_break_notification(
            &app,
            "Ko'zingizni dam oldiring!",
            "20 soniya uzoq masofaga qarang. Ko'z mushaklaringizni dam oldiring."
        );

        // Wait the break duration
        sleep(Duration::from_secs(break_duration)).await;
    }
}
