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

# Task: Build the Homepage / Explore Prompts View

## User Story
"As a SambaTV employee, I want to browse and search for relevant AI prompts so I can quickly find high-quality prompt content to use in my projects."

## Implementation Guide

### Step 1: Set Up the Basic Structure

1. **Create a New Component:**
   - Create a new file `PromptsList.tsx` in the `components/app` directory.
   - This component will be responsible for rendering the list of prompts, search input, and filter controls.

2. **Import Required Libraries and Components:**
   - Use `shadcn/ui` components for UI elements.
   - Use `Lucide React` for icons if needed.

### Step 2: Implement the Search Bar

1. **Add a Search Input:**
   - Use the `Input` component from `shadcn/ui` for the search bar.
   - Set the placeholder to "Search prompts...".
   - Optionally, add a search icon from `Lucide React` inside the input field for better UX.

2. **Styling:**
   - Use Tailwind CSS classes like `bg-primary` and `text-primary-foreground` to style the input.
   - Ensure the input is responsive and fits well within the layout.

### Step 3: Implement Filter Controls

1. **Add Filter Options:**
   - Use `Dropdown` or `Checkbox` components from `shadcn/ui` for filters.
   - Filters should include options for AI models, categories, creation date, author, popularity, and tags.

2. **Styling:**
   - Use Tailwind CSS classes such as `bg-primary` for dropdowns and checkboxes.
   - Ensure filters are easily accessible and visually distinct.

### Step 4: Render Prompt Cards

1. **Create a Card Layout:**
   - Use the `Card` component from `shadcn/ui` to display each prompt.
   - Each card should include:
     - Title
     - Description snippet
     - Author info (name and avatar)
     - Usage stats and vote count
     - Tags
     - A visual indicator for featured/verified prompts (e.g., a badge).

2. **Styling:**
   - Use Tailwind CSS classes like `text-primary-foreground` for text and `bg-primary` for buttons.
   - Ensure cards are responsive and maintain a consistent look with the rest of the application.

### Step 5: Integrate Sample Data

1. **Use Hardcoded Data:**
   - Initially, use hardcoded sample data to populate the prompt list.
   - Define a sample data structure that includes all necessary fields (title, description, author, etc.).

2. **Data Structure Example:**
   ```typescript
   const samplePrompts = [
     {
       id: '1',
       title: 'Sample Prompt 1',
       description: 'This is a brief description of prompt 1.',
       author: { name: 'Author 1', avatarUrl: '/path/to/avatar1.png' },
       uses: 100,
       votes: 50,
       tags: ['AI', 'Machine Learning'],
       featured: true,
     },
     // Add more sample prompts as needed
   ];
   ```

### Step 6: Implement Interactivity

1. **Search Functionality:**
   - Implement a function to filter prompts based on the search input.
   - Update the displayed prompts list as the user types in the search bar.

2. **Filter Functionality:**
   - Implement functions to filter prompts based on selected filter options.
   - Ensure that multiple filters can be applied simultaneously.

### Step 7: Finalize and Review

1. **Ensure Responsiveness:**
   - Test the layout on different screen sizes to ensure it is fully responsive.
   - Adjust styles as needed to maintain a consistent and attractive appearance.

2. **Debug Logging:**
   - Add detailed debug logs to track user interactions with the search and filter functionalities.
   - Log actions such as search input changes, filter selections, and prompt card clicks.

3. **Review and Refine:**
   - Review the implementation to ensure it meets the user story requirements.
   - Refine UI elements and interactions based on feedback and testing.

By following these steps, you will create a functional and visually appealing Homepage/Explore Prompts View that allows users to browse and search for AI prompts effectively.