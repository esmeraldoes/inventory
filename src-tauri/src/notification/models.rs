use serde::Serialize;
// use serde::{Deserialize, Serialize};
use sqlx::FromRow;
// #[derive(Serialize)]
// pub struct Notification {
//     pub id: i64,
//     pub message: String,
//     pub created_at: String,
// }


// use serde::{Deserialize, Serialize};
// use sqlx::FromRow;

// #[derive(FromRow, Serialize, Deserialize)]

#[derive(Debug, serde::Serialize, sqlx::FromRow)]
pub struct Notification {
    pub id: i64,
    pub title: String, 
    pub description: String,
    pub company_id: Option<i64>,
    pub product_id: Option<i64>,
    pub related_quantity: Option<String>,
    pub measurement: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub is_read: bool,
}
