import './globals.css'

export const metadata = {
  title: 'Наша История ❤️',
  description: 'Приложение для влюблённых пар',
  manifest: '/manifest.json',
  themeColor: '#FF6B9D',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Наша История'
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Наша История" />
      </head>
      <body className="bg-gradient-to-b from-pink-50 to-pink-100">
        {children}
      </body>
    </html>
  )
}
