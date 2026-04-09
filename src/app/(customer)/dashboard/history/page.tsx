"use client";

import * as React from "react";
import { History as HistoryIcon, Receipt, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">History</h1>
          <p className="text-muted-foreground">Review your past appointments and receipts.</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { id: "VAL-001", service: "Hair Cut & Style", date: "Oct 12, 2023", amount: "₱850", status: "Completed" },
          { id: "VAL-002", service: "Classic Manicure", date: "Sep 28, 2023", amount: "₱450", status: "Completed" },
          { id: "VAL-003", service: "Brow Shaping", date: "Sep 15, 2023", amount: "₱350", status: "Cancelled" },
        ].map((item) => (
          <Card key={item.id} className="border-muted/50 hover:bg-muted/5 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <HistoryIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.service}</p>
                  <p className="text-xs text-muted-foreground">{item.date} • {item.id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-sm text-[#494136]">{item.amount}</p>
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                    {item.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-[#494136]">
                  <Receipt className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
