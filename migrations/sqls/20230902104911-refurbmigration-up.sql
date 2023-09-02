/* Replace with your SQL commands */
-- Create Categories Table
CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create Colors Table
CREATE TABLE Colors (
    color_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Create StorageOptions Table
CREATE TABLE StorageOptions (
    storage_id SERIAL PRIMARY KEY,
    capacity VARCHAR(50) NOT NULL
);

-- Create ScreenSizes Table
CREATE TABLE ScreenSizes (
    screen_size_id SERIAL PRIMARY KEY,
    size VARCHAR(50) NOT NULL
);

-- Create ProductBase Table
CREATE TABLE ProductBase (
    product_base_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES Categories(category_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255)
);

-- Create ProductVariants Table
CREATE TABLE ProductVariants (
    variant_id SERIAL PRIMARY KEY,
    product_base_id INT REFERENCES ProductBase(product_base_id),
    color_id INT REFERENCES Colors(color_id),
    storage_id INT REFERENCES StorageOptions(storage_id),
    screen_size_id INT REFERENCES ScreenSizes(screen_size_id),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL
);

-- Create Users Table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL,
    is_banned BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Carts Table
CREATE TABLE Carts (
    cart_id SERIAL PRIMARY KEY,
    account_id INT REFERENCES Accounts(account_id)
);

-- Create CartItems Table
CREATE TABLE CartItems (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES Carts(cart_id),
    variant_id INT REFERENCES ProductVariants(variant_id),
    quantity INT NOT NULL
);
