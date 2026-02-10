-- =============================================================================
-- DigiHaat Banner Generator - Database Schema
-- =============================================================================
-- Run this SQL in Supabase SQL Editor to set up the database tables and policies.
--
-- Setup Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- =============================================================================

-- =============================================================================
-- PROJECTS TABLE
-- =============================================================================
-- Stores all user projects with canvas state and metadata

CREATE TABLE IF NOT EXISTS public.projects (
    -- Primary key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- User ownership (references Supabase Auth users)
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Project metadata
    name TEXT NOT NULL DEFAULT 'Untitled Project',

    -- Dimension configuration
    dimension_type TEXT NOT NULL, -- 'promotional_banner', 'widget', 'circular_badge', 'rounded_square', 'banner2', 'custom'
    width INTEGER NOT NULL CHECK (width >= 100 AND width <= 4096),
    height INTEGER NOT NULL CHECK (height >= 100 AND height <= 4096),
    border_radius INTEGER NOT NULL DEFAULT 0 CHECK (border_radius >= 0),

    -- Canvas state (stores all elements, positions, styles as JSON)
    canvas_state JSONB DEFAULT '{}'::jsonb,

    -- Thumbnail for project preview
    thumbnail_url TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast user project queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- Index for sorting by update time
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON public.projects(updated_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own projects
CREATE POLICY "Users can view own projects"
    ON public.projects
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can create projects (user_id must match authenticated user)
CREATE POLICY "Users can create own projects"
    ON public.projects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own projects
CREATE POLICY "Users can update own projects"
    ON public.projects
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own projects
CREATE POLICY "Users can delete own projects"
    ON public.projects
    FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================================================
-- AUTOMATIC UPDATED_AT TRIGGER
-- =============================================================================
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on row changes
DROP TRIGGER IF EXISTS set_updated_at ON public.projects;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- STORAGE BUCKET SETUP
-- =============================================================================
-- Note: Run this separately in the Supabase Dashboard Storage section,
-- or use the following SQL:

-- Create storage bucket for project thumbnails (if not using Dashboard UI)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('project-thumbnails', 'project-thumbnails', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policy: Authenticated users can upload to their own folder
-- CREATE POLICY "Users can upload thumbnails"
--     ON storage.objects
--     FOR INSERT
--     TO authenticated
--     WITH CHECK (bucket_id = 'project-thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage policy: Anyone can view thumbnails (public bucket)
-- CREATE POLICY "Public thumbnail access"
--     ON storage.objects
--     FOR SELECT
--     TO public
--     USING (bucket_id = 'project-thumbnails');

-- =============================================================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================================================
-- Uncomment to insert test data after creating a user

-- INSERT INTO public.projects (user_id, name, dimension_type, width, height, border_radius)
-- VALUES
--     ('your-user-uuid-here', 'Test Banner', 'promotional_banner', 722, 312, 12),
--     ('your-user-uuid-here', 'Test Widget', 'widget', 164, 164, 40);
