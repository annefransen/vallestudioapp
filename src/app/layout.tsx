import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Valle Studio Salon | Book Your Appointment",
    template: "%s | Valle Studio Salon",
  },
  description:
    "Book professional hair, nails, and brow services at Valle Studio Salon. Easy online reservations with secure GCash payment.",
  keywords: ["salon", "hair", "nails", "brows", "booking", "Valle Studio"],
  openGraph: {
    title: "Valle Studio Salon",
    description: "Book your next salon appointment online with ease.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
