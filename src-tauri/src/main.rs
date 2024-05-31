#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use log::info;
use simplelog::*;
use std::env;
use std::fs::{File, OpenOptions};
use std::path::PathBuf;
use std::process::Command;
use tauri::{command, AppHandle, Manager};
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu};

fn setup_logging() -> Result<(), Box<dyn std::error::Error>> {
    let home_dir = env::var("HOME")
        .or_else(|_| env::var("USERPROFILE"))
        .expect("Failed to find HOME or USERPROFILE environment variable");

    let mut log_path = PathBuf::from(home_dir);
    log_path.push("pn07.log"); // 日志文件名

    // 使用OpenOptions以追加模式打开文件
    let log_file = OpenOptions::new()
        .write(true)
        .create(true)
        .append(true)
        .open(log_path)?;

    CombinedLogger::init(vec![WriteLogger::new(
        LevelFilter::Info,
        Config::default(),
        log_file,
    )])?;
    Ok(())
}

fn get_log_path() -> Result<PathBuf, Box<dyn std::error::Error>> {
    let home_dir = env::var("HOME")
        .or_else(|_| env::var("USERPROFILE"))
        .expect("Failed to find HOME or USERPROFILE environment variable");
    let mut log_path = PathBuf::from(home_dir);
    log_path.push("pn07.log");
    Ok(log_path)
}

#[tauri::command]
fn save_excel_file(path: String, data: Vec<u8>) -> Result<(), String> {
    use std::fs::File;
    use std::io::Write;
    let mut file = File::create(path).map_err(|e| e.to_string())?;
    file.write_all(&data).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
fn open_home_directory() -> Result<(), String> {
    let home_dir = env::var("HOME")
        .or(env::var("USERPROFILE"))
        .map_err(|e| e.to_string())?;

    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(home_dir)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[command]
fn write_log(message: String) {
    log::info!("{}", message);
}

#[command]
fn clear_log() -> Result<(), String> {
    let log_path = get_log_path().map_err(|e| e.to_string())?;
    File::create(log_path).map_err(|e| e.to_string())?; // 重新创建文件以清空内容
    Ok(())
}

fn main() {
    setup_logging().expect("Failed to set up logging");
    let opt_quit = CustomMenuItem::new("quit", "Quit");
    let tray_menu = SystemTrayMenu::new().add_item(opt_quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_excel_file,
            open_home_directory,
            write_log,
            clear_log
        ])
        .system_tray(system_tray)
        .on_system_tray_event(|_app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => std::process::exit(0),
                _ => {}
            },
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
