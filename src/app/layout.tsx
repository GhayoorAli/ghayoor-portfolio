import type { Metadata } from 'next'
import { Archivo, DM_Sans, Geist_Mono } from 'next/font/google'
import 'lenis/dist/lenis.css'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'block',
  preload: true,
  adjustFontFallback: true,
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Muhammad Ghayoor Ali — Full Stack Developer',
  description:
    'Portfolio of Muhammad Ghayoor Ali — full stack developer working with Laravel, PHP, MySQL, and modern JavaScript.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${dmSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
