use crate::case::services::CaseBillService;
use crate::{
    case::models::{NewCaseBill, UpdateCaseBill},
    db::Database,
};
use serde_json::{json, Value as JsonValue};
use tauri::Result;

#[tauri::command]
pub async fn create_case_bill(
    db: tauri::State<'_, Database>,
    new_case_bill: NewCaseBill,
) -> Result<JsonValue> {
    let service = CaseBillService { db: &db };
    println!("Creating new case bill: {:?}", new_case_bill);

    match service.create_case_bill(new_case_bill).await {
        Ok(case_bill) => Ok(json!({ "success": true, "data": case_bill })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn get_all_case_bills(db: tauri::State<'_, Database>) -> Result<JsonValue> {
    let service = CaseBillService { db: &db };

    match service.get_all_case_bills().await {
        Ok(case_bills) => Ok(json!({ "success": true, "data": case_bills })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn get_case_bill_by_id(db: tauri::State<'_, Database>, id: i64) -> Result<JsonValue> {
    let service = CaseBillService { db: &db };

    match service.get_case_bill_by_id(id).await {
        Ok(Some(case_bill)) => Ok(json!({ "success": true, "data": case_bill })),
        Ok(None) => Ok(json!({ "success": false, "message": "Case bill not found" })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn update_case_bill(
    db: tauri::State<'_, Database>,
    id: i64,
    update_case_bill: UpdateCaseBill,
) -> Result<JsonValue> {
    let service = CaseBillService { db: &db };

    match service.update_case_bill(id, update_case_bill).await {
        Ok(Some(case_bill)) => Ok(json!({ "success": true, "data": case_bill })),
        Ok(None) => Ok(json!({ "success": false, "message": "Case bill not found" })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn delete_case_bill(db: tauri::State<'_, Database>, id: i64) -> Result<JsonValue> {
    let service = CaseBillService { db: &db };

    match service.delete_case_bill(id).await {
        Ok(rows_affected) => Ok(json!({ "success": true, "rows_affected": rows_affected })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn get_total_case_bills(db: tauri::State<'_, Database>) -> Result<JsonValue> {
    let service = CaseBillService { db: &db };
    match service.get_total_case_bills().await {
        Ok(total) => Ok(json!({ "success": true, "total_case_bills": total })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn get_case_bills_today(db: tauri::State<'_, Database>) -> Result<JsonValue> {
    let service = CaseBillService { db: &db };
    match service.get_case_bills_today().await {
        Ok(total) => Ok(json!({ "success": true, "case_bills_today": total })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}
