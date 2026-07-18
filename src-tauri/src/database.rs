use chrono::{Datelike, Local, NaiveDate};
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;

/// Application-wide database handle stored in Tauri's managed state.
pub struct Db(pub Mutex<Connection>);

pub fn get_db_path() -> PathBuf {
    let mut path = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
    path.push("EyeGuard");
    let _ = std::fs::create_dir_all(&path);
    path.push("eyeguard.db");
    path
}

/// Open the database and ensure the schema + default settings exist.
pub fn init_db() -> Result<Connection> {
    let conn = Connection::open(get_db_path())?;
    create_schema(&conn)?;
    seed_default_settings(&conn)?;
    Ok(conn)
}

/// Create the tables (idempotent). Shared by init_db and tests.
pub fn create_schema(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS break_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            duration INTEGER NOT NULL,
            completed BOOLEAN NOT NULL,
            game_played TEXT,
            score INTEGER
        )",
        [],
    )?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )",
        [],
    )?;
    Ok(())
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Settings {
    pub timer_mode: String,
    pub break_mode: String,
    pub break_duration: u32,
    pub sound_enabled: bool,
    pub notifications_enabled: bool,
    pub auto_start: bool,
    pub do_not_disturb: bool,
    pub max_snooze: u32,
}

impl Default for Settings {
    fn default() -> Self {
        Settings {
            timer_mode: "20-20-20".to_string(),
            break_mode: "gentle".to_string(),
            break_duration: 20,
            sound_enabled: true,
            notifications_enabled: true,
            auto_start: true,
            do_not_disturb: false,
            max_snooze: 3,
        }
    }
}

fn seed_default_settings(conn: &Connection) -> Result<()> {
    let count: i64 = conn.query_row("SELECT COUNT(*) FROM settings", [], |r| r.get(0))?;
    if count == 0 {
        save_settings(conn, &Settings::default())?;
    }
    Ok(())
}

fn get_setting(conn: &Connection, key: &str) -> Option<String> {
    conn.query_row(
        "SELECT value FROM settings WHERE key = ?1",
        [key],
        |r| r.get::<_, String>(0),
    )
    .ok()
}

fn set_setting(conn: &Connection, key: &str, value: &str) -> Result<()> {
    conn.execute(
        "INSERT INTO settings (key, value) VALUES (?1, ?2)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        [key, value],
    )?;
    Ok(())
}

pub fn load_settings(conn: &Connection) -> Settings {
    let d = Settings::default();
    Settings {
        timer_mode: get_setting(conn, "timer_mode").unwrap_or(d.timer_mode),
        break_mode: get_setting(conn, "break_mode").unwrap_or(d.break_mode),
        break_duration: get_setting(conn, "break_duration")
            .and_then(|v| v.parse().ok())
            .unwrap_or(d.break_duration),
        sound_enabled: get_setting(conn, "sound_enabled")
            .map(|v| v == "true")
            .unwrap_or(d.sound_enabled),
        notifications_enabled: get_setting(conn, "notifications_enabled")
            .map(|v| v == "true")
            .unwrap_or(d.notifications_enabled),
        auto_start: get_setting(conn, "auto_start")
            .map(|v| v == "true")
            .unwrap_or(d.auto_start),
        do_not_disturb: get_setting(conn, "do_not_disturb")
            .map(|v| v == "true")
            .unwrap_or(d.do_not_disturb),
        max_snooze: get_setting(conn, "max_snooze")
            .and_then(|v| v.parse().ok())
            .unwrap_or(d.max_snooze),
    }
}

pub fn save_settings(conn: &Connection, s: &Settings) -> Result<()> {
    set_setting(conn, "timer_mode", &s.timer_mode)?;
    set_setting(conn, "break_mode", &s.break_mode)?;
    set_setting(conn, "break_duration", &s.break_duration.to_string())?;
    set_setting(conn, "sound_enabled", &s.sound_enabled.to_string())?;
    set_setting(
        conn,
        "notifications_enabled",
        &s.notifications_enabled.to_string(),
    )?;
    set_setting(conn, "auto_start", &s.auto_start.to_string())?;
    set_setting(conn, "do_not_disturb", &s.do_not_disturb.to_string())?;
    set_setting(conn, "max_snooze", &s.max_snooze.to_string())?;
    Ok(())
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct BreakRecord {
    pub id: i64,
    pub timestamp: String,
    pub duration: u32,
    pub completed: bool,
    pub game_played: Option<String>,
    pub score: Option<i64>,
}

pub fn insert_break(
    conn: &Connection,
    duration: u32,
    completed: bool,
    game: Option<String>,
    score: Option<i64>,
) -> Result<i64> {
    conn.execute(
        "INSERT INTO break_records (duration, completed, game_played, score)
         VALUES (?1, ?2, ?3, ?4)",
        rusqlite::params![duration, completed, game, score],
    )?;
    Ok(conn.last_insert_rowid())
}

pub fn recent_breaks(conn: &Connection, limit: u32) -> Result<Vec<BreakRecord>> {
    let mut stmt = conn.prepare(
        "SELECT id, timestamp, duration, completed, game_played, score
         FROM break_records ORDER BY id DESC LIMIT ?1",
    )?;
    let rows = stmt.query_map([limit], |row| {
        Ok(BreakRecord {
            id: row.get(0)?,
            timestamp: row.get(1)?,
            duration: row.get(2)?,
            completed: row.get(3)?,
            game_played: row.get(4)?,
            score: row.get(5)?,
        })
    })?;
    rows.collect()
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DailyStat {
    pub date: String,
    pub breaks: u32,
    pub completed: u32,
    pub score: u32,
}

/// Per-day aggregate for the last `days` days (including days with 0 breaks).
pub fn daily_stats(conn: &Connection, days: u32) -> Result<Vec<DailyStat>> {
    let mut stmt = conn.prepare(
        "SELECT date(timestamp, 'localtime') AS d,
                COUNT(*) AS total,
                SUM(CASE WHEN completed THEN 1 ELSE 0 END) AS done
         FROM break_records
         WHERE timestamp >= datetime('now', ?1)
         GROUP BY d",
    )?;
    let offset = format!("-{} days", days.saturating_sub(1));
    let mut map = std::collections::HashMap::new();
    let rows = stmt.query_map([offset], |row| {
        let d: String = row.get(0)?;
        let total: u32 = row.get(1)?;
        let done: u32 = row.get::<_, i64>(2)? as u32;
        Ok((d, total, done))
    })?;
    for r in rows {
        let (d, total, done) = r?;
        map.insert(d, (total, done));
    }

    let today = Local::now().date_naive();
    let mut out = Vec::new();
    for i in (0..days).rev() {
        let day: NaiveDate = today - chrono::Duration::days(i as i64);
        let key = day.format("%Y-%m-%d").to_string();
        let (total, done) = map.get(&key).copied().unwrap_or((0, 0));
        let score = eye_health_from(total, done);
        out.push(DailyStat {
            date: key,
            breaks: total,
            completed: done,
            score,
        });
    }
    Ok(out)
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct StatsSummary {
    pub eye_health_score: u32,
    pub today_breaks: u32,
    pub total_breaks: u32,
    pub streak: u32,
}

pub fn stats_summary(conn: &Connection) -> Result<StatsSummary> {
    let total: u32 = conn
        .query_row("SELECT COUNT(*) FROM break_records", [], |r| r.get(0))
        .unwrap_or(0);

    let today: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM break_records
             WHERE date(timestamp, 'localtime') = date('now', 'localtime')",
            [],
            |r| r.get(0),
        )
        .unwrap_or(0);

    let today_done: u32 = conn
        .query_row(
            "SELECT COUNT(*) FROM break_records
             WHERE date(timestamp, 'localtime') = date('now', 'localtime')
               AND completed = 1",
            [],
            |r| r.get(0),
        )
        .unwrap_or(0);

    Ok(StatsSummary {
        eye_health_score: eye_health_from(today, today_done),
        today_breaks: today,
        total_breaks: total,
        streak: streak_days(conn),
    })
}

/// Count consecutive days (ending today or yesterday) that have >=1 break.
fn streak_days(conn: &Connection) -> u32 {
    let mut stmt = match conn.prepare(
        "SELECT DISTINCT date(timestamp, 'localtime') FROM break_records
         ORDER BY 1 DESC",
    ) {
        Ok(s) => s,
        Err(_) => return 0,
    };
    let days: Vec<String> = stmt
        .query_map([], |r| r.get::<_, String>(0))
        .map(|rows| rows.filter_map(|r| r.ok()).collect())
        .unwrap_or_default();

    let today = Local::now().date_naive();
    let mut streak = 0u32;
    let mut cursor = today;
    for d in days {
        if let Ok(parsed) = NaiveDate::parse_from_str(&d, "%Y-%m-%d") {
            if parsed == cursor {
                streak += 1;
                cursor = cursor.pred_opt().unwrap_or(cursor);
            } else if streak == 0 && parsed == today.pred_opt().unwrap_or(today) {
                // allow streak to start from yesterday if nothing yet today
                streak += 1;
                cursor = parsed.pred_opt().unwrap_or(parsed);
            } else if parsed < cursor {
                break;
            }
        }
    }
    streak
}

/// Simple, documented eye-health heuristic for a single day.
/// Base 50, +10 per completed break (cap 100), −5 per skipped break.
fn eye_health_from(total: u32, completed: u32) -> u32 {
    let skipped = total.saturating_sub(completed);
    let raw = 50i32 + (completed as i32) * 10 - (skipped as i32) * 5;
    raw.clamp(0, 100) as u32
}

/// Convenience for the current calendar day used by the timer loop.
pub fn today_key() -> String {
    Local::now().date_naive().format("%Y-%m-%d").to_string()
}

/// Expose current month for potential monthly rollups (kept for future use).
pub fn current_month() -> u32 {
    Local::now().month()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn mem() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        create_schema(&conn).unwrap();
        conn
    }

    #[test]
    fn settings_roundtrip() {
        let conn = mem();
        let mut s = Settings::default();
        s.break_duration = 45;
        s.do_not_disturb = true;
        s.timer_mode = "pomodoro".into();
        save_settings(&conn, &s).unwrap();

        let loaded = load_settings(&conn);
        assert_eq!(loaded.break_duration, 45);
        assert!(loaded.do_not_disturb);
        assert_eq!(loaded.timer_mode, "pomodoro");
    }

    #[test]
    fn settings_defaults_when_empty() {
        let conn = mem();
        let loaded = load_settings(&conn);
        assert_eq!(loaded.timer_mode, "20-20-20");
        assert_eq!(loaded.max_snooze, 3);
        assert!(loaded.notifications_enabled);
    }

    #[test]
    fn insert_and_read_breaks() {
        let conn = mem();
        insert_break(&conn, 20, true, Some("FollowDot".into()), Some(7)).unwrap();
        insert_break(&conn, 15, false, None, None).unwrap();

        let recent = recent_breaks(&conn, 10).unwrap();
        assert_eq!(recent.len(), 2);
        // ordered newest first
        assert_eq!(recent[0].duration, 15);
        assert!(!recent[0].completed);
        assert_eq!(recent[1].game_played.as_deref(), Some("FollowDot"));
    }

    #[test]
    fn summary_counts_today() {
        let conn = mem();
        insert_break(&conn, 20, true, None, None).unwrap();
        insert_break(&conn, 20, true, None, None).unwrap();
        insert_break(&conn, 20, false, None, None).unwrap();

        let s = stats_summary(&conn).unwrap();
        assert_eq!(s.total_breaks, 3);
        assert_eq!(s.today_breaks, 3);
        assert_eq!(s.streak, 1);
        // base 50 + 2*10 completed - 1*5 skipped = 65
        assert_eq!(s.eye_health_score, 65);
    }

    #[test]
    fn daily_stats_fills_empty_days() {
        let conn = mem();
        insert_break(&conn, 20, true, None, None).unwrap();
        let days = daily_stats(&conn, 7).unwrap();
        assert_eq!(days.len(), 7);
        // last entry is today and should hold the single break
        assert_eq!(days.last().unwrap().breaks, 1);
        // earlier days are zero-filled
        assert_eq!(days[0].breaks, 0);
    }

    #[test]
    fn eye_health_clamps() {
        assert_eq!(eye_health_from(0, 0), 50);
        assert_eq!(eye_health_from(10, 10), 100); // capped
        assert_eq!(eye_health_from(20, 0), 0); // floored (50 - 100)
    }
}
