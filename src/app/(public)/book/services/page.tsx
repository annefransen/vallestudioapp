"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useBooking, SERVICES, PROMOS } from '@/contexts/BookingContext';
import { toast } from 'sonner';

export default function ServiceSelectionPage() {
  const router = useRouter();
  const { selectedServices, addService, removeService, getTotalPrice, getTotalDuration } = useBooking();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'service' | 'promo'>('all');

  const ALL_ITEMS = [...SERVICES, ...PROMOS];
  const filteredServices = selectedCategory === 'all' 
    ? ALL_ITEMS 
    : ALL_ITEMS.filter(s => s.type === selectedCategory);

  const handleNext = () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }
    router.push('/book/datetime');
  };

  return (
    <div className="max-w-6xl mx-auto mb-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-foreground tracking-tight">Select Your Services</h2>
        <p className="text-gray-600">Choose one or more services for your appointment</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          All Items
        </Button>
        <Button
          variant={selectedCategory === 'service' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('service')}
        >
          Services
        </Button>
        <Button
          variant={selectedCategory === 'promo' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('promo')}
        >
          Promos
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredServices.map((service) => {
          const isSelected = selectedServices.some(s => s.id === service.id);
          return (
            <Card 
              key={service.id} 
              className={`cursor-pointer transition-all ${
                isSelected ? 'border-black bg-gray-50' : 'hover:border-gray-400'
              }`}
              onClick={() => {
                if (isSelected) {
                  removeService(service.id);
                } else {
                  addService(service);
                }
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <CardTitle className="text-lg leading-tight">{service.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {service.description}
                    </CardDescription>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 shrink-0 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg text-foreground">₱{service.price}</p>
                    <p className="text-sm text-gray-500">{service.duration} minutes</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {service.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <Card className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[500px] shadow-2xl z-50 animate-in slide-in-from-bottom-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="w-full">
                <h3 className="font-semibold mb-2">Selected Services ({selectedServices.length})</h3>
                <div className="flex gap-2 flex-wrap mb-3 max-h-[80px] overflow-y-auto w-full">
                  {selectedServices.map((service) => (
                    <Badge key={service.id} variant="secondary" className="gap-1 flex items-center">
                      <span className="truncate max-w-[120px]">{service.name}</span>
                      <button
                        onClick={() => removeService(service.id)}
                        className="ml-1 hover:bg-gray-300 rounded-full flex items-center justify-center h-4 w-4 shrink-0 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4 text-sm font-medium text-foreground">
                  <p>Total: ₱{getTotalPrice()}</p>
                  <p className="text-gray-500">{getTotalDuration()} mins</p>
                </div>
              </div>
              <Button size="lg" onClick={handleNext} className="w-full sm:w-auto shrink-0">
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
