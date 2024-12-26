use sea_orm::entity::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "stocks")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub product_id: i32,
    pub company_id: i32,
    pub measurement: String,
    pub price: Decimal,
    pub quantity: i32,
    pub status: String,
    pub image: Option<String>,
    pub date: Date,
    pub created_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(belongs_to = "super::product::Model")]
    Product,
    #[sea_orm(belongs_to = "super::company::Model")]
    Company,
}
