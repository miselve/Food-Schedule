import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Πρόγραμμα Λέσχης',
  description: 'Πρόγραμμα φαγητού φοιτητικής λέσχης ΔΗΜΟΚΡΙΤΕΙΟΥ ΠΑΝΕΠΙΣΤΗΜΙΟΥ ΘΡΑΚΗΣ (ΔΠΘ) (DUTH)',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
