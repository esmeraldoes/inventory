use crate::bill::models::{NewBill, UpdateBill};

use crate::{bill::services::BillService, db::Database};
use serde_json::{json, Value as JsonValue};
use tauri::Result;

#[tauri::command]
pub async fn create_bill(db: tauri::State<'_, Database>, new_bill: NewBill) -> Result<JsonValue> {
    let service = BillService { db: &db };
    match service.create_bill(new_bill).await {
        Ok(bill) => Ok(json!({ "success": true, "data": bill })),
        Err(err) => {
            // Log the error to the terminal
            eprintln!("Error in create_bill: {:?}", err);
            Ok(json!({ "success": false, "error": err.to_string() }))
        } // Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn get_all_bills(db: tauri::State<'_, Database>) -> Result<JsonValue> {
    let service = BillService { db: &db };
    match service.get_all_bills().await {
        Ok(bills) => Ok(json!({ "success": true, "data": bills })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn get_bill_by_id(db: tauri::State<'_, Database>, id: i64) -> Result<JsonValue> {
    let service = BillService { db: &db };
    match service.get_bill_by_id(id).await {
        Ok(Some(bill)) => Ok(json!({ "success": true, "data": bill })),
        Ok(None) => Ok(json!({ "success": false, "error": "Bill not found" })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn update_bill(
    db: tauri::State<'_, Database>,
    id: i64,
    update: UpdateBill,
) -> Result<JsonValue> {
    let service = BillService { db: &db };
    match service.update_bill(id, update).await {
        Ok(Some(bill)) => Ok(json!({ "success": true, "data": bill })),
        Ok(None) => Ok(json!({ "success": false, "error": "Bill not found" })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn delete_bill(db: tauri::State<'_, Database>, id: i64) -> Result<JsonValue> {
    let service = BillService { db: &db };
    match service.delete_bill(id).await {
        Ok(_) => Ok(json!({ "success": true })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn get_total_bills(db: tauri::State<'_, Database>) -> Result<JsonValue> {
    let service = BillService { db: &db };
    match service.get_total_bills().await {
        Ok(total) => Ok(json!({ "success": true, "total_bills": total })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn get_bills_today(db: tauri::State<'_, Database>) -> Result<JsonValue> {
    let service = BillService { db: &db };
    match service.get_bills_today().await {
        Ok(total) => Ok(json!({ "success": true, "bills_today": total })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}
