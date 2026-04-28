// Browser-native STT (webkitSpeechRecognition) + TTS (SpeechSynthesis)
// Works on Chromium-based browsers and Safari.

type SpeechRecognition = any;

export interface STT {
  start: () => void;
  stop: () => void;
  supported: boolean;
}

export function createSTT(
  onInterim: (text: string) => void,
  onFinal: (text: string) => void,
): STT {
  const w = typeof window !== "undefined" ? (window as any) : null;
  const Rec = w?.SpeechRecognition || w?.webkitSpeechRecognition;
  if (!Rec) return { start: () => {}, stop: () => {}, supported: false };

  const rec: SpeechRecognition = new Rec();
  rec.lang = "en-US";
  rec.interimResults = true;
  rec.continuous = true;

  let active = false;
  let buffer = "";

  rec.onresult = (e: any) => {
    let interim = "";
    let finalText = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const txt = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalText += txt;
      else interim += txt;
    }
    if (finalText) {
      buffer += finalText;
      onInterim(buffer + interim);
    } else {
      onInterim(buffer + interim);
    }
  };

  rec.onerror = () => {};
  rec.onend = () => {
    if (active) {
      // some browsers cut off; restart unless user stopped
      try { rec.start(); } catch {}
    } else {
      onFinal(buffer.trim());
      buffer = "";
    }
  };

  return {
    supported: true,
    start: () => {
      active = true;
      buffer = "";
      try { rec.start(); } catch {}
    },
    stop: () => {
      active = false;
      try { rec.stop(); } catch {}
    },
  };
}

export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.95;
  u.pitch = 1;
  // Prefer a natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => /en-(US|GB)/i.test(v.lang) && /google|samantha|natural/i.test(v.name))
    || voices.find(v => /en-(US|GB)/i.test(v.lang));
  if (preferred) u.voice = preferred;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
