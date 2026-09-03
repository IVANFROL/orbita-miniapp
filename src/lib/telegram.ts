export function initTelegram() {
  const tg = window.Telegram?.WebApp
  if (!tg) return { inTelegram: false as const }

  tg.ready()
  tg.expand()
  try {
    tg.setHeaderColor('#EDE0CC')
    tg.setBackgroundColor('#EDE0CC')
  } catch {
    /* demo browser */
  }

  return {
    inTelegram: true as const,
    user: tg.initDataUnsafe?.user,
  }
}

export function haptic(kind: 'light' | 'medium' | 'success' | 'error' = 'light') {
  const h = window.Telegram?.WebApp?.HapticFeedback
  if (!h) return
  if (kind === 'success' || kind === 'error') h.notificationOccurred(kind)
  else h.impactOccurred(kind)
}
