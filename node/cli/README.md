# CLI Tool

A command-line text-to-speech tool using the ResponsiveVoice API client.

> [!TIP]
> **Get your API key and secret** from your website settings at [app.responsivevoice.org](https://app.responsivevoice.org) ([sign up](https://responsivevoice.org/register)) — both are required to run this example.

## Setup

```bash
cd apps/examples
npm install
```

## Usage

```bash
# Get your API key + secret from your website settings at https://app.responsivevoice.org, then:
export RESPONSIVEVOICE_API_KEY="your-api-key"
export RESPONSIVEVOICE_API_SECRET="your-api-secret"

# Basic usage (everything after `--` is passed to the script)
npm run cli -- "Hello, world!"

# Specify a voice
npm run cli -- --voice "US English Male" "Hello!"

# Save to file
npm run cli -- --output greeting.mp3 "Hello!"

# Adjust speech parameters
npm run cli -- --rate 1.2 --pitch 0.9 "Speaking faster, lower pitch"

# List available voices
npm run cli -- --list-voices
```

## Options

| Option              | Short | Description                               |
| ------------------- | ----- | ----------------------------------------- |
| `--voice <name>`    | `-v`  | Voice name (default: "UK English Female") |
| `--output <file>`   | `-o`  | Save audio to file                        |
| `--rate <number>`   | `-r`  | Speech rate 0.5-2 (default: 1)            |
| `--pitch <number>`  | `-p`  | Speech pitch 0.5-2 (default: 1)           |
| `--volume <number>` |       | Volume 0-1 (default: 1)                   |
| `--list-voices`     | `-l`  | List available voices                     |
| `--help`            | `-h`  | Show help                                 |

## Environment Variables

| Variable                     | Description                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `RESPONSIVEVOICE_API_KEY`    | Your ResponsiveVoice API key — required for synthesis. Get it from your website settings at <https://app.responsivevoice.org> |
| `RESPONSIVEVOICE_API_SECRET` | Your ResponsiveVoice API secret — required for synthesis. Created under "Server-to-server API secrets" (shown once)           |
| `RESPONSIVEVOICE_API_URL`    | Custom API URL (optional)                                                                                                     |

## Code Highlights

```typescript
import { ResponsiveVoiceAPIClient } from '@responsivevoice/api-client';

const client = new ResponsiveVoiceAPIClient({
  apiKey: process.env.RESPONSIVEVOICE_API_KEY,
  apiSecret: process.env.RESPONSIVEVOICE_API_SECRET,
});

// List voices
const voices = await client.getVoices();

// Synthesize speech
const result = await client.synthesize({
  text: 'Hello, world!',
  voice: 'UK English Female',
  rate: 1,
  pitch: 1,
});

// Save to file
const buffer = Buffer.from(await result.blob.arrayBuffer());
fs.writeFileSync('output.mp3', buffer);
```
