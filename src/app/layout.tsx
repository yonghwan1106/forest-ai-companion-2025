import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '숲심(森心) - 융합형 산림복지 AI 동반자',
  description: 'AI 기반 개인 맞춤형 산림치료 서비스를 제공하는 웹 애플리케이션',
  keywords: ['산림치료', '스트레스 해소', 'AI', '웰니스', '명상', '산림복지'],
  authors: [{ name: '한국산림복지진흥원' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#22c55e',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gradient-to-br from-forest-50 via-white to-forest-100 min-h-screen`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}