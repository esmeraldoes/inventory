use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Product {
    pub id: i64,
    pub name: String,
    pub measurement: String,
    pub status: String,
    pub company_id: i64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewProduct {
    pub name: String,
    pub measurement: String,
    pub company_id: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateProduct {
    pub name: Option<String>,
    pub measurement: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct ProductWithCompany {
    pub id: i64,
    pub name: String,
    pub measurement: String,
    pub status: String,
    pub company_id: i64,
    pub company_name: Option<String>, // Company name can be null if the company is missing
    pub created_at: String,
}


#[derive(Debug, serde::Serialize, sqlx::FromRow)]
pub struct Notification {
    pub id: i64,
    pub title: String,
    pub description: String,
    pub created_at: String, // Adjust based on your schema
}

