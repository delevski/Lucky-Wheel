
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playTick = (): void => {
  try {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime); // A6 note
    gain.gain.setValueAtTime(0.3, context.currentTime);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.05);
    oscillator.stop(context.currentTime + 0.05);
  } catch (error) {
    console.error("Could not play tick sound:", error);
  }
};
