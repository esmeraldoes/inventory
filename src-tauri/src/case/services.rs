use crate::{
    case::models::{CaseBill, NewCaseBill, UpdateCaseBill},
    db::Database,
};
use sqlx::Result;

use chrono::Utc;

pub struct CaseBillService<'a> {
    pub db: &'a Database,
}

impl<'a> CaseBillService<'a> {
    // Create a new case bill
    pub async fn create_case_bill(&self, new_case_bill: NewCaseBill) -> Result<CaseBill> {
        let query = r#"
                INSERT INTO case_bills (name, mobile_number, address, case_bill_amount, date)
                VALUES (?, ?, ?, ?, ?)
                RETURNING id, name, mobile_number, address, case_bill_amount, date, created_at
            "#;

        sqlx::query_as::<_, CaseBill>(query)
            .bind(new_case_bill.name)
            .bind(new_case_bill.mobile_number)
            .bind(new_case_bill.address)
            .bind(new_case_bill.case_bill_amount)
            .bind(new_case_bill.date)
            .fetch_one(&self.db.pool)
            .await
        // {
        //     Ok(case) => Ok(case),
        //     Err(err) => {
        //         eprintln!("Database insertion failed: {:?}", err);
        //         Err(err)
        //     }
        // }
    }

    // Get all case bills
    pub async fn get_all_case_bills(&self) -> Result<Vec<CaseBill>> {
        let query = r#"
                SELECT id, name, mobile_number, address, case_bill_amount, date, created_at
                FROM case_bills
                ORDER BY created_at DESC
            "#;

        sqlx::query_as::<_, CaseBill>(query)
            .fetch_all(&self.db.pool)
            .await
        // {
        //     Ok(case) => Ok(case),
        //     Err(err) => {
        //         eprintln!("Database insertion failed: {:?}", err);
        //         Err(err)
        //     }
        // }
    }

    // Get a case bill by ID
    pub async fn get_case_bill_by_id(&self, id: i64) -> Result<Option<CaseBill>> {
        let query = r#"
                SELECT id, name, mobile_number, address, case_bill_amount, date, created_at
                FROM case_bills
                WHERE id = ?
            "#;

        sqlx::query_as::<_, CaseBill>(query)
            .bind(id)
            .fetch_optional(&self.db.pool)
            .await

        // {
        //     Ok(case) => Ok(case),
        //     Err(err) => {
        //         eprintln!("Database insertion failed: {:?}", err);
        //         Err(err)
        //     }
        // }
    }

    // Update a case bill
    pub async fn update_case_bill(
        &self,
        id: i64,
        update_case_bill: UpdateCaseBill,
    ) -> Result<Option<CaseBill>> {
        let query = r#"
                UPDATE case_bills
                SET 
                    name = COALESCE(?, name),
                    mobile_number = COALESCE(?, mobile_number),
                    address = COALESCE(?, address),
                    case_bill_amount = COALESCE(?, case_bill_amount),
                    date = COALESCE(?, date)
                WHERE id = ?
                RETURNING id, name, mobile_number, address, case_bill_amount, date, created_at
            "#;

        sqlx::query_as::<_, CaseBill>(query)
            .bind(update_case_bill.name)
            .bind(update_case_bill.mobile_number)
            .bind(update_case_bill.address)
            .bind(update_case_bill.case_bill_amount)
            .bind(update_case_bill.date)
            .bind(id)
            .fetch_optional(&self.db.pool)
            .await

        // {
        //     Ok(case) => Ok(case),
        //     Err(err)=>{
        //         eprintln!("Error deleting company from database: {:?}", err);
        //         Err(err)
        //     }
        // }
    }

    // Delete a case bill by ID

    pub async fn delete_case_bill(&self, id: i64) -> Result<u64> {
        let query = "DELETE FROM case_bills WHERE id = ?";

        match sqlx::query(query).bind(id).execute(&self.db.pool).await {
            Ok(result) => Ok(result.rows_affected()),
            Err(err) => {
                eprintln!("Error deleting company from database: {:?}", err);
                Err(err)
            }
        }
    }

    pub async fn get_total_case_bills(&self) -> Result<i64> {
        let query = "SELECT COUNT(*) as total FROM case_bills";
        let result: (i64,) = sqlx::query_as(query).fetch_one(&self.db.pool).await?;
        Ok(result.0)
    }

    pub async fn get_case_bills_today(&self) -> Result<i64> {
        let query = r#"
            SELECT COUNT(*) as total 
            FROM case_bills 
            WHERE DATE(created_at) = DATE(?)
        "#;

        let today = Utc::now().date_naive();
        let result: (i64,) = sqlx::query_as(query)
            .bind(today)
            .fetch_one(&self.db.pool)
            .await?;
        Ok(result.0)
    }
}
