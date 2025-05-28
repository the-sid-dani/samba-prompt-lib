Below are two separate sections: one for the minimal database schema and one for the state management definitions needed for the Prompt Library.

─────────────────────────────  
1. DATABASE SCHEMA

This schema declares a single table for prompts. It contains the minimum columns needed to display prompt cards (title, description snippet, content, featured flag, usage and votes metrics, and associated tags). An author is referenced via user_id, which defaults to next_auth.uid(), and standard created/updated timestamps are provided. Note that the id column is defined as an identity column as required.

--------------------------------------------------
create table prompt (
  id integer generated always as identity primary key,
  title text not null,
  description text not null,
  content text not null,
  featured boolean not null default false,
  uses integer not null default 0,
  votes integer not null default 0,
  tags text[] not null default '{}',
  user_id uuid not null default next_auth.uid(),
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);
--------------------------------------------------

─────────────────────────────  
2. STATE MANAGEMENT

Below is a TypeScript interface for a Prompt object along with a PromptState interface. This minimal state slice holds a list of prompts and a currently selected prompt. It also includes actions for setting, updating, adding, or removing a prompt—covering the needs for list views (the Explore/Leaderboard pages) and detail views.

--------------------------------------------------
export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  featured: boolean;
  uses: number;
  votes: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  // Optionally include basic author info if needed for UI rendering
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface PromptState {
  currentPrompt: Prompt | null;
  prompts: Prompt[];
  // Actions for state management:
  setCurrentPrompt: (prompt: Prompt | null) => void;
  updateCurrentPrompt: (updates: Partial<Prompt>) => void;
  addPrompt: (prompt: Prompt) => void;
  removePrompt: (promptId: string) => void;
  setPrompts: (prompts: Prompt[]) => void;
}
--------------------------------------------------

These definitions should integrate well with the UI components from shadcn/ui, Tailwind CSS for styling the cards and lists, and the authenticated state provided by your Next.js SaaS Starter Template.