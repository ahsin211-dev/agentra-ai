export const dynamic = "force-dynamic";

import { DashboardHeader } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Bell, Globe, Shield, CreditCard } from "lucide-react";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Settings"
        description="Manage your account and workspace settings"
      />
      <div className="flex-1 p-6 max-w-3xl">
        <div className="space-y-6">
          {/* API Keys */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-violet-500" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="sk-..."
                    className="font-mono"
                  />
                  <Button variant="outline">Save</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Required for AI chat and voice features.{" "}
                  <a href="https://platform.openai.com/api-keys" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Get your API key →
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <Label>ElevenLabs API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="eleven_..."
                    className="font-mono"
                  />
                  <Button variant="outline">Save</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Optional. Required for ElevenLabs voice synthesis.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-500" />
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input placeholder="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label>Organization Slug</Label>
                <Input placeholder="acme-corp" className="font-mono" />
              </div>
              <Button variant="gradient" size="sm">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Billing */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-violet-500" />
                Billing & Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/30">
                <div>
                  <div className="font-medium text-foreground">Free Plan</div>
                  <div className="text-sm text-muted-foreground">1 agent · 100 conversations/month</div>
                </div>
                <Button variant="gradient" size="sm">Upgrade to Pro</Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
