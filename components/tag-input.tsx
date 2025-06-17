'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  suggestions?: string[]
  onFetchSuggestions?: (query: string) => Promise<string[]>
  disabled?: boolean
}

export default function TagInput({
  value = [],
  onChange,
  placeholder = 'Type to search or add tags...',
  maxTags = 5,
  suggestions: initialSuggestions = [],
  onFetchSuggestions,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [allTags, setAllTags] = useState<string[]>([]) // Store all available tags
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Fetch all available tags when component mounts (for showing when user clicks)
  useEffect(() => {
    if (onFetchSuggestions) {
      const fetchAllTags = async () => {
        try {
          setIsLoading(true)
          const results = await onFetchSuggestions('')
          setAllTags(results)
          setSuggestions(results.filter(tag => !value.includes(tag)))
        } catch (error) {
          console.error('Error fetching all tags:', error)
          setAllTags([])
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchAllTags()
    } else {
      setAllTags(initialSuggestions)
      setSuggestions(initialSuggestions.filter(tag => !value.includes(tag)))
    }
  }, [onFetchSuggestions]) // Only depend on onFetchSuggestions, not value
  
  // Filter suggestions based on input and selected tags
  useEffect(() => {
    if (!inputValue) {
      // Show all available tags when no input (filtered to exclude selected ones)
      setSuggestions(allTags.filter(tag => !value.includes(tag)))
      return
    }
    
    // If we have onFetchSuggestions and input is long enough, fetch filtered results
    if (onFetchSuggestions && inputValue.length >= 2) {
      setIsLoading(true)
      const debounceTimer = setTimeout(async () => {
        try {
          const results = await onFetchSuggestions(inputValue)
          setSuggestions(results.filter(tag => !value.includes(tag)))
        } catch (error) {
          console.error('Error fetching tag suggestions:', error)
          setSuggestions([])
        } finally {
          setIsLoading(false)
        }
      }, 300)
      
      return () => clearTimeout(debounceTimer)
    } else {
      // Filter from all available tags locally
      const filtered = allTags.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(tag)
      )
      setSuggestions(filtered)
      setIsLoading(false)
    }
  }, [inputValue, onFetchSuggestions, allTags, value])
  
  // Handle tag addition
  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag])
      setInputValue('')
      // Refocus input after adding tag
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [value, onChange, maxTags])
  
  // Handle tag removal
  const removeTag = useCallback((tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }, [value, onChange])
  
  // Handle input changes
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    setShowSuggestions(true) // Always show suggestions when typing
  }
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag on backspace if input is empty
      removeTag(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }
  
  // Handle focus - show all available tags
  const handleFocus = () => {
    setShowSuggestions(true)
  }
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const canAddMoreTags = value.length < maxTags
  const showDropdown = showSuggestions && !disabled && (suggestions.length > 0 || isLoading || inputValue.trim().length > 0)
  
  return (
    <div className="space-y-2">
      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="pl-3 pr-1 py-1.5 flex items-center gap-1.5 text-sm bg-primary/10 text-primary border-primary/20"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 p-0.5 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/20 transition-colors"
                disabled={disabled}
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3 hover:text-destructive" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Tag input with suggestions */}
      <div className="relative overflow-visible" ref={containerRef}>
        <Command 
          className={cn(
            "border rounded-md bg-background overflow-hidden",
            showDropdown && "rounded-b-none"
          )}
          shouldFilter={false} // Disable built-in filtering since we handle it ourselves
        >
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={canAddMoreTags ? placeholder : `Maximum ${maxTags} tags reached`}
            disabled={disabled || !canAddMoreTags}
            className="h-11 px-4 text-sm border-0 focus:ring-0 focus:outline-none"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </Command>
        
        {/* Suggestions dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 z-50 max-h-60 overflow-auto rounded-b-md border border-t-0 bg-popover text-popover-foreground shadow-lg">
            <Command shouldFilter={false}>
              <CommandGroup>
                {isLoading ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading suggestions...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.slice(0, 15).map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      value={suggestion}
                      onSelect={() => addTag(suggestion)}
                      className="cursor-pointer py-2 px-3 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      {suggestion}
                    </CommandItem>
                  ))
                ) : inputValue.trim().length > 0 ? (
                  <CommandEmpty className="px-3 py-2 text-sm text-muted-foreground">
                    Press Enter to add "{inputValue}"
                  </CommandEmpty>
                ) : (
                  <CommandEmpty className="px-3 py-2 text-sm text-muted-foreground">
                    No tags available. Start typing to create new tags.
                  </CommandEmpty>
                )}
              </CommandGroup>
            </Command>
          </div>
        )}
      </div>
      
      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        {value.length}/{maxTags} tags. {canAddMoreTags && 'Click the input to see available tags or type to search.'}
      </p>
    </div>
  )
} 