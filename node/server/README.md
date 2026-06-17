# HTTP Server

A simple HTTP server providing text-to-speech synthesis via REST API.

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

# Start the server
npm run server

# Server runs on http://localhost:3001
```

## Endpoints

| Method | Endpoint               | Description                                        |
| ------ | ---------------------- | -------------------------------------------------- |
| GET    | `/`                    | API documentation                                  |
| GET    | `/voices`              | List all available voices                          |
| GET    | `/voices/:lang`        | List voices for a language (e.g., `/voices/en-US`) |
| POST   | `/synthesize`          | Synthesize text (JSON body)                        |
| GET    | `/synthesize?text=...` | Synthesize text (query params)                     |

## Examples

### List Voices

```bash
curl http://localhost:3001/voices
```

### Synthesize Speech (POST)

```bash
curl -X POST http://localhost:3001/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, world!", "voice": "UK English Female"}' \
  --output hello.mp3
```

### Synthesize Speech (GET)

```bash
curl "http://localhost:3001/synthesize?text=Hello&voice=UK%20English%20Female" \
  --output hello.mp3
```

### Synthesize with Parameters

```bash
curl -X POST http://localhost:3001/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Speaking slower and higher pitched",
    "voice": "US English Male",
    "rate": 0.8,
    "pitch": 1.3,
    "volume": 0.9
  }' \
  --output output.mp3
```

## Environment Variables

| Variable                     | Description                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `RESPONSIVEVOICE_API_KEY`    | Your ResponsiveVoice API key — required. Get it from your website settings at https://app.responsivevoice.org |
| `RESPONSIVEVOICE_API_SECRET` | Your ResponsiveVoice API secret — required. Created under "Server-to-server API secrets" (shown once)         |
| `RESPONSIVEVOICE_API_URL`    | Custom API URL (optional)                                                                                     |
| `PORT`                       | Server port (default: 3001)                                                                                   |

## Code Highlights

```typescript
import { createServer } from 'node:http';
import { ResponsiveVoiceAPIClient } from '@responsivevoice/api-client';

const client = new ResponsiveVoiceAPIClient({
  apiKey: process.env.RESPONSIVEVOICE_API_KEY,
  apiSecret: process.env.RESPONSIVEVOICE_API_SECRET,
});

const server = createServer(async (req, res) => {
  if (req.url === '/synthesize' && req.method === 'POST') {
    const body = await parseJsonBody(req);

    const result = await client.synthesize({
      text: body.text,
      voice: body.voice || 'UK English Female',
      rate: body.rate ?? 1,
      pitch: body.pitch ?? 1,
    });

    const buffer = Buffer.from(await result.blob.arrayBuffer());
    res.writeHead(200, { 'Content-Type': `audio/${result.format}` });
    res.end(buffer);
  }
});

server.listen(3001);
```

## Integration Tips

- Add authentication middleware for production use
- Implement rate limiting to prevent abuse
- Cache synthesized audio for repeated requests
- Add request logging and monitoring
