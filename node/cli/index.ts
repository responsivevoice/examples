/**
 * ResponsiveVoice CLI Example
 *
 * A simple command-line tool for text-to-speech synthesis.
 *
 * Usage (from the examples directory):
 *   npm run cli -- "Hello, world!"
 *   npm run cli -- --voice "UK English Male" "Hello, world!"
 *   npm run cli -- --output hello.mp3 "Hello, world!"
 *   npm run cli -- --list-voices
 *
 * Environment variables can be set in .env file in the examples directory.
 */

import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { ResponsiveVoiceAPIClient } from '@responsivevoice/api-client';

const API_KEY = process.env.RESPONSIVEVOICE_API_KEY || '';
const API_SECRET = process.env.RESPONSIVEVOICE_API_SECRET || '';
const API_URL =
  process.env.RESPONSIVEVOICE_API_URL || 'https://texttospeech.responsivevoice.org/v2';

interface CliOptions {
  text: string;
  voice: string;
  output: string | null;
  stdout: boolean;
  listVoices: boolean;
  rate: number;
  pitch: number;
  volume: number;
}

const FLAG_DEFS: Record<string, (opts: CliOptions, args: string[], i: number) => number> = {
  '--voice': (opts, args, i) => {
    opts.voice = args[i + 1] || opts.voice;
    return i + 1;
  },
  '-v': (opts, args, i) => {
    opts.voice = args[i + 1] || opts.voice;
    return i + 1;
  },
  '--output': (opts, args, i) => {
    opts.output = args[i + 1] || null;
    return i + 1;
  },
  '-o': (opts, args, i) => {
    opts.output = args[i + 1] || null;
    return i + 1;
  },
  '--rate': (opts, args, i) => {
    opts.rate = parseFloat(args[i + 1]) || 1;
    return i + 1;
  },
  '-r': (opts, args, i) => {
    opts.rate = parseFloat(args[i + 1]) || 1;
    return i + 1;
  },
  '--pitch': (opts, args, i) => {
    opts.pitch = parseFloat(args[i + 1]) || 1;
    return i + 1;
  },
  '-p': (opts, args, i) => {
    opts.pitch = parseFloat(args[i + 1]) || 1;
    return i + 1;
  },
  '--volume': (opts, args, i) => {
    opts.volume = parseFloat(args[i + 1]) || 1;
    return i + 1;
  },
  '--stdout': (opts) => {
    opts.stdout = true;
    return 0;
  },
  '--list-voices': (opts) => {
    opts.listVoices = true;
    return 0;
  },
  '-l': (opts) => {
    opts.listVoices = true;
    return 0;
  },
  '--help': () => {
    printHelp();
    process.exit(0);
  },
  '-h': () => {
    printHelp();
    process.exit(0);
  },
};

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    text: '',
    voice: 'UK English Female',
    output: null,
    stdout: false,
    listVoices: false,
    rate: 1,
    pitch: 1,
    volume: 1,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const handler = FLAG_DEFS[arg];
    if (handler) {
      i += handler(options, args, i) || 0;
    } else if (!arg.startsWith('-')) {
      options.text = arg;
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
ResponsiveVoice CLI - Text-to-Speech from the command line

Usage:
  npm run cli -- [options] "text to speak"

Options:
  -v, --voice <name>    Voice name (default: "UK English Female")
  -o, --output <file>   Save audio to file
  --stdout              Write raw audio to stdout (pipe to mpv, ffplay, etc.)
  -r, --rate <number>   Speech rate 0.5-2 (default: 1)
  -p, --pitch <number>  Speech pitch 0.5-2 (default: 1)
  --volume <number>     Volume 0-1 (default: 1)
  -l, --list-voices     List available voices
  -h, --help            Show this help

Environment Variables:
  RESPONSIVEVOICE_API_KEY     Your API key (required for synthesis)
  RESPONSIVEVOICE_API_SECRET  Your API secret (required for synthesis)
  RESPONSIVEVOICE_API_URL     API base URL (default: https://texttospeech.responsivevoice.org/v2)

Examples:
  npm run cli -- "Hello, world!"
  npm run cli -- --voice "US English Male" "Hello!"
  npm run cli -- --output greeting.mp3 "Hello!"
  npm run cli -- --stdout "Hello!" | mpv -
  npm run cli -- --list-voices
`);
}

async function listVoices(client: ResponsiveVoiceAPIClient): Promise<void> {
  console.log('Fetching available voices...\n');

  const { voices } = await client.getVoices();

  // Group by language
  const byLang = new Map<string, typeof voices>();
  for (const voice of voices) {
    const existing = byLang.get(voice.lang) || [];
    existing.push(voice);
    byLang.set(voice.lang, existing);
  }

  // Sort languages
  const sortedLangs = [...byLang.keys()].sort();

  for (const lang of sortedLangs) {
    const langVoices = byLang.get(lang)!;
    console.log(`\n${lang}:`);
    for (const voice of langVoices) {
      const gender = voice.gender ? ` (${voice.gender})` : '';
      console.log(`  - ${voice.name}${gender}`);
    }
  }

  console.log(`\nTotal: ${voices.length} voices`);
}

async function synthesize(client: ResponsiveVoiceAPIClient, options: CliOptions): Promise<void> {
  if (!options.text) {
    console.error('Error: No text provided. Use --help for usage.');
    process.exit(1);
  }

  if (!API_KEY || !API_SECRET) {
    console.error(
      'Error: RESPONSIVEVOICE_API_KEY and RESPONSIVEVOICE_API_SECRET environment variables must be set.'
    );
    console.error('Get both from your website settings at https://app.responsivevoice.org');
    process.exit(1);
  }

  if (!options.stdout) {
    console.log(`Synthesizing: "${options.text}"`);
    console.log(`Voice: ${options.voice}`);
    console.log(`Rate: ${options.rate}, Pitch: ${options.pitch}`);
  }

  const result = await client.synthesize({
    text: options.text,
    voice: options.voice,
    rate: options.rate,
    pitch: options.pitch,
    volume: options.volume,
  });

  const buffer = Buffer.from(await result.blob.arrayBuffer());

  if (options.stdout) {
    // Write raw audio to stdout for piping (e.g., | mpv -)
    process.stdout.write(buffer);
  } else if (options.output) {
    writeFileSync(options.output, buffer);
    console.log(`\nSaved to: ${options.output}`);
    console.log(`Format: ${result.format}`);
    console.log(`Size: ${buffer.length} bytes`);
  } else {
    console.log('\nSynthesis complete!');
    console.log(`Format: ${result.format}`);
    console.log(`Size: ${result.blob.size} bytes`);
    console.log('\nTip: Use --output <file> or --stdout to get the audio.');
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const options = parseArgs(args);

  const client = new ResponsiveVoiceAPIClient({
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    baseUrl: API_URL,
  });

  if (options.listVoices) {
    await listVoices(client);
  } else {
    await synthesize(client, options);
  }
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
