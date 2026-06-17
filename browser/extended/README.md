# Extended Usage Example

A full-featured demo showcasing all ResponsiveVoice capabilities including platform detection, voice selection, speech controls, and event logging.

> [!TIP]
> **Get a free API key** at [responsivevoice.org/register](https://responsivevoice.org/register) — required to access all available voices, standard and premium.

## Usage

Open `index.html` in your browser, or serve it:

```bash
npx serve .
```

## Features Demonstrated

- **Platform Detection**: Browser, OS, and device type detection
- **Voice Selection**: Full voice browser with language filtering
- **TTS Controls**: Speak, pause, resume, and cancel
- **Speech Parameters**: Rate, pitch, and volume sliders
- **Configuration**: API key input, voice reporting toggle, force fallback mode
- **Demo Mode Indicator**: Amber "Demo Mode" pill that surfaces when no API key is active (driven by `rv.isDemoMode()`)
- **Event Logging**: Real-time event log for debugging
- **Browser Voices**: Shows native Web Speech API voices

## Configuration Options

| Option         | Description                                     |
| -------------- | ----------------------------------------------- |
| API Key        | Optional - enables full functionality           |
| Force Fallback | Always use HTTP audio instead of Web Speech API |

## Code Highlights

```javascript
// The CDN IIFE script auto-creates the singleton on window.responsiveVoice.
// (For ESM / bundled apps, use getResponsiveVoice() from @responsivevoice/core —
//  see the browser/vite/ example.)
const rv = window.responsiveVoice;

// Attach event listeners before init
rv.addEventListener('OnReady', () => console.log('Ready!'));
rv.addEventListener('OnStart', () => console.log('Speaking...'));
rv.addEventListener('OnEnd', () => console.log('Done!'));

// Initialize with options
// (get a free API key at https://responsivevoice.org/register)
await rv.init({
  apiKey: 'your-api-key',
  forceFallback: false,
  transport: 'chunks',
});

// Check whether the current init is running in demo mode (no key)
if (rv.isDemoMode()) {
  // ...surface an indicator in your UI
}

// Speak and control
rv.speak('Hello, world!', 'UK English Female', { rate: 1, pitch: 1 });
rv.pause();
rv.resume();
rv.cancel();
```
