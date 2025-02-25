import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Photo Enhancer - Улучшение качества фотографий',
  description: 'Простой инструмент для повышения качества фотографий с использованием Pixlr API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>
      </body>
    </html>
  )
}