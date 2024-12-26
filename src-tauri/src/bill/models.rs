use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Bill {
    pub id: i64,
    pub customer_name: String,
    pub customer_phone: String,
    pub address: String,
    pub company_id: i64,
    pub date: String,
    pub total_cost: f64,
    pub freight: Option<f64>,
    pub hammali: Option<f64>,
    pub case_amount: Option<f64>,
    pub total_amount: f64,
    pub remark: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewBill {
    pub customer_name: String,
    pub customer_phone: String,
    pub address: String,
    pub company_id: i64,
    pub date: String,
    pub total_cost: f64,
    pub freight: Option<f64>,
    pub hammali: Option<f64>,
    pub case_amount: Option<f64>,
    pub total_amount: f64,
    pub remark: Option<String>,
    pub items: Vec<NewBillItem>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateBill {
    pub customer_name: Option<String>,
    pub customer_phone: Option<String>,
    pub address: Option<String>,
    pub total_cost: Option<f64>,
    pub freight: Option<f64>,
    pub hammali: Option<f64>,
    pub case_amount: Option<f64>,
    pub total_amount: Option<f64>,
    pub remark: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct BillItem {
    pub id: i64,
    pub bill_id: i64,
    pub product_id: i64,
    pub measurement: String,
    pub quantity: i32,
    pub rate: f64,
    pub value: f64,
    pub row_total: f64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewBillItem {
    pub product_id: i64,
    pub measurement: String,
    pub quantity: i32,
    pub rate: f64,
    pub value: f64,
    pub row_total: f64,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct BillWithItems {
    pub bill: Bill,
    pub items: Vec<BillItem>,
}

// #[derive(Debug, sqlx::FromRow)]
// pub struct Product {
//     pub id: i64,
//     pub name: String,
//     pub description: Option<String>,
//     pub price: f64,
//     pub created_at: chrono::NaiveDateTime,
// }

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Product {
    pub id: i64,
    pub name: String,
    pub measurement: String,
    pub status: String,
    pub company_id: i64,
    pub created_at: String,
}
// #[derive(Debug, sqlx::FromRow)]
// pub struct BillItem {
//     pub id: i64,
//     pub bill_id: i64,
//     pub product_id: i64,
//     pub product_name: String, // From the `products` table
//     pub measurement: String,
//     pub quantity: i64,
//     pub rate: f64,
//     pub value: f64,
//     pub row_total: f64,
//     pub created_at: chrono::NaiveDateTime,
// }
