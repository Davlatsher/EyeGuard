//! OS-level signals used to make the timer non-intrusive:
//! - user idle time (pause when the user stepped away)
//! - fullscreen / presentation mode (don't interrupt videos, games, slideshows)
//!
//! Implemented with minimal Win32 FFI on Windows; no-ops elsewhere so the
//! crate still builds and runs on macOS/Linux.

/// Seconds since the last keyboard/mouse input. Returns 0 when unknown.
#[cfg(windows)]
pub fn idle_seconds() -> u64 {
    #[repr(C)]
    struct LastInputInfo {
        cb_size: u32,
        dw_time: u32,
    }
    #[link(name = "user32")]
    extern "system" {
        fn GetLastInputInfo(plii: *mut LastInputInfo) -> i32;
    }
    #[link(name = "kernel32")]
    extern "system" {
        fn GetTickCount() -> u32;
    }
    unsafe {
        let mut lii = LastInputInfo {
            cb_size: std::mem::size_of::<LastInputInfo>() as u32,
            dw_time: 0,
        };
        if GetLastInputInfo(&mut lii) != 0 {
            let now = GetTickCount();
            (now.wrapping_sub(lii.dw_time) as u64) / 1000
        } else {
            0
        }
    }
}

#[cfg(not(windows))]
pub fn idle_seconds() -> u64 {
    0
}

/// True when the foreground app is a fullscreen game/video or presentation,
/// so we should hold back interruptions.
#[cfg(windows)]
pub fn is_fullscreen_or_presenting() -> bool {
    #[link(name = "shell32")]
    extern "system" {
        fn SHQueryUserNotificationState(pquns: *mut i32) -> i32;
    }
    // QUNS_RUNNING_D3D_FULL_SCREEN = 3, QUNS_PRESENTATION_MODE = 4
    unsafe {
        let mut state: i32 = 0;
        if SHQueryUserNotificationState(&mut state) == 0 {
            state == 3 || state == 4
        } else {
            false
        }
    }
}

#[cfg(not(windows))]
pub fn is_fullscreen_or_presenting() -> bool {
    false
}
