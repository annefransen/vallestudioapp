"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from 'sonner';

export default function PaymentPage() {
  const router = useRouter();
  const { guestInfo, selectedServices, selectedDate, selectedTime, getTotalPrice } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // GCash payment fields
  const [gcashNumber, setGcashNumber] = useState('');
  const [gcashName, setGcashName] = useState(
    guestInfo?.first_name && guestInfo?.last_name 
      ? `${guestInfo.first_name} ${guestInfo.last_name}` 
      : ''
  );

  useEffect(() => {
    if (!guestInfo || selectedServices.length === 0 || !selectedDate || !selectedTime) {
      router.replace("/book/services");
    }
  }, [guestInfo, selectedServices, selectedDate, selectedTime, router]);

  const handleConfirmPayment = () => {
    if (!gcashNumber || !gcashName) {
      toast.error('Please fill in all GCash payment details');
      return;
    }

    if (gcashNumber.length < 10) {
      toast.error('Please enter a valid GCash number');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing flow
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment successful! Your booking is confirmed.');
      router.push('/book/confirmation');
    }, 2000);
  };

  if (!guestInfo) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Payment</h2>
        <p className="text-gray-600">Complete your payment via GCash to confirm your booking</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Booking Summary */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Services</h3>
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm mb-1 text-muted-foreground">
                  <span>{service.name}</span>
                  <span className="font-medium text-foreground">₱{service.price}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-border/50">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{guestInfo.first_name} {guestInfo.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-right line-clamp-1 max-w-[150px]">{guestInfo.gmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{guestInfo.contact_number}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₱{getTotalPrice()}</span>
            </div>
          </CardContent>
        </Card>

        {/* GCash Payment Form */}
        <div className="space-y-6">
          <Card className="border-black">
            <CardHeader className="bg-gray-50 border-b pb-4">
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-black" />
                GCash Payment
              </CardTitle>
              <CardDescription>
                Pay securely using your GCash account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="gcashNumber">GCash Mobile Number</Label>
                <Input
                  id="gcashNumber"
                  placeholder="09XX XXX XXXX"
                  value={gcashNumber}
                  onChange={(e) => setGcashNumber(e.target.value)}
                  maxLength={11}
                  className="h-12 border-gray-300"
                />
                <p className="text-xs text-muted-foreground">Enter your registered GCash mobile number</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gcashName">Account Name</Label>
                <Input
                  id="gcashName"
                  placeholder="MARIA SANTOS"
                  value={gcashName}
                  onChange={(e) => setGcashName(e.target.value)}
                  className="h-12 border-gray-300 uppercase"
                />
                <p className="text-xs text-muted-foreground">Name registered to your GCash account</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div className="text-sm text-foreground">
                    <p className="font-semibold mb-1">Secure GCash Payment</p>
                    <p className="text-xs text-muted-foreground">You&apos;ll receive a GCash notification to authorize this payment. The amount will be deducted from your GCash wallet.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="w-full h-14 text-base" 
            onClick={handleConfirmPayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Smartphone className="w-5 h-5 mr-2" />
                Pay ₱{getTotalPrice()} via GCash
              </>
            )}
          </Button>

          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => router.push('/book/guest-info')}
            disabled={isProcessing}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Guest Info
          </Button>
        </div>
      </div>
    </div>
  );
}
