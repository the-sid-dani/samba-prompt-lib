'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function clearAllCaches() {
  // Revalidate all paths
  revalidatePath('/', 'layout')
  
  // Revalidate specific tags
  revalidateTag('prompts')
  revalidateTag('categories')
  
  console.log('Cleared all caches')
} 