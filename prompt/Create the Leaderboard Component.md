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

# Leaderboard Component Implementation Guide

## Task
Develop a Leaderboard component to display a ranking list of prompts based on usage frequency, upvotes/likes, or expert ratings.

## Implementation Guide

### Step 1: Set Up the Leaderboard Route

1. **Create the Route:**
   - Navigate to the `app/leaderboard/` directory.
   - Create a new file named `page.tsx`.

2. **Define the Page Component:**
   - Import necessary React and Next.js components.
   - Set up a basic functional component structure for the Leaderboard page.

### Step 2: Design the Leaderboard UI

1. **Import UI Components:**
   - Use `shadcn/ui` components for building the UI.
   - Import necessary components such as `Card`, `Dropdown`, `Button`, and `Table` from `@/components/ui`.

2. **Set Up the Layout:**
   - Use a `Card` component to wrap the leaderboard content.
   - Apply Tailwind CSS classes for styling, such as `bg-neutral` for the background and `text-primary-foreground` for text.

3. **Create the Leaderboard Table:**
   - Use a `Table` component to display the list of ranked prompts.
   - Define table columns for prompt title, author, usage count, and votes.

4. **Add Filtering Controls:**
   - Use `Dropdown` components to allow users to filter the leaderboard by time (e.g., weekly, monthly, all-time).
   - Style the dropdowns with Tailwind classes like `bg-primary`.

### Step 3: Implement Data Fetching

1. **Set Up Supabase Client:**
   - Use the existing Supabase client configuration from `utils/supabase/client.ts` to fetch prompt data.
   - Ensure the client is authenticated to access the necessary data.

2. **Fetch Leaderboard Data:**
   - In `page.tsx`, use the Supabase client to query the `prompt` table.
   - Order the results by usage count or votes to determine the ranking.

3. **Handle Data and Errors:**
   - Use React state to store the fetched data.
   - Implement error handling to manage any issues during data fetching.

### Step 4: Render the Leaderboard

1. **Map Data to UI:**
   - Iterate over the fetched prompt data to render each row in the leaderboard table.
   - Display key details such as prompt title, author, usage count, and votes.

2. **Add Interactivity:**
   - Implement sorting functionality to allow users to sort the leaderboard by different metrics.
   - Ensure the UI updates dynamically based on user interactions.

### Step 5: Add Debug Logging

1. **Implement Logging:**
   - Add console logs at key points in the data fetching and rendering process to track the flow of data.
   - Log any errors encountered during data fetching or rendering.

2. **Example Logs:**
   ```typescript
   console.log("Fetching leaderboard data...");
   console.log("Fetched data:", data);
   console.error("Error fetching data:", error);
   ```

### Step 6: Finalize Styling

1. **Ensure Responsive Design:**
   - Use Tailwind CSS classes to ensure the leaderboard is responsive across different screen sizes.
   - Test the layout on various devices to confirm responsiveness.

2. **Apply Consistent Branding:**
   - Use Tailwind CSS variable-based colors to align with SambaTV branding.
   - Avoid using indigo or blue colors unless specified.

By following these steps, you will create a fully functional and visually appealing Leaderboard component that integrates seamlessly with the existing Next.js project template.