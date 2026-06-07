import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Evolution Capturer - Live Games',
  description: 'Bac Bo, Football Studio, Baccarat - Live Stats & Video',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://static.egcdn.com" />
        <link rel="preconnect" href="https://sortenabet.evo-games.com" />
        <link rel="preconnect" href="https://sapa-mdp-e06.egcvi.com" />
      </head>
      <body className={inter.className}>
        <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-500">🎰 Evolution</span>
                <span className="text-yellow-500 ml-1">CAPTURER</span>
              </div>
              <div id="userStatus" className="text-gray-400 text-sm">⚡ AO VIVO</div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
