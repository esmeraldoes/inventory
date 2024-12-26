#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "bills")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub customer_name: String,
    pub customer_phone: String,
    pub address: String,
    pub company_id: i32,
    pub date: Date,
    pub total_cost: Decimal,
    pub freight: Option<Decimal>,
    pub hammali: Option<Decimal>,
    pub case_amount: Option<Decimal>,
    pub total_amount: Decimal, // total_cost + freight + hammali
    pub remark: Option<String>,
    pub created_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(belongs_to = "super::company::Model")]
    Company,
    #[sea_orm(has_many = "super::bill_item::Model")]
    BillItem,
}

impl ActiveModelBehavior for ActiveModel {}
