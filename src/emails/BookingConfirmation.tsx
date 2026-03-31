import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface BookingConfirmationProps {
  customerName: string
  bookingDate: string
  bookingTime: string
  serviceName: string
  stylistName: string
  bookingId: string
  address?: string
}

export const BookingConfirmationEmail = ({
  customerName,
  bookingDate,
  bookingTime,
  serviceName,
  stylistName,
  bookingId,
  address = '123 Valle Studio Ave, Manila, Philippines',
}: BookingConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Your Reservation at Valle Studio is Confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Valle Studio</Heading>
        </Section>
        <Section style={section}>
          <Text style={greeting}>Hi {customerName},</Text>
          <Text style={paragraph}>
            Thank you for booking with us! Your reservation is confirmed. We can't wait to pamper you.
          </Text>
          
          <Section style={detailsContainer}>
            <Heading as="h3" style={h3}>Booking Details</Heading>
            <Text style={detailItem}>
              <strong>Service:</strong> {serviceName}
            </Text>
            <Text style={detailItem}>
              <strong>Date:</strong> {bookingDate}
            </Text>
            <Text style={detailItem}>
              <strong>Time:</strong> {bookingTime}
            </Text>
            <Text style={detailItem}>
              <strong>Stylist:</strong> {stylistName}
            </Text>
            <Text style={detailItem}>
              <strong>Booking ID:</strong> #{bookingId.slice(0, 8).toUpperCase()}
            </Text>
          </Section>

          <Text style={paragraph}>
            <strong>Location:</strong><br />
            {address}
          </Text>

          <Hr style={hr} />
          
          <Text style={footer}>
            Need to reschedule? Please contact us at least 24 hours in advance at help@vallestudio.com or call (555) 123-4567.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default BookingConfirmationEmail

const main = {
  backgroundColor: '#fbfaf8',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
}

const header = {
  backgroundColor: '#1C1C1E',
  padding: '24px',
  textAlign: 'center' as const,
  borderRadius: '8px 8px 0 0',
}

const h1 = {
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0',
  fontFamily: 'serif',
}

const section = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '0 0 8px 8px',
  border: '1px solid #eaeaea',
}

const greeting = {
  fontSize: '18px',
  lineHeight: '28px',
  color: '#1C1C1E',
  fontWeight: '600',
}

const paragraph = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#4B5563',
}

const detailsContainer = {
  backgroundColor: '#fafafa',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
}

const h3 = {
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: '600',
  color: '#1C1C1E',
  margin: '0 0 16px 0',
}

const detailItem = {
  fontSize: '15px',
  lineHeight: '20px',
  color: '#4B5563',
  margin: '8px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '24px 0',
}

const footer = {
  color: '#8e8e93',
  fontSize: '13px',
  lineHeight: '22px',
  textAlign: 'center' as const,
}
