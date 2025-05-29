'use client'

import { useCallback, useState, forwardRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Badge } from '@/components/ui/badge'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  minHeight?: number
  autoSave?: boolean
  onAutoSave?: () => void
}

export const MarkdownEditor = forwardRef<HTMLDivElement, MarkdownEditorProps>(
  ({ value, onChange, placeholder, maxLength, minHeight = 200, autoSave = false, onAutoSave }, ref) => {
    const [preview, setPreview] = useState<'edit' | 'preview'>('edit')
    
    // Calculate character and word count
    const charCount = value.length
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0
    
    // Debug log
    console.log('MarkdownEditor render - charCount:', charCount, 'wordCount:', wordCount)
    
    // Handle change with auto-save
    const handleChange = useCallback((newValue?: string) => {
      const val = newValue || ''
      console.log('MarkdownEditor value changed, length:', val.length)
      
      // Check max length
      if (maxLength && val.length > maxLength) {
        console.log('Value exceeds max length, truncating')
        return
      }
      
      onChange(val)
      
      // Trigger auto-save if enabled
      if (autoSave && onAutoSave) {
        console.log('Triggering auto-save')
        onAutoSave()
      }
    }, [onChange, maxLength, autoSave, onAutoSave])
    
    return (
      <div className="space-y-2" ref={ref}>
        <div data-color-mode="light">
          <MDEditor
            value={value}
            onChange={handleChange}
            preview={preview}
            hideToolbar={false}
            height={minHeight}
            textareaProps={{
              placeholder: placeholder || 'Enter your content here. You can use markdown for formatting.',
            }}
            commands={[
              // Toolbar commands are automatically included
            ]}
            extraCommands={[
              // Add custom commands if needed
            ]}
          />
        </div>
        
        {/* Character and word count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex gap-4">
            <Badge variant="secondary" className="text-xs">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </Badge>
            <Badge 
              variant={maxLength && charCount > maxLength * 0.9 ? "destructive" : "secondary"} 
              className="text-xs"
            >
              {charCount} {maxLength && `/ ${maxLength}`} characters
            </Badge>
          </div>
          
          {autoSave && (
            <span className="text-xs text-muted-foreground">
              Auto-save enabled
            </span>
          )}
        </div>
        
        {/* Preview mode toggle info */}
        <p className="text-xs text-muted-foreground">
          Use the preview button in the toolbar to switch between edit and preview modes.
        </p>
      </div>
    )
  }
)

MarkdownEditor.displayName = 'MarkdownEditor' 