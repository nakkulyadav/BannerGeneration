/**
 * Project Service
 *
 * Handles all project-related database operations with Supabase.
 * Provides CRUD operations for user projects.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Create a new project
 *
 * @param {Object} params - Project parameters
 * @param {string} params.userId - User ID (from auth)
 * @param {string} params.name - Project name
 * @param {string} params.dimensionType - Preset type or 'custom'
 * @param {number} params.width - Canvas width
 * @param {number} params.height - Canvas height
 * @param {number} params.borderRadius - Border radius
 * @param {Object} [params.canvasState] - Initial canvas state (optional)
 * @returns {Promise<Object>} Created project or error
 */
export const createProject = async ({
  userId,
  name = 'Untitled Project',
  dimensionType,
  width,
  height,
  borderRadius,
  canvasState = {},
}) => {
  if (!isSupabaseConfigured()) {
    // Return a mock project for development without Supabase
    return {
      data: {
        id: `mock-${Date.now()}`,
        user_id: userId,
        name,
        dimension_type: dimensionType,
        width,
        height,
        border_radius: borderRadius,
        canvas_state: canvasState,
        thumbnail_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      error: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name,
        dimension_type: dimensionType,
        width,
        height,
        border_radius: borderRadius,
        canvas_state: canvasState,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating project:', error);
    return { data: null, error };
  }
};

/**
 * Get all projects for a user
 *
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Array of projects or error
 */
export const getProjects = async (userId) => {
  if (!isSupabaseConfigured()) {
    // Return empty array for development without Supabase
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { data: null, error };
  }
};

/**
 * Get a single project by ID
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project data or error
 */
export const getProject = async (projectId) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { data: null, error };
  }
};

/**
 * Update a project
 *
 * @param {string} projectId - Project ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated project or error
 */
export const updateProject = async (projectId, updates) => {
  if (!isSupabaseConfigured()) {
    return { data: { id: projectId, ...updates }, error: null };
  }

  try {
    // Map frontend field names to database column names
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.canvasState !== undefined) dbUpdates.canvas_state = updates.canvasState;
    if (updates.thumbnailUrl !== undefined) dbUpdates.thumbnail_url = updates.thumbnailUrl;

    const { data, error } = await supabase
      .from('projects')
      .update(dbUpdates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating project:', error);
    return { data: null, error };
  }
};

/**
 * Delete a project
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Success or error
 */
export const deleteProject = async (projectId) => {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting project:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { error };
  }
};

/**
 * Duplicate a project
 *
 * @param {string} projectId - Project ID to duplicate
 * @returns {Promise<Object>} Duplicated project or error
 */
export const duplicateProject = async (projectId) => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  try {
    // First, get the original project
    const { data: original, error: fetchError } = await getProject(projectId);

    if (fetchError || !original) {
      return { data: null, error: fetchError || { message: 'Project not found' } };
    }

    // Create a duplicate with "(Copy)" suffix
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: original.user_id,
        name: `${original.name} (Copy)`,
        dimension_type: original.dimension_type,
        width: original.width,
        height: original.height,
        border_radius: original.border_radius,
        canvas_state: original.canvas_state,
        // Don't copy thumbnail - it will be regenerated
      })
      .select()
      .single();

    if (error) {
      console.error('Error duplicating project:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error duplicating project:', error);
    return { data: null, error };
  }
};

/**
 * Rename a project
 *
 * @param {string} projectId - Project ID
 * @param {string} newName - New project name
 * @returns {Promise<Object>} Updated project or error
 */
export const renameProject = async (projectId, newName) => {
  return updateProject(projectId, { name: newName });
};

export default {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  duplicateProject,
  renameProject,
};
