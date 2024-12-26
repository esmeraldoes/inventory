use serde::{Deserialize, Serialize};
use sqlx::FromRow;

// Represents a single company record
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Company {
    pub id: i64,
    pub name: String,
    pub status: String,
    pub created_at: String,
}

// Input for creating a new company
#[derive(Debug, Serialize, Deserialize)]
pub struct NewCompany {
    pub name: String,
}

// Input for updating a company
#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateCompany {
    pub name: Option<String>,
    pub status: Option<String>,
}
