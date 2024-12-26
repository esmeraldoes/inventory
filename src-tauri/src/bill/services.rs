use crate::bill::models::{BillItem, BillWithItems};
use crate::{
    bill::models::{Bill, NewBill, UpdateBill},
    db::Database,
};

use sqlx::Result;
use chrono::Utc;

pub struct BillService<'a> {
    pub db: &'a Database,
}

impl<'a> BillService<'a> {
    pub async fn create_bill(&self, new_bill: NewBill) -> Result<Bill> {
        println!("Received NewBill: {:?}", new_bill);

        let mut transaction = self.db.pool.begin().await?;

        let customer_name = new_bill.customer_name.clone();

        // Fixed: Removed the RETURNING clause
        let insert_query = r#"
        INSERT INTO bills (customer_name, customer_phone, address, company_id, date, total_cost, freight, hammali, case_amount, total_amount, remark, created_at)
        VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, 0), COALESCE(?, 0), COALESCE(?, 0), ?, ?, CURRENT_TIMESTAMP)
        "#;

        sqlx::query(insert_query)
            .bind(&new_bill.customer_name)
            .bind(&new_bill.customer_phone)
            .bind(&new_bill.address)
            .bind(new_bill.company_id)
            .bind(&new_bill.date)
            .bind(new_bill.total_cost)
            .bind(new_bill.freight.unwrap_or_default())
            .bind(new_bill.hammali.unwrap_or_default())
            .bind(new_bill.case_amount.unwrap_or_default())
            .bind(new_bill.total_amount)
            .bind(&new_bill.remark)
            .execute(&mut *transaction)
            .await?;

        // Fixed: Fetch last inserted ID
        let last_id: i64 = sqlx::query_scalar("SELECT last_insert_rowid()")
            .fetch_one(&mut *transaction)
            .await?;

        let bill = sqlx::query_as::<_, Bill>(r#"
            SELECT id, customer_name, customer_phone, address, company_id, date, total_cost, freight, hammali, case_amount, total_amount, remark, created_at
            FROM bills
            WHERE id = ?
        "#)
        .bind(last_id)
        .fetch_one(&mut *transaction)
        .await?;

        // Insert associated bill items
        for item in &new_bill.items {
            sqlx::query(
                r#"
                INSERT INTO bill_items (bill_id, product_id, measurement, quantity, rate, value, row_total, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                "#,
            )
            .bind(bill.id)
            .bind(item.product_id)
            .bind(&item.measurement)
            .bind(item.quantity)
            .bind(item.rate)
            .bind(item.value)
            .bind(item.row_total)
            .execute(&mut *transaction)
            .await?;

            // Fixed: Ensure stock quantity is updated atomically
            let update_stock_query = r#"
            UPDATE stocks
            SET quantity = quantity - ?
            WHERE product_id = ? AND quantity >= ?
            "#;

            let rows_affected = sqlx::query(update_stock_query)
                .bind(item.quantity)
                .bind(item.product_id)
                .bind(item.quantity)
                .execute(&mut *transaction)
                .await?
                .rows_affected();

            if rows_affected == 0 {
                transaction.rollback().await?;
                return Err(sqlx::Error::RowNotFound); // Stock update failed
            }
        }

        // Fixed: Notification logic
        let notification_query = r#"
        INSERT INTO notifications (title, description, company_id, customer_name, total_amount, product_id, related_quantity, created_at)
        VALUES ('Bill Creation', ?, ?, ?, ?, NULL, NULL, CURRENT_TIMESTAMP)
        "#;

        
        let description = format!(
            "New bill created for customer: {}, Total Amount: {}",
            customer_name, new_bill.total_amount
        );
        sqlx::query(notification_query)
            .bind(description)
            .bind(new_bill.company_id)
            .bind(customer_name)
            .bind(new_bill.total_amount)
            .execute(&mut *transaction)
            .await?;


        // Commit the transaction
        transaction.commit().await?;

        Ok(bill)
    }

    pub async fn get_all_bills(&self) -> Result<Vec<Bill>> {
        let query = "SELECT * FROM bills ORDER BY created_at DESC";
        sqlx::query_as::<_, Bill>(query)
            .fetch_all(&self.db.pool)
            .await
    }

    pub async fn get_bill_by_id(&self, id: i64) -> Result<Option<BillWithItems>> {
        let bill_query = "SELECT * FROM bills WHERE id = ?";
        let bill = sqlx::query_as::<_, Bill>(bill_query)
            .bind(id)
            .fetch_optional(&self.db.pool)
            .await?;

        if let Some(bill) = bill {
            let items_query = r#"
            SELECT 
                bi.id AS id,
                bi.bill_id AS bill_id,
                bi.product_id AS product_id,
                bi.measurement AS measurement,
                bi.quantity AS quantity,
                bi.rate AS rate,
                bi.value AS value,
                bi.row_total AS row_total,
                bi.created_at AS created_at
            FROM bill_items bi
            JOIN products p ON bi.product_id = p.id
            WHERE bi.bill_id = ?
            "#;

            let bill_items = sqlx::query_as::<_, BillItem>(items_query)
                .bind(id)
                .fetch_all(&self.db.pool)
                .await?;

            Ok(Some(BillWithItems {
                bill,
                items: bill_items,
            }))
        } else {
            Ok(None)
        }
    }

    pub async fn update_bill(&self, id: i64, update: UpdateBill) -> Result<Option<Bill>> {
        let query = r#"
            UPDATE bills
            SET customer_name = COALESCE(?, customer_name),
                customer_phone = COALESCE(?, customer_phone),
                address = COALESCE(?, address),
                total_cost = COALESCE(?, total_cost),
                freight = COALESCE(?, freight),
                hammali = COALESCE(?, hammali),
                case_amount = COALESCE(?, case_amount),
                total_amount = COALESCE(?, total_amount),
                remark = COALESCE(?, remark)
            WHERE id = ?
        "#;

        sqlx::query_as::<_, Bill>(query)
            .bind(update.customer_name)
            .bind(update.customer_phone)
            .bind(update.address)
            .bind(update.total_cost)
            .bind(update.freight)
            .bind(update.hammali)
            .bind(update.case_amount)
            .bind(update.total_amount)
            .bind(update.remark)
            .bind(id)
            .fetch_optional(&self.db.pool)
            .await
    }

    pub async fn delete_bill(&self, id: i64) -> Result<u64> {
        let query = "DELETE FROM bills WHERE id = ?";
        sqlx::query(query)
            .bind(id)
            .execute(&self.db.pool)
            .await
            .map(|result| result.rows_affected())
    }

    pub async fn get_total_bills(&self) -> Result<i64> {
        let query = "SELECT COUNT(*) as total FROM bills";
        let result: (i64,) = sqlx::query_as(query).fetch_one(&self.db.pool).await?;
        Ok(result.0)
    }

    pub async fn get_bills_today(&self) -> Result<i64> {
        let query = r#"
            SELECT COUNT(*) as total 
            FROM bills 
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













































// use crate::bill::models::{BillItem, BillWithItems};
// use crate::{
//     bill::models::{Bill, NewBill, UpdateBill},
//     db::Database,
// };

// use sqlx::Result;

// use chrono::Utc;

// pub struct BillService<'a> {
//     pub db: &'a Database,
// }

// impl<'a> BillService<'a> {
//     pub async fn create_bill(&self, new_bill: NewBill) -> Result<Bill> {
//         println!("Received NewBill: {:?}", new_bill);

//         let mut transaction = self.db.pool.begin().await?;

//         let customer_name = new_bill.customer_name.clone();

//         let query = r#"
//             INSERT INTO bills (customer_name, customer_phone, address, company_id, date, total_cost, freight, hammali, case_amount, total_amount, remark, created_at)
//             VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, 0), COALESCE(?, 0), COALESCE(?, 0), ?, ?, CURRENT_TIMESTAMP)
//         "#;

            
//         println!("SQL query: {}", query);
//         let bill = sqlx::query_as::<_, Bill>(query)
//             .bind(new_bill.customer_name)
//             .bind(new_bill.customer_phone)
//             .bind(new_bill.address)
//             .bind(new_bill.company_id)
//             .bind(new_bill.date)
//             .bind(new_bill.total_cost)
//             .bind(new_bill.freight.unwrap_or_default())
//             .bind(new_bill.hammali.unwrap_or_default())
//             .bind(new_bill.case_amount.unwrap_or_default())
//             .bind(new_bill.total_amount)
//             .bind(new_bill.remark)
//             .fetch_one(&mut *transaction)
//             .await?;

//          // Step 2: Get the last inserted ID
//             let last_id: i64 = sqlx::query_scalar("SELECT last_insert_rowid()")
//             .fetch_one(&self.db.pool)
//             .await?;

//         // Insert associated bill items
//         for item in new_bill.items {
//             sqlx::query(
//                 r#"
//                 INSERT INTO bill_items (bill_id, product_id, measurement, quantity, rate, value, row_total, created_at)
//                 VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
//                 "#,
//             )
//             .bind(bill.id)
//             .bind(item.product_id)
//             .bind(item.measurement)
//             .bind(item.quantity)
//             .bind(item.rate)
//             .bind(item.value)
//             .bind(item.row_total)
//             .execute(&mut *transaction)
//             .await?;

//            // Step 3: Fetch the inserted row
//                 let bill = sqlx::query_as::<_, Bill>(r#"
//                 SELECT id, customer_name, customer_phone, address, company_id, date, total_cost, freight, hammali, case_amount, total_amount, remark, created_at
//                 FROM bills
//                 WHERE id = ?
//             "#)
//             .bind(last_id)
//             .fetch_one(&self.db.pool)
//             .await?;

//          // Update stock quantity
//          let update_stock_query = r#"
//          UPDATE stocks
//          SET quantity = quantity - ?
//          WHERE product_id = ? AND quantity >= ?
//          "#;
 
//          let rows_affected = sqlx::query(update_stock_query)
//              .bind(item.quantity)
//              .bind(item.product_id)
//              .bind(item.quantity) // Ensure there's enough stock to subtract
//              .execute(&mut *transaction)
//              .await?
//              .rows_affected();
 
//          if rows_affected == 0 {
//              transaction.rollback().await?;
//              return Err(sqlx::Error::RowNotFound);
//          }
//         }
// // id, title, description, company_id, product_id, related_quantity, measurement,  created_at, is_read

//          // Insert for the new bill creation
//         let notification_query = r#"
        
//         INSERT INTO notifications (title, description, company_id, customer_name, product_id, related_quantity, created_at)
//         VALUES ('Bill Creation', ?, ?, ?, NULL, NULL,  CURRENT_TIMESTAMP)
//         "#;

//         sqlx::query(notification_query)
//             .bind(format!("New bill created for customer: {}", customer_name))
//             .bind(new_bill.company_id)
//             .bind(customer_name)
//             .execute(&mut *transaction)
//             .await?;

//         // Commit the transaction
//         transaction.commit().await?;

//         Ok(bill)
//     }

//     // Retrieve all bills
//     pub async fn get_all_bills(&self) -> Result<Vec<Bill>> {
//         let query = "SELECT * FROM bills ORDER BY created_at DESC";
//         sqlx::query_as::<_, Bill>(query)
//             .fetch_all(&self.db.pool)
//             .await
//     }


//     // // Retrieve bill by ID
//     // pub async fn get_bill_by_id(&self, id: i64) -> Result<Option<Bill>> {
//     //     let query = "SELECT * FROM bills WHERE id = ?";
//     //     sqlx::query_as::<_, Bill>(query)
//     //         .bind(id)
//     //         .fetch_optional(&self.db.pool)
//     //         .await
//     // }

//     pub async fn get_bill_by_id(&self, id: i64) -> Result<Option<BillWithItems>> {
//         // Fetch the bill
//         let bill_query = "SELECT * FROM bills WHERE id = ?";
//         let bill = sqlx::query_as::<_, Bill>(bill_query)
//             .bind(id)
//             .fetch_optional(&self.db.pool)
//             .await?;

//         if let Some(bill) = bill {
//             // Fetch bill items with product details
//             let items_query = r#"
//                     SELECT 
//                         bi.id AS id,
//                         bi.bill_id AS bill_id,
//                         bi.product_id AS product_id,
//                         bi.measurement AS measurement,
//                         bi.quantity AS quantity,
//                         bi.rate AS rate,
//                         bi.value AS value,
//                         bi.row_total AS row_total,
//                         bi.created_at AS created_at
//                     FROM bill_items bi
//                     JOIN products p ON bi.product_id = p.id
//                     WHERE bi.bill_id = ?
//                 "#;

//             let bill_items = sqlx::query_as::<_, BillItem>(items_query)
//                 .bind(id)
//                 .fetch_all(&self.db.pool)
//                 .await?;

//             Ok(Some(BillWithItems {
//                 bill,
//                 items: bill_items,
//             }))
//         } else {
//             Ok(None)
//         }
//     }

//     // Update an existing bill
//     pub async fn update_bill(&self, id: i64, update: UpdateBill) -> Result<Option<Bill>> {
//         let query = r#"
//                 UPDATE bills
//                 SET customer_name = COALESCE(?, customer_name),
//                     customer_phone = COALESCE(?, customer_phone),
//                     address = COALESCE(?, address),
//                     total_cost = COALESCE(?, total_cost),
//                     freight = COALESCE(?, freight),
//                     hammali = COALESCE(?, hammali),
//                     case_amount = COALESCE(?, case_amount),
//                     total_amount = COALESCE(?, total_amount),
//                     remark = COALESCE(?, remark)
//                 WHERE id = ?
//                 RETURNING id, customer_name, customer_phone, address, company_id, date, total_cost, total_amount, created_at
//             "#;
//         sqlx::query_as::<_, Bill>(query)
//             .bind(update.customer_name)
//             .bind(update.customer_phone)
//             .bind(update.address)
//             .bind(update.total_cost)
//             .bind(update.freight)
//             .bind(update.hammali)
//             .bind(update.case_amount)
//             .bind(update.total_amount)
//             .bind(update.remark)
//             .bind(id)
//             .fetch_optional(&self.db.pool)
//             .await
//     }

//     // Delete a bill by ID
//     pub async fn delete_bill(&self, id: i64) -> Result<u64> {
//         let query = "DELETE FROM bills WHERE id = ?";
//         sqlx::query(query)
//             .bind(id)
//             .execute(&self.db.pool)
//             .await
//             .map(|result| result.rows_affected())
//     }

//     pub async fn get_total_bills(&self) -> Result<i64> {
//         let query = "SELECT COUNT(*) as total FROM bills";
//         let result: (i64,) = sqlx::query_as(query).fetch_one(&self.db.pool).await?;
//         Ok(result.0)
//     }

//     pub async fn get_bills_today(&self) -> Result<i64> {
//         let query = r#"
//             SELECT COUNT(*) as total 
//             FROM bills 
//             WHERE DATE(created_at) = DATE(?)
//         "#;

//         let today = Utc::now().date_naive();
//         let result: (i64,) = sqlx::query_as(query)
//             .bind(today)
//             .fetch_one(&self.db.pool)
//             .await?;
//         Ok(result.0)
//     }
// }
