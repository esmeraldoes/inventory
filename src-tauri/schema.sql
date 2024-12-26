CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    measurement TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'active',
    company_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    company_id INTEGER NOT NULL,
    measurement TEXT NOT NULL,
    price REAL NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL,
    status VARCHAR(30) DEFAULT 'In Stock',
    image TEXT,
    date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- CREATE TABLE bills (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     customer_name TEXT NOT NULL,
--     customer_phone TEXT NOT NULL,
--     address TEXT NULL,
--     company_id INTEGER NOT NULL,
--     date DATE NOT NULL DEFAULT CURRENT_DATE,
--     total_cost REAL DEFAULT 0,
--     freight REAL DEFAULT 0,
--     hammali REAL DEFAULT 0,
--     case_amount REAL DEFAULT 0,
--     total_amount REAL GENERATED ALWAYS AS (total_cost + freight + hammali + case_amount) STORED,
--     remark TEXT NULL,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
-- );

-- CREATE TABLE bill_items (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     bill_id INTEGER NOT NULL,
--     product_id INTEGER NOT NULL,
--     measurement TEXT NOT NULL,
--     quantity INTEGER NOT NULL CHECK (quantity >= 0),
--     rate REAL NOT NULL CHECK (rate >= 0),
--     value REAL GENERATED ALWAYS AS (quantity * rate) STORED,
--     row_total REAL GENERATED ALWAYS AS (value) STORED,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
--     FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
-- );


CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    company_id INTEGER NOT NULL,
    date DATE NOT NULL,
    total_cost REAL NOT NULL DEFAULT 0,
    freight REAL DEFAULT 0,
    hammali REAL DEFAULT 0,
    case_amount REAL DEFAULT 0,
    total_amount REAL NOT NULL DEFAULT 0,
    remark TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bill_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    measurement TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    rate REAL NOT NULL DEFAULT 0,
    value REAL NOT NULL DEFAULT 0,
    row_total REAL NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS case_bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    address TEXT,
    case_bill_amount REAL NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Predefined users
INSERT OR IGNORE INTO users (username, password) VALUES
('Admin1', 'esmeral1'),
('Admin2', 'esmeral2'),
('Admin3', 'esmeral3');



-- CREATE TABLE IF NOT EXISTS notifications (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     message TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );




CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,                -- Unique ID for each notification
    title TEXT NOT NULL,                                  -- title of notification (e.g., 'Stock Created', 'Low Stock')
    description TEXT NOT NULL,                           -- Description of the notification
    company_id INTEGER,                                  -- Foreign key to the companies table (nullable)
    product_id INTEGER,                                  -- Foreign key to the products table (nullable)
    customer_name TEXT,                                  -- Customer name (nullable, for customer-related notifications)
    total_amount REAL DEFAULT NULL,
    related_quantity TEXT,                               -- Quantity involved in the notification (e.g., "150kg")
    measurement TEXT,                                    -- Measurement unit (e.g., "kg", "pcs")
    company_name TEXT,  -- New field for company name
    product_name TEXT,  -- New field for product name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Timestamp for when the notification was created
    is_read BOOLEAN DEFAULT FALSE,                      -- Read/unread state of the notification

    -- Foreign key constraints
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);
