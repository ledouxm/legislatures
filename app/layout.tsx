import type { Metadata } from 'next'
 
// These styles apply to every route in the application
import './globals.css'
import { VisibleCurrentsProvider } from '../components/utils/currentsContext'
import { DetailsProvider } from '../components/utils/detailsContext'
import { TransitionsProvider } from '../components/utils/transitionsContext'
 
export const metadata: Metadata = {
  title: 'Chronoskratos',
  description: 'Historique des compositions de l\'assemblée nationale des Républiques Françaises',
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
        <body className='overscroll-none'>
            <VisibleCurrentsProvider>
              <DetailsProvider>
                <TransitionsProvider>
                  {children}
                </TransitionsProvider>
              </DetailsProvider>
            </VisibleCurrentsProvider>
        </body>
    </html>
  )
}