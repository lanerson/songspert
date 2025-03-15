'use client'
import { useState } from 'react'
import Header from '../../components/header'
import Profile from '../../components/profile'
import '../../styles/globals.css'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [visible, setVisible] = useState(false);

  const toggleVisible = () => setVisible(!visible);

  return (
    <html lang="en">
      <body>
        <Header toggleVisible={toggleVisible} />
        <Profile visible={visible} />
        {children}</body>
    </html>
  )
}
