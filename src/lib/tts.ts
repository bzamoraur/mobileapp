/**
 * Text-to-speech for the phrasebook using the Web Speech API. Works offline on
 * devices with a matching voice installed; degrades gracefully otherwise.
 */

export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }
    const handler = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler, { once: true });
    // Safety timeout in case the event never fires.
    setTimeout(() => resolve(cachedVoices), 500);
  });
}

/**
 * Speaks `text` in `lang` (BCP-47, e.g. "ja-JP"). Cancels any in-flight speech
 * first so rapid taps don't queue up. Returns false if TTS is unavailable.
 */
export async function speak(text: string, lang: string): Promise<boolean> {
  if (!isTtsSupported()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();

  const voices = cachedVoices.length ? cachedVoices : await loadVoices();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  const match =
    voices.find((v) => v.lang === lang) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
  if (match) utter.voice = match;
  utter.rate = 0.95;
  synth.speak(utter);
  return true;
}

export function stopSpeaking(): void {
  if (isTtsSupported()) window.speechSynthesis.cancel();
}
