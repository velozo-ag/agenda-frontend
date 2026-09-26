// Safe, zero-crash confetti helper
export async function triggerConfetti(options = {}) {
  try {
    const confettiModule = await import('canvas-confetti');
    const confetti = confettiModule.default || confettiModule;
    confetti({
      particleCount: options.particleCount || 70,
      spread: options.spread || 60,
      origin: options.origin || { y: 0.6 },
      ...options
    });
  } catch (_) {
    // Graceful fallback if module isn't present
  }
}
