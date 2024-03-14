import './globals.css'

export const metadata = {
  title: 'Anthony Zhou',
  description: 'Anthony Zhou Portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
