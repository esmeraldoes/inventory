use serde::{Deserialize, Serialize};
use sqlx::FromRow;

/// Represents a stock record.
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Stock {
    pub id: i64,
    pub product_id: i64,
    pub company_id: i64,
    pub measurement: String,
    pub price: f64,
    pub quantity: i32,
    pub status: String,
    pub image: Option<String>,
    pub date: String,
    pub created_at: String,
}

/// DTO for creating a new stock.
#[derive(Debug, Serialize, Deserialize)]
pub struct NewStock {
    pub product_id: i64,
    pub company_id: i64,
    pub measurement: String,
    pub price: f64,
    pub quantity: i32,
    pub status: Option<String>,
    pub image: Option<String>,
    pub date: String,
}

/// DTO for updating a stock.
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateStock {
    pub measurement: Option<String>,
    pub price: Option<f64>,
    pub quantity: Option<i32>,
    pub status: Option<String>,
    pub image: Option<String>,
}

/// Represents a stock along with related product and company data.
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct StockWithRelations {
    pub id: i64,
    pub product_id: i64,
    pub product_name: Option<String>, // Nullable if product is missing
    pub company_id: i64,
    pub company_name: Option<String>, // Nullable if company is missing
    pub measurement: String,
    pub price: f64,
    pub quantity: i32,
    pub status: String,
    pub image: Option<String>,
    pub date: String,
    pub created_at: String,
}
