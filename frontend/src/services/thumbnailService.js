/**
 * Thumbnail Service
 *
 * Handles generation, upload, and retrieval of project thumbnails.
 * Thumbnails are scaled-down previews stored in Supabase Storage.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Thumbnail configuration
const THUMBNAIL_CONFIG = {
  maxWidth: 200,
  maxHeight: 150,
  format: 'image/jpeg',
  quality: 0.8,
};

/**
 * Generate a thumbnail from a Fabric.js canvas
 *
 * @param {Object} canvas - Fabric.js canvas instance
 * @returns {Promise<Blob|null>} Thumbnail blob or null on error
 */
export const generateThumbnail = async (canvas) => {
  if (!canvas) {
    console.error('No canvas provided for thumbnail generation');
    return null;
  }

  try {
    // Get the canvas as data URL
    const dataUrl = canvas.toDataURL({
      format: 'jpeg',
      quality: THUMBNAIL_CONFIG.quality,
      multiplier: Math.min(
        THUMBNAIL_CONFIG.maxWidth / canvas.width,
        THUMBNAIL_CONFIG.maxHeight / canvas.height
      ),
    });

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
};

/**
 * Upload a thumbnail to Supabase Storage
 *
 * @param {string} projectId - Project ID (used as folder name)
 * @param {Blob} thumbnailBlob - Thumbnail image blob
 * @returns {Promise<Object>} Upload result with URL or error
 */
export const uploadThumbnail = async (projectId, thumbnailBlob) => {
  if (!isSupabaseConfigured()) {
    // Return a mock URL for development without Supabase
    return {
      url: `data:image/jpeg;base64,${btoa('mock-thumbnail')}`,
      error: null,
    };
  }

  try {
    // Generate filename with timestamp to avoid caching issues
    const filename = `${projectId}/thumbnail-${Date.now()}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-thumbnails')
      .upload(filename, thumbnailBlob, {
        contentType: 'image/jpeg',
        upsert: true, // Replace existing thumbnail
      });

    if (error) {
      console.error('Error uploading thumbnail:', error);
      return { url: null, error };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-thumbnails')
      .getPublicUrl(filename);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    return { url: null, error };
  }
};

/**
 * Get the thumbnail URL for a project
 *
 * @param {string} projectId - Project ID
 * @returns {string|null} Public thumbnail URL or null
 */
export const getThumbnailUrl = (projectId) => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  // Note: This returns the expected URL, but the actual thumbnail may not exist
  // The actual URL should be stored in the project record
  const { data: { publicUrl } } = supabase.storage
    .from('project-thumbnails')
    .getPublicUrl(`${projectId}/thumbnail.jpg`);

  return publicUrl;
};

/**
 * Delete all thumbnails for a project
 *
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Success or error
 */
export const deleteThumbnails = async (projectId) => {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  try {
    // List all files in the project folder
    const { data: files, error: listError } = await supabase.storage
      .from('project-thumbnails')
      .list(projectId);

    if (listError) {
      console.error('Error listing thumbnails:', listError);
      return { error: listError };
    }

    if (!files || files.length === 0) {
      return { error: null };
    }

    // Delete all files in the folder
    const filePaths = files.map(file => `${projectId}/${file.name}`);
    const { error } = await supabase.storage
      .from('project-thumbnails')
      .remove(filePaths);

    if (error) {
      console.error('Error deleting thumbnails:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting thumbnails:', error);
    return { error };
  }
};

export default {
  generateThumbnail,
  uploadThumbnail,
  getThumbnailUrl,
  deleteThumbnails,
};
