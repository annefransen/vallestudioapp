import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

// Initialize Resend globally so we don't recreate the instance
const globalForResend = globalThis as unknown as {
  resend: Resend | undefined
}

export const resend = globalForResend.resend || (apiKey ? new Resend(apiKey) : null)

if (process.env.NODE_ENV !== 'production' && resend) {
  globalForResend.resend = resend
}
