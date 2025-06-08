'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

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
  const inputRef = useRef<HTMLInputElement>(null)
  const commandRef = useRef<HTMLDivElement>(null)
  
  // Debug log
  console.log('TagInput render - current tags:', value, 'suggestions:', suggestions)
  
  // Fetch suggestions when input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!onFetchSuggestions || inputValue.length < 2) {
        setSuggestions(initialSuggestions)
        return
      }
      
      setIsLoading(true)
      console.log('Fetching tag suggestions for:', inputValue)
      
      try {
        const results = await onFetchSuggestions(inputValue)
        console.log('Received tag suggestions:', results)
        setSuggestions(results.filter(tag => !value.includes(tag)))
      } catch (error) {
        console.error('Error fetching tag suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }
    
    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [inputValue, onFetchSuggestions, value, initialSuggestions])
  
  // Handle tag addition
  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      console.log('Adding tag:', trimmedTag)
      onChange([...value, trimmedTag])
      setInputValue('')
      setShowSuggestions(false)
    }
  }, [value, onChange, maxTags])
  
  // Handle tag removal
  const removeTag = useCallback((tagToRemove: string) => {
    console.log('Removing tag:', tagToRemove)
    onChange(value.filter(tag => tag !== tagToRemove))
  }, [value, onChange])
  
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
    }
  }
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const filteredSuggestions = suggestions.filter(
    tag => tag.toLowerCase().includes(inputValue.toLowerCase())
  )
  
  return (
    <div className="space-y-2">
      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="pl-3 pr-1 py-1.5 md:py-1 flex items-center gap-1.5 text-sm md:text-xs"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 p-0.5 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted transition-colors"
                disabled={disabled}
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-4 w-4 md:h-3 md:w-3 hover:text-destructive" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Tag input with suggestions */}
      <div className="relative" ref={commandRef}>
        <Command className="border rounded-md">
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            disabled={disabled || value.length >= maxTags}
            className="h-11 md:h-9 px-4 md:px-3 text-base md:text-sm"
          />
          
          {showSuggestions && inputValue && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
              <CommandGroup>
                {isLoading ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Loading suggestions...
                  </div>
                ) : filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      value={suggestion}
                      onSelect={() => addTag(suggestion)}
                      className="cursor-pointer py-2.5 md:py-1.5 px-3 md:px-2 text-base md:text-sm"
                    >
                      {suggestion}
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty className="px-3 py-2 text-sm">
                    Press Enter to add "{inputValue}"
                  </CommandEmpty>
                )}
              </CommandGroup>
            </div>
          )}
        </Command>
      </div>
      
      {/* Helper text */}
      <p className="text-sm md:text-xs text-muted-foreground">
        {value.length}/{maxTags} tags. {value.length < maxTags && 'Type and press Enter to add tags.'}
      </p>
    </div>
  )
} 