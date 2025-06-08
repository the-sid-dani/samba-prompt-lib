import { Metadata } from 'next'
import { Suspense } from 'react'
import Navigation from '@/components/navigation/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategoriesWithCounts } from '@/app/actions/prompts'
import CategoriesGrid from './components/CategoriesGrid'
import AddCategoryModal from './components/AddCategoryModal'

export const metadata: Metadata = {
  title: 'Categories Overview - SambaTV Prompt Library',
  description: 'Browse and manage prompt categories. Organize your AI prompts by department and use case.',
}

async function CategoriesContent() {
  const categories = await getCategoriesWithCounts()

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground mb-2">No categories found</h3>
          <p className="text-muted-foreground mb-6">
            No categories are currently available. Categories help organize prompts by department and use case.
          </p>
          <AddCategoryModal />
        </div>
      </div>
    )
  }

  return <CategoriesGrid categories={categories} />
}

export default function CategoriesPage() {
  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold text-foreground">Categories Overview</h1>
              <AddCategoryModal className="bg-primary hover:bg-primary/90 text-white" />
            </div>
          </div>

          {/* Categories Grid */}
          <Suspense 
            fallback={
              <div>
                {/* Search Bar Skeleton */}
                <div className="relative max-w-md mb-8">
                  <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
                </div>
                
                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="h-3 bg-muted rounded w-16 mb-1"></div>
                            <div className="h-8 bg-muted rounded w-12"></div>
                          </div>
                          <div className="h-8 bg-muted rounded w-16"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            }
          >
            <CategoriesContent />
          </Suspense>
        </div>
      </div>
    </>
  )
} 