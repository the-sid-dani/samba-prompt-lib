We are building a next js project based on an existing next js template that have auth, payment built already, below are rules you have to follow:

<frontend rules>
1. MUST Use 'use client' directive for client-side components; In Next.js, page components are server components by default, and React hooks like useEffect can only be used in client components.
2. The UI has to look great, using polished component from shadcn, tailwind when possible; Don't recreate shadcn components, make sure you use 'shadcn@latest add xxx' CLI to add components
3. MUST adding debugging log & comment for every single feature we implement
4. Make sure to concatenate strings correctly using backslash
7. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
8. Don't update shadcn components unless otherwise specified
9. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
11. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
12. Accurately implement necessary grid layouts
13. Follow proper import practices:
   - Use @/ path aliases
   - Keep component imports organized
   - Update current src/app/page.tsx with new comprehensive code
   - Don't forget root route (page.tsx) handling
   - You MUST complete the entire prompt before stopping
</frontend rules>

<styling_requirements>
- You ALWAYS tries to use the shadcn/ui library.
- You MUST USE the builtin Tailwind CSS variable based colors as used in the examples, like bg-primary or text-primary-foreground.
- You DOES NOT use indigo or blue colors unless specified in the prompt.
- You MUST generate responsive designs.
- The React Code Block is rendered on top of a white background. If v0 needs to use a different background color, it uses a wrapper element with a background color Tailwind class.
</styling_requirements>

<frameworks_and_libraries>
- You prefers Lucide React for icons, and shadcn/ui for components.
- You MAY use other third-party libraries if necessary or requested by the user.
- You imports the shadcn/ui components from "@/components/ui"
- You DOES NOT use fetch or make other network requests in the code.
- You DOES NOT use dynamic imports or lazy loading for components or libraries. Ex: const Confetti = dynamic(...) is NOT allowed. Use import Confetti from 'react-confetti' instead.
- Prefer using native Web APIs and browser features when possible. For example, use the Intersection Observer API for scroll-based animations or lazy loading.
</frameworks_and_libraries>

# Task 4: Develop the Playground for Prompt Testing

## User Story
"As a SambaTV employee, I want to test prompts in a dedicated Playground so that I can experiment with prompt configurations and see their outputs immediately."

## Implementation Guide

### Overview
The Playground will be a dedicated interface where users can input prompt text, adjust parameters, and view the generated output. This feature will be implemented as a separate view under `/app/playground`.

### Steps to Implement

1. **Create the Playground Component**
   - **Location**: `app/playground/page.tsx`
   - **Purpose**: This component will serve as the main interface for testing prompts.

2. **Set Up the Playground Layout**
   - Use `shadcn/ui` components to create a clean and responsive layout.
   - **Container**: Use a `Card` or `Container` component to wrap the Playground interface.
   - **Styling**: Apply Tailwind CSS classes such as `bg-neutral` for the background and `text-primary-foreground` for text to ensure consistency with SambaTV branding.

3. **Add Input Areas for Prompt Text and Parameters**
   - **Prompt Text Input**: Use the `Input` component from `shadcn/ui` for users to enter the prompt text.
   - **System Prompt Input**: Optionally, add another `Input` for a system prompt.
   - **Dynamic Variables**: If the prompt includes placeholders, provide input fields for these variables.

4. **Model Selection and Parameter Controls**
   - **Model Dropdown**: Use a `Dropdown` component to allow users to select the AI model (e.g., "GPT-3.5", "GPT-4", "Claude").
   - **Parameter Sliders**: Use `Slider` components for adjusting generation parameters like Temperature and Max Tokens.
   - **Default Presets**: Provide default values for these parameters to guide users.

5. **Run Button and Output Display**
   - **Run Button**: Add a `Button` component labeled "Run" to trigger the prompt generation.
   - **Loading State**: Display a loading spinner (use an icon from Lucide React) while the prompt is being processed.
   - **Output Area**: Use a `Card` or `Alert` component to display the generated output. Ensure it is styled with `bg-primary` and `text-primary-foreground`.

6. **Copy-to-Clipboard Functionality**
   - Implement a "Copy to Clipboard" button using the native Clipboard API (`navigator.clipboard.writeText`) to allow users to easily copy the generated output.
   - Provide visual feedback (e.g., a temporary alert message) to confirm the copy action.

7. **Error Handling**
   - Use `Alert` components to display error messages if the prompt generation fails.
   - Ensure error messages are clear and styled consistently with the rest of the UI.

### UI Details and Data Points
- **Data to Manage**: 
  - Prompt text
  - System prompt (optional)
  - Variable inputs (if any)
  - Selected model
  - Generation parameters
  - Resulting output

- **Styling**: 
  - Use Tailwind CSS variables like `bg-primary`, `text-primary-foreground`, and `bg-neutral` for a cohesive look.
  - Ensure all components are responsive and adapt to different screen sizes.

### Example Code Snippet
Here's a basic structure for the Playground component:

```typescript
import { Card, Input, Button, Dropdown, Slider, Alert } from '@/components/ui';
import { useState } from 'react';

const Playground = () => {
  const [promptText, setPromptText] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      // Simulate prompt processing
      const result = await simulatePromptProcessing(promptText);
      setOutput(result);
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <Input
          placeholder="Enter your prompt..."
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          className="mb-4"
        />
        <Dropdown className="mb-4" /* Model selection dropdown */ />
        <Slider className="mb-4" /* Parameter sliders */ />
        <Button onClick={handleRun} disabled={loading}>
          {loading ? 'Running...' : 'Run'}
        </Button>
        {output && (
          <Alert className="mt-4">
            <div>{output}</div>
            <Button onClick={() => navigator.clipboard.writeText(output)}>
              Copy to Clipboard
            </Button>
          </Alert>
        )}
      </Card>
    </div>
  );
};

export default Playground;
```

### Notes
- Ensure all components are accessible and provide appropriate ARIA labels where necessary.
- Test the Playground on various devices to ensure responsiveness and usability.
- This implementation uses hardcoded data and simulated processing for demonstration purposes. Integrate with actual APIs or services as needed.

By following these steps, you will create a functional and visually consistent Playground for testing prompts within the SambaTV Internal Prompt Library.