/**
 * Gentle break-alert chime synthesized with the Web Audio API.
 * No audio asset needed — CSP-safe and works fully offline.
 */
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    return ctx;
  } catch {
    return null;
  }
}

/** Play a soft two-note chime (e.g. when a break is due). */
export function playChime(): void {
  const audio = getCtx();
  if (!audio) return;
  // Some browsers start the context suspended until a user gesture.
  if (audio.state === 'suspended') void audio.resume();

  const now = audio.currentTime;
  const notes = [
    { freq: 660, start: 0 }, // E5
    { freq: 880, start: 0.18 }, // A5
  ];

  for (const note of notes) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'sine';
    osc.frequency.value = note.freq;

    const t0 = now + note.start;
    const dur = 0.35;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.18, t0 + 0.03); // gentle attack
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); // soft decay

    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
}
