import Header from '../../components/header'
import '../../styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="global-container">
          {children}
        </div>
      </body>
    </html>
  )
}
