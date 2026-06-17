/**
 * ResponsiveVoice TTS Server Example
 *
 * A simple HTTP server that provides text-to-speech synthesis via REST API.
 *
 * Usage (from the examples directory):
 *   npm run server
 *
 * Endpoints:
 *   GET  /                     - API documentation
 *   GET  /voices               - List available voices
 *   GET  /voices/:lang         - List voices for a language
 *   POST /synthesize           - Synthesize text to speech
 *   GET  /synthesize?text=...  - Synthesize via query params
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { ResponsiveVoiceAPIClient } from '@responsivevoice/api-client';

const API_KEY = process.env.RESPONSIVEVOICE_API_KEY || '';
const API_SECRET = process.env.RESPONSIVEVOICE_API_SECRET || '';
const API_URL =
  process.env.RESPONSIVEVOICE_API_URL || 'https://texttospeech.responsivevoice.org/v2';
const PORT = parseInt(process.env.PORT || '3001', 10);

const client = new ResponsiveVoiceAPIClient({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  baseUrl: API_URL,
});

// Utility to parse JSON body
async function parseJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Send JSON response
function sendJson(res: ServerResponse, data: unknown, status = 200): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data, null, 2));
}

// Send error response
function sendError(res: ServerResponse, message: string, status = 400): void {
  sendJson(res, { error: message }, status);
}

// Route handlers
async function handleIndex(res: ServerResponse): Promise<void> {
  const docs = {
    name: 'ResponsiveVoice TTS Server',
    version: '1.0.0',
    endpoints: {
      'GET /': 'This documentation',
      'GET /voices': 'List all available voices',
      'GET /voices/:lang': 'List voices for a specific language (e.g., /voices/en-US)',
      'POST /synthesize': 'Synthesize text to speech (JSON body)',
      'GET /synthesize?text=...': 'Synthesize via query parameters',
    },
    examples: {
      'List voices': 'GET /voices',
      'Synthesize (POST)': {
        method: 'POST',
        url: '/synthesize',
        body: {
          text: 'Hello, world!',
          voice: 'UK English Female',
          rate: 1,
          pitch: 1,
        },
      },
      'Synthesize (GET)': 'GET /synthesize?text=Hello&voice=UK%20English%20Female',
    },
    environment: {
      RESPONSIVEVOICE_API_KEY: API_KEY ? 'Set' : 'Not set (required)',
      RESPONSIVEVOICE_API_SECRET: API_SECRET ? 'Set' : 'Not set (required)',
      PORT: PORT,
    },
  };
  sendJson(res, docs);
}

async function handleGetVoices(res: ServerResponse): Promise<void> {
  const { voices } = await client.getVoices();
  sendJson(res, { voices, count: voices.length });
}

async function handleGetVoicesByLang(res: ServerResponse, lang: string): Promise<void> {
  const voices = await client.getVoicesByLanguage(lang);
  sendJson(res, { language: lang, voices, count: voices.length });
}

function parseQueryParams(url: URL) {
  const optionalFloat = (key: string) =>
    url.searchParams.has(key) ? parseFloat(url.searchParams.get(key)!) : undefined;
  return {
    text: url.searchParams.get('text') || undefined,
    voice: url.searchParams.get('voice') || undefined,
    rate: optionalFloat('rate'),
    pitch: optionalFloat('pitch'),
    volume: optionalFloat('volume'),
  };
}

async function handleSynthesize(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!API_KEY || !API_SECRET) {
    sendError(
      res,
      'RESPONSIVEVOICE_API_KEY and RESPONSIVEVOICE_API_SECRET not configured. Get both from your website settings at https://app.responsivevoice.org',
      500
    );
    return;
  }

  const params =
    req.method === 'POST'
      ? ((await parseJsonBody(req)) as {
          text?: string;
          voice?: string;
          rate?: number;
          pitch?: number;
          volume?: number;
        })
      : parseQueryParams(new URL(req.url || '/', `http://localhost:${PORT}`));

  if (!params.text) {
    sendError(res, 'Missing required parameter: text');
    return;
  }

  const result = await client.synthesize({
    text: params.text,
    voice: params.voice || 'UK English Female',
    rate: params.rate ?? 1,
    pitch: params.pitch ?? 1,
    volume: params.volume ?? 1,
  });

  const buffer = Buffer.from(await result.blob.arrayBuffer());
  res.writeHead(200, {
    'Content-Type': `audio/${result.format}`,
    'Content-Length': buffer.length,
    'Access-Control-Allow-Origin': '*',
  });
  res.end(buffer);
}

// Main request handler
async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const path = url.pathname;

  console.log(`[${new Date().toISOString()}] ${req.method} ${path}`);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  try {
    if (path === '/' && req.method === 'GET') {
      await handleIndex(res);
    } else if (path === '/voices' && req.method === 'GET') {
      await handleGetVoices(res);
    } else if (path.startsWith('/voices/') && req.method === 'GET') {
      const lang = path.slice('/voices/'.length);
      await handleGetVoicesByLang(res, lang);
    } else if (path === '/synthesize' && (req.method === 'GET' || req.method === 'POST')) {
      await handleSynthesize(req, res);
    } else {
      sendError(res, 'Not found', 404);
    }
  } catch (error) {
    console.error('Error:', error);
    sendError(res, error instanceof Error ? error.message : 'Internal server error', 500);
  }
}

// Start server
const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  ResponsiveVoice TTS Server                                   ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Server running at: http://localhost:${PORT}                     ║
║                                                               ║
║  Endpoints:                                                   ║
║    GET  /                - API documentation                  ║
║    GET  /voices          - List all voices                    ║
║    GET  /voices/:lang    - Voices by language                 ║
║    POST /synthesize      - Synthesize speech (JSON body)      ║
║    GET  /synthesize?text=... - Synthesize (query params)      ║
║                                                               ║
║  Credentials: ${API_KEY && API_SECRET ? 'Configured' : 'NOT SET - need KEY + SECRET'}                     ║
║  ${API_KEY && API_SECRET ? '' : 'Get both at: https://app.responsivevoice.org                   '}║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);
});
