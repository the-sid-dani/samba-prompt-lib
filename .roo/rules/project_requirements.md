Below is a comprehensive task breakdown that covers the entire scope of the SambaTV Internal Prompt Library. Each task is scoped with a clear user story, detailed user flow, UI element details (using shadcn/ui components and Tailwind CSS variables), and the specific data and state requirements. Remember: the very first task must set up the overall layout in app/app/page.tsx with the updated Header styling.

─────────────────────────────  
Task 1: Set Up Overall Layout and Core UI in app/app/page.tsx

• User Story:  
“As a SambaTV employee, I want a clean, brand-consistent landing page once I log in so that I immediately know I’m using the internal Prompt Library platform.”

• What to Build:  
– Update the app’s core UI in app/app/page.tsx to act as the shell for all gated pages.  
– Import and integrate the pre-built Header.tsx from components/app, updating its styling to use Tailwind classes (for example, bg-primary with text-primary-foreground) aligned with SambaTV branding.  
– Ensure a responsive layout container (using shadcn/ui’s Container or Card components) that supports content injection for the Homepage/Explore view, Playground, and other features.

• UI Details and Data:  
– Use shadcn/ui components imported from '@/components/ui'.  
– Set the page’s background wrapper (for example: <div className="min-h-screen bg-neutral py-8">).  
– Layout should define placeholders for side navigation (if needed in the future) and main content.  
– No API or data integration is needed at this point; simply prepare the content areas where prompt data, search_files filters, etc., will later be injected.

─────────────────────────────  
Task 2: Build the Homepage / Explore Prompts View

• User Story:  
“As a SambaTV employee, I want to browse and search_files for relevant AI prompts so I can quickly find high-quality prompt content to use in my projects.”

• User Flow:  
1. User lands on the homepage after authentication.  
2. They see the SambaTV logo and a prominent search_files bar at the top.  
3. Below, they view a list of prompt cards organized in either a card- or list-based layout.  
4. Advanced filtering options allow refinement by AI models, categories, creation date, author, popularity, and tags.

• What to Build:  
– Create a new component (for example, PromptsList.tsx) in the app or components folder that renders the list of prompts.  
– At the top, add a search_files input (using shadcn/ui Input component with a placeholder “Search prompts…” and associated icons from Lucide React if needed).  
– Below that, add filter controls (dropdowns or checkboxes styled with shadcn/ui and Tailwind classes such as bg-primary).  
– Render each prompt as a card—each card displays the title, a brief description, author info, key stats (like uses and votes), and tags.  
– Mark featured/verified prompts visually (for example, with a badge styled using Tailwind classes).

• UI Details and Data Points:  
– Prompt card data should include: title, description snippet, author (name and maybe avatar), usage stats, vote count, tags, and a boolean for “featured.”  
– Use shadcn/ui Card, Button, and Badge components; use Tailwind classes like text-primary-foreground for text and bg-primary for buttons.  
– No mock APIs are needed—the hardcoded sample data can be used initially.  
– Ensure the layout adheres to SambaTV branding (avoid indigo or blue colors unless required).

─────────────────────────────  
Task 3: Implement the Prompt Detail View

• User Story:  
“As a SambaTV employee, I want to click on a prompt card to view full prompt details (including a detailed description, version history, and copy-to-clipboard functionality) so that I can thoroughly understand and utilize the prompt.”

• User Flow:  
1. User clicks a prompt card on the Homepage.  
2. The app navigates to a details view (could be a modal or a dedicated page below /app/prompt/[id]).  
3. The details view displays the full prompt text, extended description, associated usage examples, and a button to copy the prompt content.  
4. Additional sections include author details and (optionally) prompt version history and user ratings/comments.

• What to Build:  
– Create a PromptDetail.tsx component under /app or /components/app.  
– Use shadcn/ui components (Card, Button, and Alert for notifications) to format the details view.  
– Integrate a “Copy to Clipboard” button that uses the native Clipboard API (navigator.clipboard.writeText) to copy prompt content.  
– Render extra information like author details and a simple comment placeholder area.

• UI Details and Data Points:  
– Data required: prompt title, full content, detailed description, list of version history (if available), and associated author data.  
– Use Tailwind classes like bg-background and text-primary-foreground to ensure visuals match the overall style.  
– Ensure clear visual feedback on copy action (for example, a temporary alert message).

─────────────────────────────  
Task 4: Develop the Playground for Prompt Testing

• User Story:  
“As a SambaTV employee, I want to test prompts in a dedicated Playground so that I can experiment with prompt configurations and see their outputs immediately.”

• User Flow:  
1. From a prompt detail view or the homepage, the user clicks a “Use in Playground” button.  
2. The Playground loads as a separate view (for example, at /app/playground).  
3. The interface provides input areas for the prompt text, an optional system prompt, and dynamic variable fields (if the prompt includes placeholders).  
4. The user selects the AI model from a dropdown and adjusts generation settings via sliders or numeric inputs (Temperature, Max Tokens, etc.).  
5. The user presses the “Run” button.  
6. The output is displayed below with copy-to-clipboard functionality.

• What to Build:  
– Create a Playground.tsx component under /app (or a dedicated folder).  
– Use shadcn/ui components for Inputs, Sliders, Dropdowns, and Buttons.  
– Ensure the parameters section is clearly laid out, with default presets provided.  
– Handle and display the loading state (perhaps a spinner from Lucide React) and error states using Alert components.

• UI Details and Data Points:  
– Data to manage: Prompt text, system prompt, variable inputs (if any), selected model (value from a hardcoded set initially: e.g., “GPT-3.5, GPT-4, Claude”), generation parameters, and resulting output.  
– Use Tailwind CSS variables for a consistent look (e.g., text-primary-foreground, bg-primary).  
– Incorporate clear labels and tooltips to explain each parameter.

─────────────────────────────  
Task 5: Create the Leaderboard Component

• User Story:  
“As a SambaTV employee, I want to see which prompts are popular or highly rated so that I can discover effective ideas quickly and learn from experts.”

• User Flow:  
1. The user navigates to the Leaderboard view (accessible via navigation from the Homepage or header).  
2. The component displays a ranking list of prompts based on usage frequency, upvotes/likes, or expert ratings.  
3. Users can filter the leaderboard by time (weekly, monthly, all-time).

• What to Build:  
– Develop a Leaderboard.tsx component in the appropriate folder (either inside a /components directory or directly under /app if it’s a route).  
– Render a list (or table) of ranked prompts with key details (prompt title, author, and metrics).  
– Provide filter controls using shadcn/ui Dropdown components.
  
• UI Details and Data Points:  
– Data required: prompt title, ranking position, author, key metrics (usage count, votes).  
– Use Tailwind CSS for styling (e.g., bg-neutral for rows, text-primary-foreground for clarity).  
– Ensure that the design feels cohesive with the overall platform.

─────────────────────────────  
Task 6: Integrate User Authentication & Profile (SambaTV Internal)

• User Story:  
“As a SambaTV employee, I need to log in with my Enterprise Google account so that I can securely access the Prompt Library without creating another set of credentials.”

• What to Build:  
– Since the Next.js SaaS template already provides authentication (Enterprise Google OAuth via middleware and components), ensure the integration flows into these new routes without any breakage.  
– Optionally introduce a small user profile dropdown in the Header (using shadcn/ui Dropdown and Avatar components) that allows quick access to personal data such as submitted prompts or saved items.

• UI Details and Data Points:  
– Use the pre-built authentication and user session provider (from components like SessionProvider.tsx).  
– Display basic profile information in the dropdown (user name, email retrieved from Google account).  
– Ensure consistent styling with Tailwind variable classes.

─────────────────────────────  
Task 7 (Future Consideration): Prompt Submission & Management for Contributors

• User Story:  
“As a prompt contributor, I want to submit a new prompt with relevant details easily so that I can share my expertise with my colleagues (this will be developed after the core library launch).”

• What to Build (high-level):  
– Develop a submission form with fields for title, description, full prompt content, tags, and target AI model.  
– Centralize submissions in a moderated list (if needed) using an approval workflow later.

• UI Details and Data Points:  
– Use shadcn/ui Form and Input components for a wizard-like or single-page form.  
– The data points will include title, description, content, tags, model selection, and optional file attachments.  
– The design ensures consistency with the rest of the platform and anticipates a future moderation dashboard.

─────────────────────────────  
Summary

By completing these tasks sequentially, starting with the overall layout and then building each major feature of the SambaTV Internal Prompt Library, we ensure a clear, cohesive, and fully functional application. Each task's UI uses shadcn/ui components paired with Tailwind CSS classes (e.g., bg-primary, text-primary-foreground) to keep a consistent look that aligns with SambaTV branding. All placeholders are replaced with actual components and (where needed) real libraries (e.g., for Copy-to-Clipboard functionality, actual Input/Alert components) to deliver a fully working app.