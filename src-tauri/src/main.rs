#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;

mod auth;
mod bill;
mod case;
mod company;
mod db;
mod product;
mod stock;
mod notification;

use db::Database;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let db = Database::new().await?;
    println!("Application started successfully.");

    db.initialize().await?;

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .manage(db) // Add Database to Tauri State
        .invoke_handler(tauri::generate_handler![
            auth::commands::login,
            auth::commands::logout,
            // Company commands
            company::commands::create_company,
            company::commands::get_all_companies,
            company::commands::get_company_by_id,
            company::commands::update_company,
            company::commands::delete_company,
            // Product commands
            product::commands::create_product,
            product::commands::get_all_products,
            product::commands::get_product_by_id,
            product::commands::get_all_products_with_companies,
            product::commands::get_products_by_company,
            product::commands::update_product,
            product::commands::delete_product,
            // Notification
            notification::commands::get_notifications,
            // notification::commands::mark_notification_as_read,
            // Stock commands
            stock::commands::create_stock,
            stock::commands::get_all_stocks,
            stock::commands::get_stock_by_id,
            stock::commands::get_all_stocks_with_relations,
            stock::commands::update_stock,
            stock::commands::delete_stock,
            // Bill commands
            bill::commands::create_bill,
            bill::commands::get_all_bills,
            bill::commands::get_bill_by_id,
            bill::commands::update_bill,
            bill::commands::delete_bill,
            bill::commands::get_total_bills,
            bill::commands::get_bills_today,
            // Case commands
            case::commands::create_case_bill,
            case::commands::get_all_case_bills,
            case::commands::get_case_bill_by_id,
            case::commands::update_case_bill,
            case::commands::delete_case_bill,
            case::commands::get_case_bills_today,
            case::commands::get_total_case_bills,
        ])
        .plugin(tauri_plugin_devtools::init())
        .run(tauri::generate_context!())
        .map_err(|e| Box::new(e) as Box<dyn Error>)?;

    Ok(())
}
