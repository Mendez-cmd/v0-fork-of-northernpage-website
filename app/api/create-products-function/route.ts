import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient()

  try {
    // Create the function to create the products table
    const { error } = await supabase.rpc("exec_sql", {
      sql_string: `
        CREATE OR REPLACE FUNCTION create_products_table()
        RETURNS void
        LANGUAGE plpgsql
        AS $$
        BEGIN
          -- Check if the table already exists
          IF NOT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = 'products'
          ) THEN
            -- Create the products table
            CREATE TABLE products (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name VARCHAR(255) NOT NULL,
              description TEXT,
              price DECIMAL(10, 2) NOT NULL,
              image_url VARCHAR(255),
              category VARCHAR(100),
              is_featured BOOLEAN DEFAULT false,
              is_bestseller BOOLEAN DEFAULT false,
              stock_quantity INTEGER DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create an index on category for faster queries
            CREATE INDEX idx_products_category ON products(category);
            
            -- Create an index on is_featured for faster queries
            CREATE INDEX idx_products_featured ON products(is_featured);
            
            -- Create an index on is_bestseller for faster queries
            CREATE INDEX idx_products_bestseller ON products(is_bestseller);
          END IF;
        END;
        $$;
      `,
    })

    if (error) {
      console.error("Error creating function:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Function created successfully" })
  } catch (error) {
    console.error("Error creating function:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
