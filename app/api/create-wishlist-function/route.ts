import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Create the function to create the wishlist table
    const { error } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE OR REPLACE FUNCTION create_wishlist_function()
        RETURNS void AS $$
        BEGIN
          -- Create the function to create the wishlist table
          CREATE OR REPLACE FUNCTION create_wishlist_table()
          RETURNS void AS $func$
          BEGIN
            -- Create the wishlist table if it doesn't exist
            CREATE TABLE IF NOT EXISTS wishlist (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              product_id UUID REFERENCES products(id) ON DELETE CASCADE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Add sample data
            INSERT INTO wishlist (user_id, product_id)
            SELECT 
              '00000000-0000-0000-0000-000000000001',
              (SELECT id FROM products WHERE name = 'Chicken Pastil Salted Egg' LIMIT 1)
            WHERE 
              EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Pastil Salted Egg') AND
              EXISTS (SELECT 1 FROM users WHERE id = '00000000-0000-0000-0000-000000000001') AND
              NOT EXISTS (
                SELECT 1 FROM wishlist 
                WHERE user_id = '00000000-0000-0000-0000-000000000001' 
                AND product_id = (SELECT id FROM products WHERE name = 'Chicken Pastil Salted Egg' LIMIT 1)
              );
            
            INSERT INTO wishlist (user_id, product_id)
            SELECT 
              '00000000-0000-0000-0000-000000000002',
              (SELECT id FROM products WHERE name = 'Laing' LIMIT 1)
            WHERE 
              EXISTS (SELECT 1 FROM products WHERE name = 'Laing') AND
              EXISTS (SELECT 1 FROM users WHERE id = '00000000-0000-0000-0000-000000000002') AND
              NOT EXISTS (
                SELECT 1 FROM wishlist 
                WHERE user_id = '00000000-0000-0000-0000-000000000002' 
                AND product_id = (SELECT id FROM products WHERE name = 'Laing' LIMIT 1)
              );
          END;
          $func$ LANGUAGE plpgsql;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Execute the function
        SELECT create_wishlist_function();
      `,
    })

    if (error) throw error

    return NextResponse.json({ success: true, message: "Wishlist function created successfully" })
  } catch (error) {
    console.error("Error creating wishlist function:", error)
    return NextResponse.json({ success: false, message: "Failed to create wishlist function" }, { status: 500 })
  }
}
