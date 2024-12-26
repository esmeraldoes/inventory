use crate::db::Database; // Import the Database struct
use serde::Serialize;
use sqlx::Row; // Import Row trait
use tauri::State;

#[derive(Serialize)]
pub struct LoginResponse {
    pub success: bool,
    pub message: String,
    pub username: Option<String>,
}

#[tauri::command]
pub async fn login(
    db: State<'_, Database>, // Access the Database from Tauri State
    username: String,
    password: String,
) -> Result<LoginResponse, String> {
    let query = "SELECT username FROM users WHERE username = ? AND password = ?";
    match sqlx::query(query)
        .bind(&username)
        .bind(&password)
        .fetch_optional(&db.pool)
        .await
    {
        Ok(Some(row)) => {
            let username: String = row.try_get("username").unwrap_or_default();
            Ok(LoginResponse {
                success: true,
                message: "Login successful".to_string(),
                username: Some(username),
            })
        }
        Ok(None) => Ok(LoginResponse {
            success: false,
            message: "Invalid credentials".to_string(),
            username: None,
        }),
        Err(e) => Err(format!("Database error: {}", e)),
    }
}

#[tauri::command]
pub fn logout() -> LoginResponse {
    LoginResponse {
        success: true,
        message: "Logged out successfully".to_string(),
        username: None,
    }
}
