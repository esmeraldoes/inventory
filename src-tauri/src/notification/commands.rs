use crate::db::Database;
use crate::notification::models::Notification;
use tauri::State;

#[tauri::command]
pub async fn get_notifications(db: State<'_, Database>) -> Result<Vec<Notification>, String> {
    
  
    let query = r#"
        SELECT 
            id, title, description, company_id, product_id, related_quantity, measurement,  total_amount, created_at, is_read

        FROM notifications
        ORDER BY created_at DESC
    "#;


    sqlx::query_as::<_, Notification>(query)
        .fetch_all(&db.pool)
        .await
        .map_err(|err| format!("Failed to fetch notifications: {:?}", err))
}

#[tauri::command]
pub async fn clear_notifications(db: State<'_, Database>) -> Result<(), String> {
    let query = "DELETE FROM notifications";

    sqlx::query(query)
        .execute(&db.pool)
        .await
        .map(|_| ())
        .map_err(|err| format!("Failed to clear notifications: {:?}", err))
}
