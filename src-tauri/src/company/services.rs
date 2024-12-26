use crate::{
    company::models::{Company, NewCompany, UpdateCompany},
    db::Database,
};
use sqlx::Result;

pub struct CompanyService<'a> {
    pub db: &'a Database,
}

impl<'a> CompanyService<'a> {
    /// Create a new company and return the inserted record
    pub async fn create_company(&self, new_company: NewCompany) -> Result<Company> {
        let query = r#"
            INSERT INTO companies (name, status, created_at)
            VALUES (?, 'active', CURRENT_TIMESTAMP)
            RETURNING id, name, status, created_at
        "#;
        match sqlx::query_as::<_, Company>(query)
            .bind(new_company.name)
            .fetch_one(&self.db.pool)
            .await
        {
            Ok(company) => Ok(company),
            Err(err) => {
                eprintln!("Error inserting company into database: {:?}", err);
                Err(err)
            }
        }
    }

    /// Retrieve a company by its ID
    pub async fn get_company_by_id(&self, id: i64) -> Result<Option<Company>> {
        let query = r#"
            SELECT id, name, status, created_at
            FROM companies
            WHERE id = ?
        "#;
        match sqlx::query_as::<_, Company>(query)
            .bind(id)
            .fetch_optional(&self.db.pool)
            .await
        {
            Ok(company) => Ok(company),
            Err(err) => {
                eprintln!("Error fetching company by ID from database: {:?}", err);
                Err(err)
            }
        }
    }

    /// Retrieve all companies from the database
    pub async fn get_all_companies(&self) -> Result<Vec<Company>> {
        let query = "SELECT id, name, status, created_at FROM companies";
        match sqlx::query_as::<_, Company>(query)
            .fetch_all(&self.db.pool)
            .await
        {
            Ok(companies) => Ok(companies),
            Err(err) => {
                eprintln!("Error fetching companies from database: {:?}", err);
                Err(err)
            }
        }
    }

    /// Update a company and return the updated record, if it exists
    pub async fn update_company(&self, id: i64, update: UpdateCompany) -> Result<Option<Company>> {
        let query = r#"
            UPDATE companies
            SET name = COALESCE(?, name),
                status = COALESCE(?, status)
            WHERE id = ?
            RETURNING id, name, status, created_at
        "#;
        match sqlx::query_as::<_, Company>(query)
            .bind(update.name)
            .bind(update.status)
            .bind(id)
            .fetch_optional(&self.db.pool)
            .await
        {
            Ok(updated_company) => Ok(updated_company),
            Err(err) => {
                eprintln!("Error updating company in database: {:?}", err);
                Err(err)
            }
        }
    }

    /// Delete a company and return the number of rows affected
    pub async fn delete_company(&self, id: i64) -> Result<u64> {
        let query = "DELETE FROM companies WHERE id = ?";
        match sqlx::query(query).bind(id).execute(&self.db.pool).await {
            Ok(result) => Ok(result.rows_affected()),
            Err(err) => {
                eprintln!("Error deleting company from database: {:?}", err);
                Err(err)
            }
        }
    }
}
