use crate::company::services::CompanyService;
use crate::{
    company::models::{NewCompany, UpdateCompany},
    db::Database,
};
use serde_json::{json, Value as JsonValue};
use tauri::Result;

#[tauri::command]
pub async fn create_company(
    db: tauri::State<'_, Database>,
    new_company: NewCompany,
) -> Result<JsonValue> {
    let service = CompanyService { db: &db };
    println!("Adding new company: {:?}", new_company);

    match service.create_company(new_company).await {
        Ok(company) => Ok(json!({ "success": true, "data": company })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn get_all_companies(db: tauri::State<'_, Database>) -> Result<JsonValue> {
    let service = CompanyService { db: &db };
    match service.get_all_companies().await {
        Ok(companies) => Ok(json!({ "success": true, "data": companies })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn get_company_by_id(db: tauri::State<'_, Database>, id: i64) -> Result<JsonValue> {
    let service = CompanyService { db: &db };
    match service.get_company_by_id(id).await {
        Ok(Some(company)) => Ok(json!({ "success": true, "data": company })),
        Ok(None) => Ok(json!({ "success": false, "message": "Company not found" })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn update_company(
    db: tauri::State<'_, Database>,
    id: i64,
    update: UpdateCompany,
) -> Result<JsonValue> {
    let service = CompanyService { db: &db };
    match service.update_company(id, update).await {
        Ok(Some(company)) => Ok(json!({ "success": true, "data": company })),
        Ok(None) => Ok(json!({ "success": false, "message": "Company not found" })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}

#[tauri::command]
pub async fn delete_company(db: tauri::State<'_, Database>, id: i64) -> Result<JsonValue> {
    let service = CompanyService { db: &db };
    match service.delete_company(id).await {
        Ok(rows_affected) => Ok(json!({ "success": true, "rows_affected": rows_affected })),
        Err(err) => Ok(json!({ "success": false, "error": err.to_string() })),
    }
}
