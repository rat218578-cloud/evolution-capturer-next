import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Evolution Capturer - Multi Games',
  description: 'Bac Bo, Football Studio, Baccarat - Live Stats & Signals',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://static.egcdn.com" />
        <link rel="preconnect" href="https://sortenabet.evo-games.com" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          <nav className="bg-gray-900 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-green-500">🎰 Evolution</span>
                  <span className="text-yellow-500 ml-1">CAPTURER</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div id="balance" className="text-green-400 font-mono">💰 Demo</div>
                  <div id="userStatus" className="text-gray-400">⚫ Offline</div>
                </div>
              </div>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
