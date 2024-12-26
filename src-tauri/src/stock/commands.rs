use crate::db::Database;
use crate::stock::models::{NewStock, UpdateStock};
use crate::stock::services::StockService;

use serde_json::json;
use tauri::State;

#[tauri::command]
pub async fn create_stock(
    db: State<'_, Database>,
    new_stock: NewStock,
) -> Result<serde_json::Value, String> {
    let service = StockService { db: &db };
    match service.create_stock(new_stock).await {
        Ok(stock) => Ok(json!({ "success": true, "data": stock })),
        Err(err) => {
            eprintln!("Error creating stock: {:?}", err);
            Err("Failed to create stock.".into())
        }
    }
}

#[tauri::command]
pub async fn get_all_stocks(db: State<'_, Database>) -> Result<serde_json::Value, String> {
    let service = StockService { db: &db };
    match service.get_all_stocks().await {
        Ok(stocks) => Ok(json!({ "success": true, "data": stocks })),
        Err(err) => {
            eprintln!("Error retrieving stocks: {:?}", err);
            Err("Failed to retrieve stocks.".into())
        }
    }
}

#[tauri::command]
pub async fn get_all_stocks_with_relations(
    db: State<'_, Database>,
) -> Result<serde_json::Value, String> {
    let service = StockService { db: &db };
    match service.get_all_stocks_with_relations().await {
        Ok(stocks) => Ok(json!({ "success": true, "data": stocks })),
        Err(err) => {
            eprintln!("Error retrieving stocks with relations: {:?}", err);
            Err("Failed to retrieve stocks with relations.".into())
        }
    }
}

#[tauri::command]
pub async fn get_stock_by_id(
    db: State<'_, Database>,
    id: i64,
) -> Result<serde_json::Value, String> {
    let service = StockService { db: &db };
    match service.get_stock_by_id(id).await {
        Ok(Some(stock)) => Ok(json!({ "success": true, "data": stock })),
        Ok(None) => Err("Stock not found.".into()),
        Err(err) => {
            eprintln!("Error retrieving stock by ID: {:?}", err);
            Err("Failed to retrieve stock.".into())
        }
    }
}

#[tauri::command]
pub async fn update_stock(
    db: State<'_, Database>,
    id: i64,
    update: UpdateStock,
) -> Result<serde_json::Value, String> {
    let service = StockService { db: &db };
    match service.update_stock(id, update).await {
        Ok(Some(stock)) => Ok(json!({ "success": true, "data": stock })),
        Ok(None) => Err("Stock not found.".into()),
        Err(err) => {
            eprintln!("Error updating stock: {:?}", err);
            Err("Failed to update stock.".into())
        }
    }
}

#[tauri::command]
pub async fn delete_stock(db: State<'_, Database>, id: i64) -> Result<serde_json::Value, String> {
    let service = StockService { db: &db };
    match service.delete_stock(id).await {
        Ok(rows_affected) => Ok(json!({ "success": true, "rows_affected": rows_affected })),
        Err(err) => {
            eprintln!("Error deleting stock: {:?}", err);
            Err("Failed to delete stock.".into())
        }
    }
}
