'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { updateUserProfile } from '@/app/actions/profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }).max(50, {
    message: 'Name must not exceed 50 characters.',
  }).optional().nullable(),
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }).max(30, {
    message: 'Username must not exceed 30 characters.',
  }).regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  }).optional().nullable(),
  avatar_url: z.string().url({
    message: 'Please enter a valid URL.',
  }).optional().nullable().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: string
    name: string | null
    username: string | null
    avatar_url: string | null
    email: string | null
  }
}

export function EditProfileModal({ open, onOpenChange, user }: EditProfileModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      username: user.username || '',
      avatar_url: user.avatar_url || '',
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      await updateUserProfile(user.id, {
        name: data.name || null,
        username: data.username || null,
        avatar_url: data.avatar_url || null,
      })

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      })

      router.refresh()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className="text-sm">
            Update your profile information. Your email address cannot be changed as it&apos;s linked to your Google account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage src={form.watch('avatar_url') || user.avatar_url || ''} />
                <AvatarFallback className="text-sm sm:text-base">{user.name?.[0] || user.email?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-xs sm:text-sm text-muted-foreground">
                <p className="font-medium text-foreground text-sm sm:text-base">{user.email}</p>
                <p>Your email address is managed by Google OAuth</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Display Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your display name" 
                      {...field} 
                      value={field.value || ''}
                      className="h-11 sm:h-9"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your username" 
                      {...field}
                      value={field.value || ''}
                      className="h-11 sm:h-9"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Your unique username. Only letters, numbers, and underscores allowed.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Avatar URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/avatar.jpg" 
                      {...field}
                      value={field.value || ''}
                      className="h-11 sm:h-9"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Enter a URL for your avatar image. Leave empty to use your Google profile picture.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="w-full sm:w-auto tap-highlight"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto tap-highlight"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 