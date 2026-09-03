/// <reference types="vite/client" />

interface TelegramWebAppUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  initData: string
  initDataUnsafe: { user?: TelegramWebAppUser }
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
  }
  colorScheme?: 'light' | 'dark'
  viewportStableHeight?: number
}

interface Window {
  Telegram?: { WebApp?: TelegramWebApp }
}
