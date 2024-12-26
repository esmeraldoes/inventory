use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct CaseBill {
    pub id: i64,
    pub name: String,
    pub mobile_number: String,
    pub address: Option<String>,
    pub case_bill_amount: f64,
    pub date: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewCaseBill {
    pub name: String,
    pub mobile_number: String,
    pub address: Option<String>,
    pub case_bill_amount: f64,
    pub date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateCaseBill {
    pub name: Option<String>,
    pub mobile_number: Option<String>,
    pub address: Option<String>,
    pub case_bill_amount: Option<f64>,
    pub date: Option<String>,
}
