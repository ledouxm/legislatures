import type { Metadata } from 'next'
 
// These styles apply to every route in the application
import './globals.css'
 
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
        <body>
            {children}
        </body>
    </html>
  )
}