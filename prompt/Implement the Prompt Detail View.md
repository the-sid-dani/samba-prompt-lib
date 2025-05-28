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

# Implement the Prompt Detail View

## Task Overview
Create a detailed view for each prompt that allows users to see full prompt details, including a detailed description, version history, and a copy-to-clipboard functionality.

## Implementation Guide

### Step 1: Set Up the Route

1. **Create a Dynamic Route:**
   - Navigate to the `app/prompt/` directory.
   - Create a new folder named `[id]` to handle dynamic routing for each prompt.
   - Inside `[id]`, create a `page.tsx` file. This will serve as the entry point for the prompt detail view.

### Step 2: Develop the PromptDetail Component

1. **Create the Component:**
   - In the `components/app/` directory, create a new file named `PromptDetail.tsx`.
   - This component will be responsible for rendering the detailed view of a prompt.

2. **Component Structure:**
   - Use `shadcn/ui` components such as `Card`, `Button`, and `Alert` for layout and styling.
   - Ensure the component is responsive and visually consistent with the rest of the application using Tailwind CSS classes like `bg-background` and `text-primary-foreground`.

3. **Data Display:**
   - Display the following data points:
     - Prompt title
     - Full content
     - Detailed description
     - Author information (name and avatar)
     - Version history (if available)
     - User ratings/comments (optional)

4. **Copy-to-Clipboard Functionality:**
   - Implement a "Copy to Clipboard" button using the native Clipboard API.
   - Use `navigator.clipboard.writeText` to copy the prompt content.
   - Provide visual feedback using an `Alert` component to notify the user of a successful copy action.

### Step 3: Integrate the Component with the Route

1. **Import and Use the Component:**
   - In `app/prompt/[id]/page.tsx`, import the `PromptDetail` component.
   - Use the component within the page to render the prompt details.

2. **Fetch Prompt Data:**
   - Use the `getSupabaseClient` function from `utils/supabase/server.ts` to fetch the prompt data based on the dynamic `id` parameter.
   - Example:
     ```typescript
     import { getSupabaseClient } from '@/utils/supabase/server';
     import PromptDetail from '@/components/app/PromptDetail';

     export default async function PromptPage({ params }: { params: { id: string } }) {
       const supabase = await getSupabaseClient();
       const { data: prompt, error } = await supabase.from('prompt').select().eq('id', params.id).single();

       if (error) {
         console.error('Error fetching prompt:', error);
         return <div>Error loading prompt details.</div>;
       }

       return <PromptDetail prompt={prompt} />;
     }
     ```

### Step 4: Styling and Responsiveness

1. **Ensure Responsive Design:**
   - Use Tailwind CSS classes to ensure the component is responsive across different screen sizes.
   - Example classes: `flex`, `flex-col`, `md:flex-row`, `p-4`, `m-2`.

2. **Consistent Styling:**
   - Use Tailwind CSS variable-based colors for consistency with the rest of the application.
   - Avoid using indigo or blue colors unless specified.

### Step 5: Debug Logging

1. **Add Debug Logs:**
   - Include detailed debug logs to track the data fetching process and user interactions.
   - Use `console.log` to output key actions and data states, such as successful data fetch, errors, and copy-to-clipboard actions.

### Example Debug Log Implementation

```typescript
console.log('Fetching prompt details for ID:', params.id);
if (error) {
  console.error('Error fetching prompt:', error);
} else {
  console.log('Prompt data fetched successfully:', prompt);
}
```

By following these steps, you will implement a detailed prompt view that allows users to explore and interact with prompt content effectively. Ensure that the UI is consistent with the overall application design and provides a seamless user experience.