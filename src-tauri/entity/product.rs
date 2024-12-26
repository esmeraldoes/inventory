#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "products")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub measurement: String,
    #[sea_orm(default_value = "active")]
    pub status: String, // Default value is "active"
    pub company_id: i32,
    pub created_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(belongs_to = "super::company::Model")]
    Company,
    #[sea_orm(has_many = "super::stock::Model")]
    Stock,
}

impl ActiveModelBehavior for ActiveModel {}
