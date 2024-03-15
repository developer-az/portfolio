import './globals.css'



export const metadata = {
  title: 'Anthony Zhou',
  description: 'Anthony Zhou Portfolio',
  icons: {
    icon: ['favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: [
      '/apple-touch-icon.png'
    ]
  },
  manifest: '/site.webmanifest'
}

export default function RootLayout({ children }) {
  return (
    
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
