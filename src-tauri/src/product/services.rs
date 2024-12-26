use crate::db::Database;
use crate::product::models::{NewProduct, Product, UpdateProduct, ProductWithCompany};
use sqlx::Result;


pub struct ProductService<'a> {
    pub db: &'a Database,
}



impl<'a> ProductService<'a> {
    /// Create a new product
    pub async fn create_product(&self, new_product: NewProduct) -> Result<Product, String> {
        let query = r#"
            INSERT INTO products (name, measurement, status, company_id, created_at)
            VALUES (?, ?, 'active', ?, CURRENT_TIMESTAMP)
            RETURNING id, name, measurement, status, company_id, created_at
        "#;

        sqlx::query_as::<_, Product>(query)
            .bind(new_product.name)
            .bind(new_product.measurement)
            .bind(new_product.company_id)
            .fetch_one(&self.db.pool)
            .await
            .map_err(|err| {
                let detailed_error = format!("Database insertion failed: {:?}", err);
                eprintln!("{}", detailed_error);
                detailed_error
            })
    }



    /// Create a new product
    // pub async fn create_product(&self, new_product: NewProduct) -> Result<Product> {
    //     let query = r#"
    //         INSERT INTO products (name, measurement, status, company_id, created_at)
    //         VALUES (?, ?, 'active', ?, CURRENT_TIMESTAMP)
    //         RETURNING id, name, measurement, status, company_id, created_at
    //     "#;

    //     match sqlx::query_as::<_, Product>(query)
    //         .bind(new_product.name)
    //         .bind(new_product.measurement)
    //         .bind(new_product.company_id)
    //         .fetch_one(&self.db.pool)
    //         .await
    //     {
    //         Ok(product) => Ok(product),
    //         Err(err) => {
    //             eprintln!("Database insertion failed: {:?}", err);
    //             Err(err)
    //         }
    //     }
    // }

    // Baddas


    pub async fn get_all_products_with_companies(&self) -> Result<Vec<ProductWithCompany>> {
        let query = r#"
            SELECT 
                p.id, p.name, p.measurement, p.status, p.company_id, p.created_at,
                c.name AS company_name
            FROM products p
            LEFT JOIN companies c ON p.company_id = c.id
        "#;

        match sqlx::query_as::<_, ProductWithCompany>(query)
            .fetch_all(&self.db.pool)
            .await
        {
            Ok(products) => Ok(products),
            Err(err) => {
                eprintln!("Failed to retrieve products with companies: {:?}", err);
                Err(err)
            }
        }
    }



    pub async fn get_products_by_company(&self, company_id: i32) -> Result<Vec<ProductWithCompany>> {
        let query = r#"
            SELECT 
                p.id, p.name, p.measurement, p.status, p.company_id, p.created_at,
                c.name AS company_name
            FROM products p
            LEFT JOIN companies c ON p.company_id = c.id
            WHERE p.company_id = $1
        "#;
    
        match sqlx::query_as::<_, ProductWithCompany>(query)
            .bind(company_id) // Bind the company ID to the query
            .fetch_all(&self.db.pool)
            .await
        {
            Ok(products) => Ok(products),
            Err(err) => {
                eprintln!("Failed to retrieve products for company {}: {:?}", company_id, err);
                Err(err)
            }
        }
    }
    


    /// Retrieve all products
    pub async fn get_all_products(&self) -> Result<Vec<Product>> {
        let query = "SELECT id, name, measurement, status, company_id, created_at FROM products";

        match sqlx::query_as::<_, Product>(query)
            .fetch_all(&self.db.pool)
            .await
        {
            Ok(products) => Ok(products),
            Err(err) => {
                eprintln!("Failed to retrieve products: {:?}", err);
                Err(err)
            }
        }
    }

    /// Retrieve a product by ID
    pub async fn get_product_by_id(&self, id: i64) -> Result<Option<Product>> {
        let query = r#"
            SELECT id, name, measurement, status, company_id, created_at
            FROM products
            WHERE id = ?
        "#;

        match sqlx::query_as::<_, Product>(query)
            .bind(id)
            .fetch_optional(&self.db.pool)
            .await
        {
            Ok(product) => Ok(product),
            Err(err) => {
                eprintln!("Failed to retrieve product: {:?}", err);
                Err(err)
            }
        }
    }

    /// Update an existing product
    pub async fn update_product(&self, id: i64, update: UpdateProduct) -> Result<Option<Product>> {
        let query = r#"
            UPDATE products
            SET 
                name = COALESCE(?, name),
                measurement = COALESCE(?, measurement),
                status = COALESCE(?, status)
            WHERE id = ?
            RETURNING id, name, measurement, status, company_id, created_at
        "#;

        match sqlx::query_as::<_, Product>(query)
            .bind(update.name)
            .bind(update.measurement)
            .bind(update.status)
            .bind(id)
            .fetch_optional(&self.db.pool)
            .await
        {
            Ok(product) => Ok(product),
            Err(err) => {
                eprintln!("Failed to update product: {:?}", err);
                Err(err)
            }
        }
    }

    /// Delete a product
    pub async fn delete_product(&self, id: i64) -> Result<u64> {
        let query = "DELETE FROM products WHERE id = ?";

        match sqlx::query(query)
            .bind(id)
            .execute(&self.db.pool)
            .await
        {
            Ok(result) => Ok(result.rows_affected()),
            Err(err) => {
                eprintln!("Failed to delete product: {:?}", err);
                Err(err)
            }
        }
    }
}

