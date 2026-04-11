"use client";

import * as React from "react";
import { Sparkles, ShoppingBag, Loader2, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ServicesPage() {
  const [services, setServices] = React.useState<any[]>([]);
  const [promos, setPromos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const supabase = createClient();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, promosRes] = await Promise.all([
          supabase
            .from("services")
            .select("*")
            .eq("status", "available")
            .order("service_name", { ascending: true }),
          supabase
            .from("promos")
            .select("*")
            .eq("status", "active")
            .order("promo_name", { ascending: true }),
        ]);

        if (servicesRes.error) throw servicesRes.error;
        if (promosRes.error) throw promosRes.error;

        setServices(servicesRes.data || []);
        setPromos(promosRes.data || []);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  const addToBasket = (item: any) => {
    const savedBasket = localStorage.getItem("salon_basket");
    let basket = [];
    if (savedBasket) {
      try {
        basket = JSON.parse(savedBasket);
      } catch (e) {
        basket = [];
      }
    }
    
    // Add item with a unique ID (timestamp) to allow duplicates if needed, or check for existence
    const newItem = {
      id: item.service_id || item.promo_id,
      name: item.service_name || item.promo_name,
      price: item.price,
      type: item.service_id ? 'service' : 'promo',
      addedAt: new Date().toISOString()
    };
    
    basket.push(newItem);
    localStorage.setItem("salon_basket", JSON.stringify(basket));
    toast.success(`${newItem.name} added to basket!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#494136]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl border border-red-100">
        <p>Failed to load data: {error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Services & Offers
          </h1>
          <p className="text-muted-foreground">
            Discover our premium services and exclusive promotions.
          </p>
        </div>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="mb-4 w-min bg-amber-950">
          <TabsTrigger value="services" className="px-6">
            Services
          </TabsTrigger>
          <TabsTrigger value="promos" className="px-6 flex items-center gap-2">
            Promotions
            {promos.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#494136] text-[#fafafa] text-[10px] font-bold">
                {promos.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          {services.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-xl">
              <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No services available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service.service_id}
                  className="group hover:shadow-lg transition-all duration-300 border-muted/50 overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">
                      {service.service_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                      {service.description || "No description available."}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                          Starting at
                        </span>
                        <span className="font-bold text-[#494136]">
                          ₱{service.price?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-[#494136]/20 hover:bg-[#494136] hover:text-white cursor-pointer"
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full gradient-brand border-0 text-white cursor-pointer"
                          onClick={() => addToBasket(service)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="promos">
          {promos.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-xl">
              <Tag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No active promotions at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map((promo) => (
                <Card
                  key={promo.promo_id}
                  className="group hover:shadow-lg transition-all duration-300 border-amber-200/50 bg-amber-50/10 overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">
                      {promo.promo_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                      {promo.description || "Limited time offer."}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-amber-600 font-bold">
                          Promo Price
                        </span>
                        <span className="font-bold text-[#494136]">
                          ₱{promo.price?.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full bg-amber-600 hover:bg-amber-700 text-white border-0 cursor-pointer"
                        onClick={() => addToBasket(promo)}
                      >
                        Add to Basket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
