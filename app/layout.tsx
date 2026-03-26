import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Бюджет - Планировщик финансов',
  description: 'Простой и удобный планировщик бюджета с аналитикой, отчетами и финансовыми рекомендациями. Управляйте своими финансами эффективно.',
  keywords: 'бюджет, планировщик, финансы, аналитика, расходы, доходы, экономия',
  authors: [{ name: 'Budget Planner' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
  openGraph: {
    title: 'Бюджет - Планировщик финансов',
    description: 'Управляйте своими финансами эффективно',
    type: 'website',
    locale: 'ru_RU',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
