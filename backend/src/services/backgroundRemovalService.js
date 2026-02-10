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
import FormData from 'form-data';

/**
 * Remove background from an image using remove.bg API
 *
 * Supports two input modes:
 * - HTTP/HTTPS URL: sent as `image_url` parameter
 * - Base64 data URL: decoded and sent as `image_file` binary upload
 *
 * @param {string} imageSource - Public URL or base64 data URL (data:image/...;base64,...)
 * @returns {Promise<string>} Base64 data URL of the processed image (PNG with transparency)
 *
 * @throws {Error} If API key is missing, rate limit exceeded, or processing fails
 */
async function removeBackground(imageSource) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  // Validate API key
  if (!apiKey || apiKey === 'your_removebg_api_key_here') {
    throw new Error('Remove.bg API key is not configured. Please add REMOVE_BG_API_KEY to .env file.');
  }

  // Validate input
  if (!imageSource) {
    throw new Error('Invalid image source. Must be a URL or base64 data URL.');
  }

  const isBase64 = imageSource.startsWith('data:');

  if (!isBase64 && !imageSource.startsWith('http')) {
    throw new Error('Invalid image source. Must be a valid HTTP/HTTPS URL or data URL.');
  }

  try {
    console.log('[remove.bg] Processing image:', isBase64 ? 'base64 data URL' : imageSource);

    let requestConfig;

    if (isBase64) {
      // Device upload: extract raw binary from data URL and send as file upload
      const base64Data = imageSource.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');

      const form = new FormData();
      form.append('image_file', imageBuffer, { filename: 'image.png', contentType: 'image/png' });
      form.append('size', 'auto');
      form.append('format', 'png');

      requestConfig = {
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: form,
        headers: {
          ...form.getHeaders(),
          'X-Api-Key': apiKey,
        },
        responseType: 'arraybuffer',
        timeout: 30000,
      };
    } else {
      // URL mode: send as JSON body with image_url
      requestConfig = {
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: {
          image_url: imageSource,
          size: 'auto',
          format: 'png',
          crop: false,
        },
        headers: {
          'X-Api-Key': apiKey,
        },
        responseType: 'arraybuffer',
        timeout: 30000,
      };
    }

    // Call remove.bg API
    const response = await axios(requestConfig);

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
