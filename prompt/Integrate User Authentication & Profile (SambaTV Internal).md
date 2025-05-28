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

# Integrate User Authentication & Profile (SambaTV Internal)

## Task
Integrate user authentication using the existing Next.js SaaS template's authentication system and enhance the user profile experience.

## Implementation Guide

### Step 1: Ensure Authentication Middleware is Active

1. **Verify Middleware Configuration:**
   - Ensure that `middleware.ts` is correctly set up to protect the necessary routes. This file should already be in place as part of the Next.js SaaS template.
   - Confirm that the middleware is located in the `src/middleware.ts` file and is configured to enforce authentication on all internal routes.

### Step 2: Update the Header with User Profile Dropdown

1. **Modify the Header Component:**
   - Navigate to `components/app/Header.tsx`.
   - Add a user profile dropdown using `shadcn/ui` components and Tailwind CSS for styling.

2. **Implement the Profile Dropdown:**
   - Use the `Dropdown` and `Avatar` components from `shadcn/ui` to create a user-friendly profile menu.
   - Display basic user information such as the user's name and email, which can be retrieved from the session.

3. **Example Code for Profile Dropdown:**
   ```typescript
   import { Dropdown, Avatar } from "@/components/ui";
   import { useSession } from "next-auth/react";

   const Header = () => {
     const { data: session } = useSession();

     return (
       <header className="bg-primary text-primary-foreground flex justify-between items-center p-4">
         <div className="logo">SambaTV</div>
         {session && (
           <Dropdown>
             <Dropdown.Trigger>
               <Avatar src={session.user.image} alt={session.user.name} />
             </Dropdown.Trigger>
             <Dropdown.Content>
               <Dropdown.Item>{session.user.name}</Dropdown.Item>
               <Dropdown.Item>{session.user.email}</Dropdown.Item>
               <Dropdown.Item onClick={() => signOut()}>Sign Out</Dropdown.Item>
             </Dropdown.Content>
           </Dropdown>
         )}
       </header>
     );
   };

   export default Header;
   ```

### Step 3: Ensure Authentication Flow is Seamless

1. **Verify Authentication Pages:**
   - Ensure that the authentication pages (sign-in, sign-out) are correctly set up and functioning. These should be located in the `components/user/` directory.

2. **Session Management:**
   - Use the `SessionProvider` from `next-auth` to manage user sessions across the application. This should already be integrated into the app's root layout.

3. **Sign In/Out Functionality:**
   - Ensure that the sign-in and sign-out buttons are prominently displayed and functional. The sign-out action should be included in the profile dropdown as shown in the example code.

### Step 4: Test the Integration

1. **Verify User Authentication:**
   - Test the authentication flow by signing in and out using an Enterprise Google account.
   - Ensure that the user profile dropdown displays the correct user information.

2. **Check Protected Routes:**
   - Navigate to various protected routes to confirm that the middleware is correctly enforcing authentication.

3. **UI Consistency:**
   - Ensure that the UI components are styled consistently with the rest of the application using Tailwind CSS classes like `bg-primary` and `text-primary-foreground`.

By following these steps, you will successfully integrate user authentication and enhance the user profile experience in the SambaTV Internal Prompt Library. This setup leverages the existing authentication system provided by the Next.js SaaS template, ensuring a seamless and secure user experience.