/**
 * API Key Diagnostic Script
 * Tests all API keys to identify configuration issues
 */

import 'dotenv/config';
import axios from 'axios';

console.log('🔍 Testing API Configuration...\n');

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

/**
 * Test Google Custom Search API
 */
async function testGoogleSearch() {
  console.log(`${colors.blue}1. Testing Google Custom Search API...${colors.reset}`);

  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey) {
    console.log(`${colors.red}   ✗ GOOGLE_API_KEY is missing${colors.reset}\n`);
    return false;
  }

  if (!searchEngineId) {
    console.log(`${colors.red}   ✗ GOOGLE_SEARCH_ENGINE_ID is missing${colors.reset}\n`);
    return false;
  }

  console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`   Search Engine ID: ${searchEngineId}`);

  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: searchEngineId,
        q: 'test',
        searchType: 'image',
        num: 1
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      console.log(`${colors.green}   ✓ Google Custom Search API is working!${colors.reset}`);
      console.log(`   Found ${response.data.searchInformation.totalResults} results\n`);
      return true;
    } else {
      console.log(`${colors.yellow}   ⚠ API responded but returned no results${colors.reset}\n`);
      return false;
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || 'Unknown error';

      console.log(`${colors.red}   ✗ Error ${status}: ${message}${colors.reset}`);

      if (status === 403) {
        console.log(`${colors.yellow}   💡 Fix: Enable "Custom Search API" in Google Cloud Console${colors.reset}`);
        console.log(`   URL: https://console.cloud.google.com/apis/library/customsearch.googleapis.com\n`);
      } else if (status === 400) {
        console.log(`${colors.yellow}   💡 Fix: Check your Search Engine ID is correct${colors.reset}`);
        console.log(`   URL: https://programmablesearchengine.google.com/controlpanel/all\n`);
      } else if (status === 429) {
        console.log(`${colors.yellow}   💡 Daily quota exceeded (100 searches/day on free tier)\n${colors.reset}`);
      }
    } else {
      console.log(`${colors.red}   ✗ Network error: ${error.message}${colors.reset}\n`);
    }
    return false;
  }
}


/**
 * Test remove.bg API
 */
async function testRemoveBgAPI() {
  console.log(`${colors.blue}2. Testing remove.bg API...${colors.reset}`);

  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    console.log(`${colors.red}   ✗ REMOVE_BG_API_KEY is missing${colors.reset}\n`);
    return false;
  }

  console.log(`   API Key: ${apiKey.substring(0, 8)}...`);

  try {
    // Test with account info endpoint (doesn't consume credits)
    const response = await axios.get('https://api.remove.bg/v1.0/account', {
      headers: {
        'X-Api-Key': apiKey
      }
    });

    const credits = response.data.data.attributes;
    console.log(`${colors.green}   ✓ remove.bg API is working!${colors.reset}`);
    console.log(`   Credits remaining: ${credits.credits.total - credits.credits.used}/${credits.credits.total}`);
    console.log(`   API calls remaining: ${credits.api.free_calls - (credits.api.sizes?.preview || 0)}\n`);
    return true;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status === 403) {
        console.log(`${colors.red}   ✗ Invalid API key${colors.reset}`);
        console.log(`${colors.yellow}   💡 Get a new key at: https://www.remove.bg/api\n${colors.reset}`);
      } else if (status === 402) {
        console.log(`${colors.yellow}   ⚠ Free tier exhausted${colors.reset}\n`);
      }
    } else {
      console.log(`${colors.red}   ✗ Network error: ${error.message}${colors.reset}\n`);
    }
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('═══════════════════════════════════════════════════════\n');

  const googleOk = await testGoogleSearch();
  const removeBgOk = await testRemoveBgAPI();

  console.log('═══════════════════════════════════════════════════════\n');
  console.log(`${colors.blue}Summary:${colors.reset}`);
  console.log(`  Google Custom Search: ${googleOk ? colors.green + '✓ Working' : colors.red + '✗ Failed'}${colors.reset}`);
  console.log(`  remove.bg API: ${removeBgOk ? colors.green + '✓ Working' : colors.red + '✗ Failed'}${colors.reset}\n`);

  if (googleOk && removeBgOk) {
    console.log(`${colors.green}✓ All APIs are configured correctly!${colors.reset}`);
    console.log(`  Your backend is ready to use.\n`);
  } else {
    console.log(`${colors.yellow}⚠ Some APIs need attention. See errors above.${colors.reset}\n`);
  }
}

runTests();
