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

# Implementation Guide: Set Up Overall Layout and Core UI in `app/app/page.tsx`

## Task Overview
Create a clean, brand-consistent landing page for the SambaTV Internal Prompt Library. This page will serve as the shell for all gated pages, providing a responsive layout that supports content injection for various views like Homepage/Explore, Playground, and more.

## Implementation Steps

### Step 1: Update the Overall Layout

1. **Create the Page Component**
   - Navigate to `app/app/page.tsx`.
   - Set up the basic structure of the page using a functional component.

2. **Import Required Components**
   - Import the `Header` component from `components/app/Header.tsx`.
   - Import necessary components from `shadcn/ui` for layout, such as `Container` or `Card`.

3. **Set Up the Layout Structure**
   - Use a wrapper `div` with Tailwind CSS classes to define the page's background and padding:
     ```jsx
     <div className="min-h-screen bg-neutral py-8">
     ```
   - Inside this wrapper, include the `Header` component at the top.

4. **Define the Main Content Area**
   - Use a `Container` or `Card` component from `shadcn/ui` to create a responsive layout for the main content.
   - Ensure the layout is flexible to accommodate future side navigation if needed.

5. **Add Placeholders for Future Content**
   - Within the main content area, add placeholders for sections like the Homepage/Explore view, Playground, etc.
   - Example:
     ```jsx
     <Container>
       <div className="flex flex-col items-center">
         <h1 className="text-primary-foreground">Welcome to the SambaTV Prompt Library</h1>
         {/* Placeholder for future content */}
         <div className="mt-4">
           {/* Content will be injected here */}
         </div>
       </div>
     </Container>
     ```

### Step 2: Style the Header

1. **Update Header Styling**
   - Ensure the `Header` component uses Tailwind CSS classes for styling, such as `bg-primary` and `text-primary-foreground`.
   - If necessary, update the `Header.tsx` component in `components/app` to align with SambaTV branding.

### Step 3: Ensure Responsiveness

1. **Responsive Design**
   - Use Tailwind CSS utility classes to ensure the layout is responsive across different screen sizes.
   - Test the layout on various devices to confirm responsiveness.

### Step 4: Debug Logging

1. **Add Debug Logs**
   - Include console logs to track the rendering of the main components and layout setup.
   - Example:
     ```javascript
     console.log("Rendering main layout in app/app/page.tsx");
     ```

### Step 5: Finalize and Review

1. **Review the Layout**
   - Ensure the layout is clean, consistent with branding, and ready for content injection.
   - Verify that the `Header` is styled correctly and the main content area is prepared for future features.

By following these steps, you will establish a solid foundation for the SambaTV Internal Prompt Library's overall layout, ensuring it is both visually appealing and functionally ready for future enhancements.