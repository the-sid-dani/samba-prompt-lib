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
            <Card key={category.id} className="group hover:shadow-lg hover:shadow-black/5 transition-all duration-300 border border-border bg-card h-full">
              <CardHeader className="pb-4 space-y-3">
                <CardTitle className="text-lg font-bold text-foreground leading-tight min-h-[3rem] flex items-start">
                  {category.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
                  {category.description || `${category.name} related prompts for various tasks and use cases.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground mb-1">
                      {category.prompt_count || 0} prompts
                    </p>
                  </div>
                  <Link href={`/categories/${category.id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10 font-medium transition-all duration-200"
                    >
                      View
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 