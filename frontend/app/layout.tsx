import type { Metadata, Viewport } from "next"
import { Orbitron, Rajdhani } from "next/font/google"
import "./globals.css"

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "SentinalPay | Cyberpunk Fintech Dashboard",
  description: "Next-generation financial security platform with AI-powered threat detection and secure transactions.",
  keywords: ["fintech", "security", "payments", "cyberpunk", "dashboard"],
}

export const viewport: Viewport = {
  themeColor: "#00f3ff",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} bg-background`}
    >
      <body className="min-h-screen font-sans antialiased cyber-grid data-stream">
        {children}
      </body>
    </html>
  )
}
