"use client";

import * as React from "react";
import { User, Mail, Shield, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and personal information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2 border-muted/50">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your name and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" disabled />
              <p className="text-[10px] text-muted-foreground">Email cannot be changed directly.</p>
            </div>
            <Button className="bg-[#494136] hover:bg-black text-white">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Security / Sidebar Card */}
        <div className="space-y-6">
          <Card className="border-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#494136]" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-xs rounded-lg">Change Password</Button>
              <Button variant="outline" className="w-full justify-start text-xs rounded-lg">Two-Factor Auth</Button>
            </CardContent>
          </Card>

          <Card className="border-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#494136]" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>Email notifications are currently enabled.</p>
              <Button variant="link" className="p-0 h-auto text-[#494136]">Manage Preferences</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
