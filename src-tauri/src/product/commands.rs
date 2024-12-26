use crate::{db::Database, product::models::{NewProduct, UpdateProduct}};
use crate::product::services::ProductService;
use tauri::{State};

use serde_json::json;


#[tauri::command]
pub async fn create_product(db: State<'_, Database>, new_product: NewProduct) -> Result<serde_json::Value, String> {
    let service = ProductService { db: &db };
    println!("Adding new product: {:?}", new_product);
    match service.create_product(new_product).await {
        Ok(product) => Ok(json!({ "success": true, "data": product })),
        Err(err) => {
            eprintln!("Error creating product: {:?}", err);
            Err("Failed to create product.".into())
        }
    }
}


// #[tauri::command]
// pub async fn create_product(db: State<'_, Database>, new_product: NewProduct) -> Result<serde_json::Value, String> {
//     let service = ProductService { db: &db };
//     println!("Adding new product: {:?}", new_product);

//     match service.create_product(new_product).await {
//         Ok(product) => Ok(json!({ "success": true, "data": product })),
//         Err(err) => {
//             let error_message = format!("Error creating product: {:?}", err);
//             eprintln!("{}", error_message);
//             Err(error_message) // Return the full error message to the frontend
//         }
//     }
// }




#[tauri::command]
pub async fn get_all_products(db: State<'_, Database>) -> Result<serde_json::Value, String> {
    let service = ProductService { db: &db };
    
    match service.get_all_products().await {
        
        Ok(products) => Ok(json!({ "success": true, "data": products })),
        Err(err) => {
            eprintln!("Error retrieving products: {:?}", err);
            Err("Failed to retrieve products.".into())
        }
    }
}

#[tauri::command]
pub async fn get_product_by_id(db: State<'_, Database>, id: i64) -> Result<serde_json::Value, String> {
    let service = ProductService { db: &db };
    match service.get_product_by_id(id).await {
        Ok(Some(product)) => Ok(json!({ "success": true, "data": product })),
        Ok(None) => Err("Product not found.".into()),
        Err(err) => {
            eprintln!("Error retrieving product by ID: {:?}", err);
            Err("Failed to retrieve product.".into())
        }
    }
}

#[tauri::command]
pub async fn update_product(db: State<'_, Database>, id: i64, update: UpdateProduct) -> Result<serde_json::Value, String> {
    let service = ProductService { db: &db };
    match service.update_product(id, update).await {
        Ok(Some(product)) => Ok(json!({ "success": true, "data": product })),
        Ok(None) => Err("Product not found.".into()),
        Err(err) => {
            eprintln!("Error updating product: {:?}", err);
            Err("Failed to update product.".into())
        }
    }
}

#[tauri::command]
pub async fn delete_product(db: State<'_, Database>, id: i64) -> Result<serde_json::Value, String> {
    let service = ProductService { db: &db };
    match service.delete_product(id).await {
        Ok(rows_affected) => Ok(json!({ "success": true, "rows_affected": rows_affected })),
        Err(err) => {
            eprintln!("Error deleting product: {:?}", err);
            Err("Failed to delete product.".into())
        }
    }
}


#[tauri::command]
pub async fn get_all_products_with_companies(db: State<'_, Database>) -> Result<serde_json::Value, String> {
    let service = ProductService { db: &db };
    match service.get_all_products_with_companies().await {
        Ok(products) => Ok(json!({ "success": true, "data": products })),
        Err(err) => {
            eprintln!("Error retrieving products with companies: {:?}", err);
            Err("Failed to retrieve products.".into())
        }
    }
}


#[tauri::command]
pub async fn get_products_by_company(db: State<'_, Database>, company_id: i32) -> Result<serde_json::Value, String> {
    let service = ProductService { db: &db };
    match service.get_products_by_company(company_id).await {
        Ok(products) => Ok(json!({ "success": true, "data": products })),
        Err(err) => {
            eprintln!("Error retrieving products for company {}: {:?}", company_id, err);
            Err("Failed to retrieve products.".into())
        }
    }
}


