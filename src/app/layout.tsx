import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Toaster } from "@/components/ui/Sonner"
import "./globals.css"
import { BoneyardProvider } from "@/components/providers/BoneyardProvider"

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
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
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <BoneyardProvider>
          {children}
        </BoneyardProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
