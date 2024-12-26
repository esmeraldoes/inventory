use sqlx::{sqlite::SqlitePoolOptions, Error, Executor, Pool, Sqlite};
use std::fs;
use std::path::Path;

pub struct Database {
    pub pool: Pool<Sqlite>,
}

impl Database {
    pub async fn new() -> Result<Self, Error> {
        let db_path = "src-tauri/inventory.db";
        let db_dir = Path::new(db_path).parent().unwrap();

        // Ensure the parent directory exists
        if !db_dir.exists() {
            fs::create_dir_all(db_dir).expect("Failed to create database directory");
        }

        // Ensure the database file exists
        if !Path::new(db_path).exists() {
            match fs::File::create(db_path) {
                Ok(_) => println!("Database file created at: {}", db_path),
                Err(e) => panic!("Failed to create database file: {}", e),
            }
        }

        // Create the connection pool
        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(&format!("sqlite:{}", db_path))
            .await
            .expect("Failed to connect to SQLite database");

        Ok(Self { pool })
    }

    // Efficiently check for existing tables before initializing
    pub async fn needs_initialization(&self) -> Result<bool, Error> {
        let query = "SELECT name FROM sqlite_master WHERE type='table' AND name='companies'";

        // Use `fetch_one` to get a single row result
        let row = self.pool.fetch_one(query).await;

        match row {
            Ok(_) => Ok(false), // If the table exists, no initialization is needed
            Err(_) => Ok(true), // If query fails, assume initialization is needed
        }
    }

    pub async fn initialize(&self) -> Result<(), Error> {
        if self.needs_initialization().await? {
            // Initialize the database schema
            let schema = include_str!("../schema.sql");
            sqlx::query(schema).execute(&self.pool).await?;
            println!("Database schema initialized successfully.");

            // Add predefined users to the database
            self.insert_predefined_users().await?;
        } else {
            println!("Database schema already exists, skipping initialization.");
        }

        Ok(())
    }

    // Function to insert predefined users into the database
    async fn insert_predefined_users(&self) -> Result<(), Error> {
        let users = vec![
            ("admin", "password123"),
            ("user1", "password1"),
            ("user2", "password2"),
        ];

        for (username, password) in users {
            let query = "INSERT INTO users (username, password) VALUES (?, ?)";
            sqlx::query(query)
                .bind(username)
                .bind(password)
                .execute(&self.pool)
                .await?;
            println!("Predefined user '{}' added to the database.", username);
        }

        Ok(())
    }
}
