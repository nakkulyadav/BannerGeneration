/**
 * Background Removal Service
 *
 * Uses remove.bg API to remove backgrounds from images.
 * Returns processed images as base64 data URLs for immediate use in the frontend.
 *
 * Free tier: 50 API calls per month
 * Paid tier: $0.20 per image after free quota
 */

import axios from 'axios';

/**
 * Remove background from an image using remove.bg API
 *
 * @param {string} imageUrl - Public URL of the image to process
 * @returns {Promise<string>} Base64 data URL of the processed image (PNG with transparency)
 *
 * @throws {Error} If API key is missing, rate limit exceeded, or processing fails
 *
 * @example
 * const processedImage = await removeBackground('https://example.com/image.jpg');
 * // Returns: 'data:image/png;base64,iVBORw0KGgo...'
 */
async function removeBackground(imageUrl) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  // Validate API key
  if (!apiKey || apiKey === 'your_removebg_api_key_here') {
    throw new Error('Remove.bg API key is not configured. Please add REMOVE_BG_API_KEY to .env file.');
  }

  // Validate image URL
  if (!imageUrl || !imageUrl.startsWith('http')) {
    throw new Error('Invalid image URL. Must be a valid HTTP/HTTPS URL.');
  }

  try {
    console.log('[remove.bg] Processing image:', imageUrl);

    // Call remove.bg API
    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      {
        image_url: imageUrl,
        size: 'auto', // Automatic size selection (up to original resolution)
        format: 'png', // PNG format with transparency
        crop: false,   // Don't crop the image
      },
      {
        headers: {
          'X-Api-Key': apiKey,
        },
        responseType: 'arraybuffer', // Get binary data
        timeout: 30000, // 30 second timeout
      }
    );

    // Convert binary data to base64
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Log API credits remaining (if available in headers)
    const creditsRemaining = response.headers['x-credits-remaining'];
    if (creditsRemaining !== undefined) {
      console.log(`[remove.bg] Credits remaining: ${creditsRemaining}`);
    }

    console.log('[remove.bg] Background removed successfully');
    return dataUrl;

  } catch (error) {
    // Handle specific remove.bg API errors
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      // Try to parse error message from response
      let errorMessage = 'Background removal failed';
      if (errorData) {
        try {
          const errorText = Buffer.from(errorData).toString('utf8');
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.errors?.[0]?.title || errorMessage;
        } catch (parseError) {
          // Ignore parse errors, use default message
        }
      }

      // Handle different error cases
      if (status === 403) {
        throw new Error(
          'Remove.bg API access denied. Please verify your API key is valid.'
        );
      } else if (status === 402) {
        throw new Error(
          'Remove.bg free tier exhausted (50/month limit). Upgrade your account or wait until next month.'
        );
      } else if (status === 429) {
        throw new Error(
          'Remove.bg rate limit exceeded. Please wait a moment and try again.'
        );
      } else if (status === 400) {
        throw new Error(
          `Invalid image: ${errorMessage}. The image may be too large, corrupted, or in an unsupported format.`
        );
      } else {
        throw new Error(`Remove.bg API error (${status}): ${errorMessage}`);
      }
    }

    // Network or timeout errors
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'Background removal timed out after 30 seconds. The image may be too large or the service is slow.'
      );
    }

    // Generic error
    throw new Error(`Failed to remove background: ${error.message}`);
  }
}

/**
 * Check remove.bg API account information
 *
 * @returns {Promise<object>} Account information including credits remaining
 *
 * @example
 * const account = await getAccountInfo();
 * // Returns: { credits: { total: 50, remaining: 45, ... } }
 */
async function getAccountInfo() {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey || apiKey === 'your_removebg_api_key_here') {
    throw new Error('Remove.bg API key is not configured.');
  }

  try {
    const response = await axios.get('https://api.remove.bg/v1.0/account', {
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch account info: ${error.message}`);
  }
}

export { removeBackground, getAccountInfo };
