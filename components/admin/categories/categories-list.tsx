"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ChevronRight, ChevronDown, FolderTree } from "lucide-react"
import { ImageIcon } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  image_url: string | null
  is_active: boolean
  display_order: number
  product_count?: number
  children?: Category[]
}

export function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from("product_categories")
          .select("*")
          .order("display_order", { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          // Transform flat list into hierarchical structure
          const categoriesMap = new Map<string, Category>()
          const rootCategories: Category[] = []

          // First pass: create map of all categories
          data.forEach((category) => {
            categoriesMap.set(category.id, { ...category, children: [] })
          })

          // Second pass: build hierarchy
          data.forEach((category) => {
            const categoryWithChildren = categoriesMap.get(category.id)!

            if (category.parent_id && categoriesMap.has(category.parent_id)) {
              // This is a child category, add it to its parent
              const parent = categoriesMap.get(category.parent_id)!
              parent.children = [...(parent.children || []), categoryWithChildren]
            } else {
              // This is a root category
              rootCategories.push(categoryWithChildren)
            }
          })

          setCategories(rootCategories)
        } else {
          // If no data or empty array, use sample data
          const sampleData: Category[] = [
            {
              id: "1",
              name: "Main Dishes",
              slug: "main-dishes",
              description: "Primary meal options",
              parent_id: null,
              image_url: null,
              is_active: true,
              display_order: 1,
              product_count: 12,
              children: [
                {
                  id: "4",
                  name: "Chicken Dishes",
                  slug: "chicken-dishes",
                  description: "Chicken-based main courses",
                  parent_id: "1",
                  image_url: null,
                  is_active: true,
                  display_order: 1,
                  product_count: 8,
                },
                {
                  id: "5",
                  name: "Seafood Dishes",
                  slug: "seafood-dishes",
                  description: "Seafood-based main courses",
                  parent_id: "1",
                  image_url: null,
                  is_active: true,
                  display_order: 2,
                  product_count: 4,
                },
              ],
            },
            {
              id: "2",
              name: "Side Dishes",
              slug: "side-dishes",
              description: "Complementary food items",
              parent_id: null,
              image_url: null,
              is_active: true,
              display_order: 2,
              product_count: 8,
            },
            {
              id: "3",
              name: "Desserts",
              slug: "desserts",
              description: "Sweet treats to finish your meal",
              parent_id: null,
              image_url: null,
              is_active: true,
              display_order: 3,
              product_count: 6,
            },
          ]

          setCategories(sampleData)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Use sample data if there's an error
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [supabase])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-[200px]" />
            </div>
            <Skeleton className="h-4 w-[300px] ml-8" />
          </div>
        ))}
      </div>
    )
  }

  const renderCategory = (category: Category, level = 0) => {
    const isExpanded = expandedCategories[category.id]
    const hasChildren = category.children && category.children.length > 0

    return (
      <div key={category.id} className="space-y-2">
        <div className={`flex items-center justify-between py-2 ${level > 0 ? "ml-6" : ""}`}>
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => toggleCategory(category.id)}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            ) : (
              <FolderTree className="h-4 w-4 ml-1 text-muted-foreground" />
            )}

            <span className="font-medium">{category.name}</span>

            {!category.is_active && (
              <Badge variant="outline" className="ml-2">
                Inactive
              </Badge>
            )}

            {category.product_count !== undefined && (
              <Badge variant="secondary" className="ml-2">
                {category.product_count} products
              </Badge>
            )}

            {category.image_url && <ImageIcon className="h-4 w-4 text-muted-foreground" />}
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/admin/categories/${category.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-200 ml-3 pl-3 space-y-2">
            {category.children!.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No categories found</p>
      ) : (
        <div className="space-y-2">{categories.map((category) => renderCategory(category))}</div>
      )}
    </div>
  )
}
