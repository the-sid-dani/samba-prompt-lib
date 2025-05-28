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

# Prompt Submission & Management for Contributors

## Task
Develop a prompt submission form and management interface for contributors to submit new prompts with relevant details.

## Implementation Guide

### Step 1: Create the Submission Form

1. **File Structure**
   - Create a new directory `app/submit/` for the submission feature.
   - Inside `app/submit/`, create a file `page.tsx` for the submission form page.

2. **Form Layout**
   - Use `shadcn/ui` components to build the form.
   - Import necessary components from `@/components/ui` such as `Form`, `Input`, `Textarea`, `Button`, and `Select`.

3. **Form Fields**
   - Title: Use an `Input` component for the prompt title.
   - Description: Use a `Textarea` component for a brief description.
   - Content: Use a `Textarea` component for the full prompt content.
   - Tags: Use a `Select` component for tags, allowing multiple selections.
   - AI Model: Use a `Select` component to choose the target AI model.

4. **Styling**
   - Apply Tailwind CSS classes for styling, such as `bg-primary`, `text-primary-foreground`, and `border-neutral`.
   - Ensure the form is responsive using Tailwind's responsive utilities.

5. **Example Form Code**
   ```typescript
   import { Form, Input, Textarea, Button, Select } from '@/components/ui';

   export default function SubmitPromptPage() {
     return (
       <div className="min-h-screen bg-neutral py-8">
         <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
           <h1 className="text-2xl font-bold text-primary-foreground mb-4">Submit a New Prompt</h1>
           <Form>
             <Input label="Title" placeholder="Enter prompt title" required />
             <Textarea label="Description" placeholder="Enter a brief description" required />
             <Textarea label="Content" placeholder="Enter full prompt content" required />
             <Select label="Tags" multiple options={['Tag1', 'Tag2', 'Tag3']} />
             <Select label="AI Model" options={['GPT-3.5', 'GPT-4', 'Claude']} />
             <Button type="submit" className="mt-4 bg-primary text-primary-foreground">Submit</Button>
           </Form>
         </div>
       </div>
     );
   }
   ```

### Step 2: Handle Form Submission

1. **Form Submission Logic**
   - Add an `onSubmit` handler to the form to capture form data.
   - Use the `useState` hook to manage form state.

2. **Data Validation**
   - Validate form inputs before submission (e.g., ensure required fields are filled).

3. **Submit Data to Supabase**
   - Use the Supabase client to insert the new prompt into the `prompt` table.
   - Ensure the user is authenticated before allowing submission.

4. **Example Submission Code**
   ```typescript
   import { useState } from 'react';
   import { createSupabaseClient } from '@/utils/supabase/client';

   const handleSubmit = async (event) => {
     event.preventDefault();
     const supabase = await createSupabaseClient();
     const { data, error } = await supabase.from('prompt').insert([
       {
         title: formState.title,
         description: formState.description,
         content: formState.content,
         tags: formState.tags,
         user_id: user.id, // Assuming user is authenticated and user.id is available
       },
     ]);
     if (error) {
       console.error('Error submitting prompt:', error);
     } else {
       console.log('Prompt submitted successfully:', data);
     }
   };
   ```

### Step 3: Implement Prompt Management Interface

1. **File Structure**
   - Create a new component `PromptManagement.tsx` in `components/app/`.

2. **Display Submitted Prompts**
   - Fetch and display a list of submitted prompts for the authenticated user.
   - Use `shadcn/ui` components like `Card` and `Button` for each prompt.

3. **Edit and Delete Functionality**
   - Allow users to edit or delete their submitted prompts.
   - Use Supabase client methods to update or delete records in the `prompt` table.

4. **Example Management Code**
   ```typescript
   import { useEffect, useState } from 'react';
   import { createSupabaseClient } from '@/utils/supabase/client';
   import { Card, Button } from '@/components/ui';

   const PromptManagement = () => {
     const [prompts, setPrompts] = useState([]);

     useEffect(() => {
       const fetchPrompts = async () => {
         const supabase = await createSupabaseClient();
         const { data, error } = await supabase.from('prompt').select().eq('user_id', user.id);
         if (error) {
           console.error('Error fetching prompts:', error);
         } else {
           setPrompts(data);
         }
       };
       fetchPrompts();
     }, []);

     return (
       <div>
         {prompts.map((prompt) => (
           <Card key={prompt.id}>
             <h2>{prompt.title}</h2>
             <p>{prompt.description}</p>
             <Button>Edit</Button>
             <Button>Delete</Button>
           </Card>
         ))}
       </div>
     );
   };

   export default PromptManagement;
   ```

### Step 4: Integrate with the Main Application

1. **Navigation**
   - Add a link to the prompt submission page in the main navigation or user profile dropdown.

2. **Access Control**
   - Ensure only authenticated users can access the submission and management pages.

3. **Feedback and Notifications**
   - Provide user feedback on successful submission, edits, or deletions using `shadcn/ui` `Alert` components.

By following these steps, you will create a robust prompt submission and management system for contributors, allowing them to easily share and manage their prompt content within the SambaTV Internal Prompt Library.