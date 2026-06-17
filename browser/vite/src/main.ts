/**
 * ResponsiveVoice — npm + Vite Example
 *
 * Demonstrates consuming `@responsivevoice/core` from npm as an ESM module,
 * bundled for the browser by Vite. Compare against `browser/basic/index.html`
 * (which loads the same library from the CDN IIFE build) to see the delta.
 */

import '../../shared/demo-base.css';
import { getResponsiveVoice } from '@responsivevoice/core';

const rv = await getResponsiveVoice();

const textInput = document.getElementById('text') as HTMLTextAreaElement;
const speakBtn = document.getElementById('speakBtn') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement;
const status = document.getElementById('status') as HTMLDivElement;
const demoBadge = document.getElementById('demoBadge') as HTMLSpanElement;

rv.addEventListener('OnReady', () => {
  status.textContent = 'Ready! Click "Speak" to hear the text.';
  speakBtn.disabled = false;
  if (rv.isDemoMode()) demoBadge.hidden = false;
});

rv.addEventListener('OnStart', () => {
  status.textContent = 'Speaking...';
  speakBtn.disabled = true;
  cancelBtn.disabled = false;
});

rv.addEventListener('OnEnd', () => {
  status.textContent = 'Finished speaking.';
  speakBtn.disabled = false;
  cancelBtn.disabled = true;
});

rv.addEventListener('OnError', (payload) => {
  const err = (payload as { error?: Error } | undefined)?.error;
  status.textContent = `Error: ${err?.message ?? 'Unknown error'}`;
  speakBtn.disabled = false;
  cancelBtn.disabled = true;
});

rv.init({
  // Paste your API key from https://responsivevoice.org/register below:
  // apiKey: 'YOUR_RESPONSIVEVOICE_API_KEY',
}).catch((err: Error) => {
  status.textContent = `Failed to initialize: ${err.message}`;
});

speakBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (text) rv.speak(text);
});

cancelBtn.addEventListener('click', () => {
  rv.cancel();
  status.textContent = 'Cancelled.';
  speakBtn.disabled = false;
  cancelBtn.disabled = true;
});
