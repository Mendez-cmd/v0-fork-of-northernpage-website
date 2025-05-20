-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address_id UUID,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  address_name TEXT,
  recipient_name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Philippines',
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample product data
INSERT INTO products (name, description, price, image_url, category, is_featured, is_bestseller, stock_quantity)
VALUES 
  ('Chicken Pastil Original', 'The original chicken pastil that started it all. A must-try!', 149.00, '/images/chickenpastiloriginal.png', 'chicken-pastel', true, true, 100),
  ('Chicken Pastil Classic', 'Our classic chicken pastil recipe, a timeless favorite.', 149.00, '/images/chickenpastilclassic.png', 'chicken-pastel', true, false, 100),
  ('Chicken Pastil Salted Egg', 'A unique fusion of chicken pastil with rich salted egg flavor.', 149.00, '/images/chickenpastilsaltedegg.png', 'chicken-pastel', true, false, 100),
  ('Laing', 'Traditional Bicolano dish made with taro leaves in coconut milk.', 149.00, '/images/laing.png', 'laing', true, false, 100),
  ('Spanish Bangus', 'Premium milkfish marinated in Spanish-style sauce, perfect for any occasion.', 189.00, '/images/bangusspanish.png', 'bangus', true, true, 100),
  ('Chili Garlic', 'Homemade chili garlic sauce, perfect for adding heat to any dish.', 159.00, '/images/chiligarlic.png', 'chili', true, false, 100)
ON CONFLICT (id) DO NOTHING;

-- Sample review data
INSERT INTO users (id, email, first_name, last_name, phone)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'maria@example.com', 'Maria', 'Santos', '+639123456789'),
  ('00000000-0000-0000-0000-000000000002', 'juan@example.com', 'Juan', 'Dela Cruz', '+639234567890'),
  ('00000000-0000-0000-0000-000000000003', 'ana@example.com', 'Ana', 'Reyes', '+639345678901')
ON CONFLICT (id) DO NOTHING;

-- Get product IDs
WITH product_ids AS (
  SELECT id FROM products LIMIT 6
)
INSERT INTO reviews (product_id, user_id, rating, title, content)
SELECT 
  (SELECT id FROM products WHERE name = 'Chicken Pastil Original' LIMIT 1),
  '00000000-0000-0000-0000-000000000001',
  5,
  'Absolutely Delicious!',
  'The Chicken Pastil Original is amazing! The flavors are authentic and it reminds me of home. Will definitely order again!'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Pastil Original')
AND NOT EXISTS (
  SELECT 1 FROM reviews 
  WHERE user_id = '00000000-0000-0000-0000-000000000001' 
  AND product_id = (SELECT id FROM products WHERE name = 'Chicken Pastil Original' LIMIT 1)
);

INSERT INTO reviews (product_id, user_id, rating, title, content)
SELECT 
  (SELECT id FROM products WHERE name = 'Spanish Bangus' LIMIT 1),
  '00000000-0000-0000-0000-000000000002',
  5,
  'Best Spanish Bangus Ever',
  'The Spanish Bangus is perfectly marinated and so flavorful. My family loved it and we''ll be ordering more soon!'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Spanish Bangus')
AND NOT EXISTS (
  SELECT 1 FROM reviews 
  WHERE user_id = '00000000-0000-0000-0000-000000000002' 
  AND product_id = (SELECT id FROM products WHERE name = 'Spanish Bangus' LIMIT 1)
);

INSERT INTO reviews (product_id, user_id, rating, title, content)
SELECT 
  (SELECT id FROM products WHERE name = 'Laing' LIMIT 1),
  '00000000-0000-0000-0000-000000000003',
  4,
  'Authentic Laing',
  'The Laing tastes just like how my grandmother used to make it. Very authentic and delicious!'
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Laing')
AND NOT EXISTS (
  SELECT 1 FROM reviews 
  WHERE user_id = '00000000-0000-0000-0000-000000000003' 
  AND product_id = (SELECT id FROM products WHERE name = 'Laing' LIMIT 1)
);

-- Sample wishlist data
INSERT INTO wishlist (user_id, product_id)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM products WHERE name = 'Chicken Pastil Salted Egg' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Pastil Salted Egg')
AND NOT EXISTS (
  SELECT 1 FROM wishlist 
  WHERE user_id = '00000000-0000-0000-0000-000000000001' 
  AND product_id = (SELECT id FROM products WHERE name = 'Chicken Pastil Salted Egg' LIMIT 1)
);

INSERT INTO wishlist (user_id, product_id)
SELECT 
  '00000000-0000-0000-0000-000000000002',
  (SELECT id FROM products WHERE name = 'Laing' LIMIT 1)
WHERE EXISTS (SELECT 1 FROM products WHERE name = 'Laing')
AND NOT EXISTS (
  SELECT 1 FROM wishlist 
  WHERE user_id = '00000000-0000-0000-0000-000000000002' 
  AND product_id = (SELECT id FROM products WHERE name = 'Laing' LIMIT 1)
);
