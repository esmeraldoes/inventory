use crate::db::Database;
use crate::stock::models::{NewStock, Stock, StockWithRelations, UpdateStock};

use sqlx::Result;
use std::fs;
use std::io;
use std::path::Path;
use base64::engine::general_purpose::STANDARD;
use base64::Engine;

pub struct StockService<'a> {
    pub db: &'a Database,
}

impl<'a> StockService<'a> {
    pub fn store_image(&self, base64_image: &str) -> Result<Option<String>, io::Error> {
        let dir = "images";
        if !Path::new(dir).exists() {
            fs::create_dir_all(dir)?;
        }
        let decoded_image = STANDARD.decode(base64_image)
        // .map_err(|err| format!("Failed to decode base64 image: {:?}", err))?;
        // let decoded_image = base64::decode(base64_image)
        .map_err(|err| {
            io::Error::new(
                io::ErrorKind::InvalidData,
                format!("Failed to decode image: {:?}", err),
            )
        })?;
        let file_name = format!("images/{}.png", uuid::Uuid::new_v4());
        fs::write(&file_name, decoded_image).map_err(|err| {
            io::Error::new(
                io::ErrorKind::Other,
                format!("Failed to store image: {:?}", err),
            )
        })?;
        Ok(Some(file_name))
    }

    pub async fn create_stock(&self, new_stock: NewStock) -> Result<Stock> {
        // Handle image storage if applicable
        let stored_image = match new_stock.image {
            Some(ref img_data) => {
                self.store_image(img_data)
                    .map_err(|e| sqlx::Error::ColumnDecode {
                        index: "image".into(),
                        source: Box::new(e),
                    })?
            }
            None => None,
        };
    
        // Check if a stock entry already exists for the same product and company
        let existing_stock_query = r#"
            SELECT * FROM stocks 
            WHERE product_id = ? AND company_id = ?
        "#;
    
        if let Some(existing_stock) = sqlx::query_as::<_, Stock>(existing_stock_query)
            .bind(new_stock.product_id)
            .bind(new_stock.company_id)
            .fetch_optional(&self.db.pool)
            .await?
        {
            // Update the existing stock's quantity, price, and other fields
            let update_query = r#"
                UPDATE stocks
                SET quantity = quantity + ?, 
                    price = ?, 
                    measurement = ?, 
                    status = 'In Stock', 
                    image = COALESCE(?, image), 
                    date = ?, 
                    created_at = CURRENT_TIMESTAMP
                WHERE id = ?
                RETURNING *
            "#;
    

            let updated_stock = sqlx::query_as::<_, Stock>(update_query)
                .bind(new_stock.quantity)
                .bind(new_stock.price)
                .bind(new_stock.measurement)
                .bind(stored_image)
                .bind(new_stock.date)
                .bind(existing_stock.id)
                .fetch_one(&self.db.pool)
                .await?;

             // Create a low stock notification if quantity is below threshold
             if updated_stock.quantity < 10 {
                self.create_low_stock_notification(&updated_stock).await?;
            }

            // Create a notification for stock creation (update case)
            self.create_stock_created_notification(&updated_stock).await?;
    
            return Ok(updated_stock);
        }
    
        // Insert a new stock record if no existing stock was found
        let insert_query = r#"
            INSERT INTO stocks (product_id, company_id, measurement, price, quantity, status, image, date, created_at)
            VALUES (?, ?, ?, ?, ?, 'In Stock', ?, ?, CURRENT_TIMESTAMP)
            RETURNING *
        "#;
    
        // sqlx::query_as::<_, Stock>(insert_query)
        let inserted_stock = sqlx::query_as::<_, Stock>(insert_query)

            .bind(new_stock.product_id)
            .bind(new_stock.company_id)
            .bind(new_stock.measurement)
            .bind(new_stock.price)
            .bind(new_stock.quantity)
            .bind(stored_image)
            .bind(new_stock.date)
            .fetch_one(&self.db.pool)
            .await?;

        // Create a low stock notification if quantity is below threshold
        if inserted_stock.quantity < 10 {
            self.create_low_stock_notification(&inserted_stock).await?;
        }

        // Create a notification for stock creation (new stock)
        self.create_stock_created_notification(&inserted_stock).await?;

        Ok(inserted_stock)
    }

    
    async fn create_low_stock_notification(&self, stock: &Stock) -> Result<()> {
        let notification_query = r#"
            INSERT INTO notifications (title, description, product_id, related_quantity, measurement, company_id, created_at)
            VALUES ('Low Stock', 'Stock is running low', ?, ?, ?, ?, CURRENT_TIMESTAMP)
        "#;
        sqlx::query(notification_query)
            .bind(&stock.product_id)
            .bind(stock.quantity.to_string())
            .bind(&stock.measurement)
            .bind(&stock.company_id)
            .execute(&self.db.pool)
            .await?;

        Ok(())
    }

    async fn create_stock_created_notification(&self, stock: &Stock) -> Result<()> {
        let notification_query = r#"
            INSERT INTO notifications (title, description, product_id, related_quantity, measurement, company_id, created_at)
            VALUES ('Stock Created', 'New stock has been added', ?, ?, ?, ?, CURRENT_TIMESTAMP)
        "#;
        sqlx::query(notification_query)
            .bind(&stock.product_id)
            .bind(stock.quantity.to_string())
            .bind(&stock.measurement)
            .bind(&stock.company_id)
            .execute(&self.db.pool)
            .await?;

        Ok(())
    }
    
    /// Retrieve all stocks
    pub async fn get_all_stocks(&self) -> Result<Vec<Stock>> {
        let query = "SELECT * FROM stocks";
        sqlx::query_as::<_, Stock>(query)
            .fetch_all(&self.db.pool)
            .await
    }

    /// Retrieve a stock by ID
    pub async fn get_stock_by_id(&self, id: i64) -> Result<Option<Stock>> {
        let query = "SELECT * FROM stocks WHERE id = ?";
        sqlx::query_as::<_, Stock>(query)
            .bind(id)
            .fetch_optional(&self.db.pool)
            .await
    }

    /// Retrieve all stocks with associated product and company data
    pub async fn get_all_stocks_with_relations(&self) -> Result<Vec<StockWithRelations>> {
        let query = r#"
            SELECT 
                s.*, 
                p.name AS product_name, 
                c.name AS company_name
            FROM stocks s
            LEFT JOIN products p ON s.product_id = p.id
            LEFT JOIN companies c ON s.company_id = c.id
        "#;

        let result = sqlx::query_as::<_, StockWithRelations>(query)
            // sqlx::query_as::<_, StockWithRelations>(query)
            .fetch_all(&self.db.pool)
            .await;

        match &result {
            Ok(stocks) => {
                // println!("Stocks with relations"); // Debug print here
                println!("Stocks with relations: {:#?}", stocks); // Debug print here
            }
            Err(err) => {
                eprintln!("Error fetching stocks with relations: {:?}", err); // Log error if any
            }
        }

        result
    }

    pub async fn update_stock(&self, id: i64, update: UpdateStock) -> Result<Option<Stock>> {
        let stored_image = match update.image {
            Some(ref img_data) => {
                self.store_image(img_data)
                    .map_err(|e| sqlx::Error::ColumnDecode {
                        index: "image".into(),
                        source: Box::new(e),
                    })?
            }
            None => None,
        };

        let query = r#"
            UPDATE stocks
            SET 
                measurement = COALESCE(?, measurement),
                price = COALESCE(?, price),
                quantity = COALESCE(?, quantity),
                status = COALESCE(?, status),
                image = COALESCE(?, image)
            WHERE id = ?
            RETURNING *
        "#;

        sqlx::query_as::<_, Stock>(query)
            .bind(update.measurement)
            .bind(update.price)
            .bind(update.quantity)
            .bind(update.status)
            .bind(stored_image)
            .bind(id)
            .fetch_optional(&self.db.pool)
            .await
    }

    /// Delete a stock by ID
    pub async fn delete_stock(&self, id: i64) -> Result<u64> {
        let query = "DELETE FROM stocks WHERE id = ?";
        sqlx::query(query)
            .bind(id)
            .execute(&self.db.pool)
            .await
            .map(|res| res.rows_affected())
    }
}
