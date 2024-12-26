#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "bill_items")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub bill_id: i32,
    pub product_id: i32,
    pub measurement: String,
    pub quantity: i32,
    pub rate: Decimal,
    pub value: Decimal, // Computed as quantity * rate
    pub row_total: Decimal, // Includes discounts, taxes, etc.
    pub created_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(belongs_to = "super::bill::Model")]
    Bill,
    #[sea_orm(belongs_to = "super::product::Model")]
    Product,
}

impl ActiveModelBehavior for ActiveModel {}

























// use sea_orm::entity::prelude::*;
// use serde::{Serialize, Deserialize};

// #[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
// #[sea_orm(table_name = "bill_items")]
// pub struct Model {
//     #[sea_orm(primary_key)]
//     pub id: i32,
//     pub bill_id: i32,
//     pub product_id: i32,
//     pub measurement: String,
//     pub quantity: i32,
//     pub rate: Decimal,
//     pub value: Decimal,
//     pub row_total: Decimal,
//     pub created_at: DateTimeUtc,
// }

// #[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
// pub enum Relation {
//     #[sea_orm(belongs_to = "super::bill::Model")]
//     Bill,
//     #[sea_orm(belongs_to = "super::product::Model")]
//     Product,
// }
