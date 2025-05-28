-- SambaTV Prompt Library Database Schema
-- Created: 2025-05-28
-- Description: Additional tables for the SambaTV Internal Prompt Library application

-- Note: The 'prompt' table already exists with the following structure:
-- id, title, description, content, featured, uses, votes, tags[], user_id, created_at, updated_at

-- Categories table for organizing prompts
create table public.categories (
  id integer generated always as identity primary key,
  name text not null unique,
  description text,
  display_order integer not null default 0,
  created_at timestamp not null default now()
);

comment on table public.categories is 'Defines categories for organizing prompts in the SambaTV Prompt Library. Categories help users find prompts based on their use case or department.';

-- Tags table for flexible prompt tagging
create table public.tags (
  id integer generated always as identity primary key,
  name text not null unique,
  created_at timestamp not null default now()
);

comment on table public.tags is 'Stores unique tags that can be associated with prompts for improved search and filtering capabilities.';

-- Update prompts table to add category reference
alter table public.prompt add column category_id integer references public.categories(id);

-- Junction table for many-to-many relationship between prompts and tags
create table public.prompt_tags (
  prompt_id integer not null references public.prompt(id) on delete cascade,
  tag_id integer not null references public.tags(id) on delete cascade,
  created_at timestamp not null default now(),
  primary key (prompt_id, tag_id)
);

comment on table public.prompt_tags is 'Junction table establishing many-to-many relationships between prompts and tags, allowing flexible categorization.';

-- Prompt versions for tracking changes
create table public.prompt_versions (
  id integer generated always as identity primary key,
  prompt_id integer not null references public.prompt(id) on delete cascade,
  version_number integer not null,
  title text not null,
  description text not null,
  content text not null,
  change_summary text,
  created_by uuid not null,
  created_at timestamp not null default now(),
  unique(prompt_id, version_number)
);

comment on table public.prompt_versions is 'Tracks version history of prompts, storing previous versions with change summaries to maintain an audit trail of modifications.';

-- Prompt forks for tracking derivative work
create table public.prompt_forks (
  id integer generated always as identity primary key,
  original_prompt_id integer not null references public.prompt(id),
  forked_prompt_id integer not null references public.prompt(id),
  created_at timestamp not null default now(),
  unique(original_prompt_id, forked_prompt_id)
);

comment on table public.prompt_forks is 'Records fork relationships between prompts, tracking when users create their own versions based on existing prompts.';

-- Prompt improvements/suggestions
create table public.prompt_improvements (
  id integer generated always as identity primary key,
  prompt_id integer not null references public.prompt(id) on delete cascade,
  suggestion text not null,
  rationale text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'implemented')),
  created_by uuid not null,
  reviewed_by uuid,
  reviewed_at timestamp,
  created_at timestamp not null default now()
);

comment on table public.prompt_improvements is 'Stores improvement suggestions for existing prompts, enabling collaborative enhancement with review workflow.';

-- User favorites
create table public.user_favorites (
  id integer generated always as identity primary key,
  user_id uuid not null,
  prompt_id integer not null references public.prompt(id) on delete cascade,
  created_at timestamp not null default now(),
  unique(user_id, prompt_id)
);

comment on table public.user_favorites is 'Tracks which prompts users have marked as favorites for quick access to frequently used prompts.';

-- Prompt comments
create table public.prompt_comments (
  id integer generated always as identity primary key,
  prompt_id integer not null references public.prompt(id) on delete cascade,
  user_id uuid not null,
  content text not null,
  parent_comment_id integer references public.prompt_comments(id) on delete cascade,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

comment on table public.prompt_comments is 'Enables users to comment on prompts and reply to other comments, fostering discussion and knowledge sharing.';

-- Prompt votes
create table public.prompt_votes (
  id integer generated always as identity primary key,
  prompt_id integer not null references public.prompt(id) on delete cascade,
  user_id uuid not null,
  vote_type text not null check (vote_type in ('up', 'down')),
  created_at timestamp not null default now(),
  unique(prompt_id, user_id)
);

comment on table public.prompt_votes is 'Records user votes on prompts to determine popularity and quality, limited to one vote per user per prompt.';

-- Playground sessions
create table public.playground_sessions (
  id integer generated always as identity primary key,
  user_id uuid not null,
  prompt_id integer references public.prompt(id) on delete set null,
  model_name text not null,
  model_parameters jsonb not null default '{}'::jsonb,
  input_text text not null,
  output_text text,
  tokens_used integer,
  execution_time_ms integer,
  error_message text,
  created_at timestamp not null default now()
);

comment on table public.playground_sessions is 'Logs playground testing sessions where users test prompts with AI models, storing inputs, outputs, and performance metrics.';

-- User interactions tracking
create table public.user_interactions (
  id integer generated always as identity primary key,
  user_id uuid not null,
  prompt_id integer not null references public.prompt(id) on delete cascade,
  interaction_type text not null check (interaction_type in ('view', 'copy', 'fork', 'share', 'test')),
  created_at timestamp not null default now()
);

comment on table public.user_interactions is 'Tracks user interactions with prompts for analytics, including views, copies, forks, shares, and tests.';

-- Create indexes for better performance
create index idx_prompt_category on public.prompt(category_id);
create index idx_prompt_versions_prompt on public.prompt_versions(prompt_id);
create index idx_user_favorites_user on public.user_favorites(user_id);
create index idx_user_favorites_prompt on public.user_favorites(prompt_id);
create index idx_prompt_comments_prompt on public.prompt_comments(prompt_id);
create index idx_prompt_votes_prompt on public.prompt_votes(prompt_id);
create index idx_playground_sessions_user on public.playground_sessions(user_id);
create index idx_playground_sessions_prompt on public.playground_sessions(prompt_id);
create index idx_user_interactions_user on public.user_interactions(user_id);
create index idx_user_interactions_prompt on public.user_interactions(prompt_id);
create index idx_user_interactions_type on public.user_interactions(interaction_type);

-- Enable Row Level Security on all tables
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.prompt_tags enable row level security;
alter table public.prompt_versions enable row level security;
alter table public.prompt_forks enable row level security;
alter table public.prompt_improvements enable row level security;
alter table public.user_favorites enable row level security;
alter table public.prompt_comments enable row level security;
alter table public.prompt_votes enable row level security;
alter table public.playground_sessions enable row level security;
alter table public.user_interactions enable row level security;

-- RLS Policies for categories (read-only for all, write for admins only)
create policy "Categories are viewable by everyone" on public.categories
  as permissive for select
  to anon, authenticated
  using (true);

-- RLS Policies for tags (read-only for all, write for admins only)
create policy "Tags are viewable by everyone" on public.tags
  as permissive for select
  to anon, authenticated
  using (true);

-- RLS Policies for prompt_tags
create policy "Prompt tags are viewable by everyone" on public.prompt_tags
  as permissive for select
  to anon, authenticated
  using (true);

create policy "Prompt tags can be added by prompt owner" on public.prompt_tags
  as permissive for insert
  to authenticated
  with check (exists (
    select 1 from public.prompt
    where id = prompt_id and user_id = auth.uid()
  ));

create policy "Prompt tags can be deleted by prompt owner" on public.prompt_tags
  as permissive for delete
  to authenticated
  using (exists (
    select 1 from public.prompt
    where id = prompt_id and user_id = auth.uid()
  ));

-- RLS Policies for prompt_versions
create policy "Prompt versions are viewable by everyone" on public.prompt_versions
  as permissive for select
  to anon, authenticated
  using (true);

create policy "Prompt versions can be created by prompt owner" on public.prompt_versions
  as permissive for insert
  to authenticated
  with check (
    exists (
      select 1 from public.prompt
      where id = prompt_id and user_id = auth.uid()
    ) and created_by = auth.uid()
  );

-- RLS Policies for prompt_forks
create policy "Prompt forks are viewable by everyone" on public.prompt_forks
  as permissive for select
  to anon, authenticated
  using (true);

create policy "Users can create prompt forks" on public.prompt_forks
  as permissive for insert
  to authenticated
  with check (
    exists (
      select 1 from public.prompt
      where id = forked_prompt_id and user_id = auth.uid()
    )
  );

-- RLS Policies for prompt_improvements
create policy "Prompt improvements are viewable by everyone" on public.prompt_improvements
  as permissive for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can suggest improvements" on public.prompt_improvements
  as permissive for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "Improvement authors can update their suggestions" on public.prompt_improvements
  as permissive for update
  to authenticated
  using (created_by = auth.uid() and status = 'pending');

-- RLS Policies for user_favorites
create policy "Users can view their own favorites" on public.user_favorites
  as permissive for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can add favorites" on public.user_favorites
  as permissive for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can remove their favorites" on public.user_favorites
  as permissive for delete
  to authenticated
  using (user_id = auth.uid());

-- RLS Policies for prompt_comments
create policy "Comments are viewable by everyone" on public.prompt_comments
  as permissive for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can post comments" on public.prompt_comments
  as permissive for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own comments" on public.prompt_comments
  as permissive for update
  to authenticated
  using (user_id = auth.uid());

create policy "Users can delete their own comments" on public.prompt_comments
  as permissive for delete
  to authenticated
  using (user_id = auth.uid());

-- RLS Policies for prompt_votes
create policy "Votes are viewable by everyone" on public.prompt_votes
  as permissive for select
  to anon, authenticated
  using (true);

create policy "Users can vote" on public.prompt_votes
  as permissive for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can change their vote" on public.prompt_votes
  as permissive for update
  to authenticated
  using (user_id = auth.uid());

create policy "Users can remove their vote" on public.prompt_votes
  as permissive for delete
  to authenticated
  using (user_id = auth.uid());

-- RLS Policies for playground_sessions
create policy "Users can view their own sessions" on public.playground_sessions
  as permissive for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can create sessions" on public.playground_sessions
  as permissive for insert
  to authenticated
  with check (user_id = auth.uid());

-- RLS Policies for user_interactions
create policy "Interactions are viewable by prompt owners and the user" on public.user_interactions
  as permissive for select
  to authenticated
  using (
    user_id = auth.uid() or 
    exists (
      select 1 from public.prompt
      where id = prompt_id and user_id = auth.uid()
    )
  );

create policy "System can track interactions" on public.user_interactions
  as permissive for insert
  to authenticated
  with check (user_id = auth.uid());

-- Function to automatically update prompt vote count
create or replace function update_prompt_vote_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.prompt
    set votes = votes + case when NEW.vote_type = 'up' then 1 else -1 end
    where id = NEW.prompt_id;
  elsif TG_OP = 'DELETE' then
    update public.prompt
    set votes = votes - case when OLD.vote_type = 'up' then 1 else -1 end
    where id = OLD.prompt_id;
  elsif TG_OP = 'UPDATE' then
    update public.prompt
    set votes = votes 
      - case when OLD.vote_type = 'up' then 1 else -1 end
      + case when NEW.vote_type = 'up' then 1 else -1 end
    where id = NEW.prompt_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger to update vote counts
create trigger update_prompt_vote_count_trigger
after insert or update or delete on public.prompt_votes
for each row execute function update_prompt_vote_count();

-- Function to track prompt uses
create or replace function track_prompt_use()
returns trigger as $$
begin
  if NEW.interaction_type = 'copy' or NEW.interaction_type = 'test' then
    update public.prompt
    set uses = uses + 1
    where id = NEW.prompt_id;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger to update use counts
create trigger track_prompt_use_trigger
after insert on public.user_interactions
for each row execute function track_prompt_use();

-- Function to create a new version when prompt is updated
create or replace function create_prompt_version()
returns trigger as $$
declare
  v_version_number integer;
begin
  -- Only create version if content actually changed
  if OLD.content != NEW.content or OLD.title != NEW.title or OLD.description != NEW.description then
    -- Get the next version number
    select coalesce(max(version_number), 0) + 1 into v_version_number
    from public.prompt_versions
    where prompt_id = NEW.id;
    
    -- Insert the previous version
    insert into public.prompt_versions (
      prompt_id, version_number, title, description, content, created_by
    ) values (
      NEW.id, v_version_number, OLD.title, OLD.description, OLD.content, NEW.user_id
    );
  end if;
  
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger to create versions on prompt updates
create trigger create_prompt_version_trigger
before update on public.prompt
for each row execute function create_prompt_version();

-- Insert default categories
insert into public.categories (name, description, display_order) values
  ('General', 'General purpose prompts for various tasks', 1),
  ('Development', 'Programming and software development prompts', 2),
  ('Data Analysis', 'Data analysis and visualization prompts', 3),
  ('Marketing', 'Marketing and content creation prompts', 4),
  ('Sales', 'Sales enablement and customer interaction prompts', 5),
  ('HR', 'Human resources and recruitment prompts', 6),
  ('Finance', 'Financial analysis and reporting prompts', 7),
  ('Legal', 'Legal document and contract prompts', 8),
  ('Customer Support', 'Customer service and support prompts', 9),
  ('Research', 'Research and investigation prompts', 10);

-- Insert some common tags
insert into public.tags (name) values
  ('gpt-4'),
  ('claude'),
  ('gemini'),
  ('coding'),
  ('analysis'),
  ('creative'),
  ('technical'),
  ('template'),
  ('automation'),
  ('reporting'); 