'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  description: string | null
  display_order: number
  prompt_count: number
}

interface CategoriesGridProps {
  categories: Category[]
}

export default function CategoriesGrid({ categories }: CategoriesGridProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div>
      {/* Search Bar */}
      <div className="relative max-w-md mb-8">
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 w-full border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-foreground mb-2">No categories found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? `No categories match "${searchQuery}". Try a different search term.`
              : "No categories are currently available."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`} className="block">
              <Card className="group hover:shadow-lg hover:shadow-black/5 transition-all duration-300 border border-border bg-card h-full cursor-pointer">
                <CardHeader className="pb-2 space-y-2">
                  <CardTitle className="text-lg font-bold text-foreground leading-tight">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {category.description || `${category.name} related prompts for various tasks and use cases.`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <p className="text-sm font-medium text-foreground">
                    {category.prompt_count || 0} prompts
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 