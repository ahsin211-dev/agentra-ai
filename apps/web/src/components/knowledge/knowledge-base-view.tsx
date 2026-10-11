"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Upload,
  FileText,
  Globe,
  MessageSquare,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const mockDocs = [
  {
    id: "1",
    name: "Dental Treatment Guide 2024",
    type: "document",
    agent: "Dr. Smile Receptionist",
    size: "2.4 MB",
    status: "completed",
    createdAt: "Jan 15, 2024",
  },
  {
    id: "2",
    name: "Pizza Menu & Pricing",
    type: "custom",
    agent: "PizzaBot Pro",
    size: "45 KB",
    status: "completed",
    createdAt: "Jan 20, 2024",
  },
  {
    id: "3",
    name: "https://example.com/faq",
    type: "url",
    agent: "SupportAI",
    size: "—",
    status: "processing",
    createdAt: "Feb 1, 2024",
  },
  {
    id: "4",
    name: "Customer FAQ Database",
    type: "faq",
    agent: "SupportAI",
    size: "120 KB",
    status: "pending",
    createdAt: "Feb 5, 2024",
  },
];

const typeIcons = {
  document: FileText,
  url: Globe,
  faq: MessageSquare,
  custom: BookOpen,
};

const statusConfig = {
  completed: { label: "Indexed", icon: CheckCircle, color: "text-emerald-500" },
  processing: { label: "Processing", icon: Clock, color: "text-amber-500" },
  pending: { label: "Pending", icon: Clock, color: "text-gray-400" },
  failed: { label: "Failed", icon: AlertCircle, color: "text-red-500" },
};

export function KnowledgeBaseView() {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <Card
        className={`border-2 border-dashed transition-all cursor-pointer ${
          dragging
            ? "border-violet-400 bg-violet-50 dark:bg-violet-900/10"
            : "border-border/60 hover:border-violet-300 hover:bg-muted/20"
        }`}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Upload className="w-8 h-8 text-violet-500" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-1">Upload Training Data</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Drop files here or click to upload. Supports PDF, DOCX, TXT, CSV, or paste a URL.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="gradient" size="sm">
              <Upload className="w-3.5 h-3.5" />
              Choose Files
            </Button>
            <Button variant="outline" size="sm">
              <Globe className="w-3.5 h-3.5" />
              Add URL
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-3.5 h-3.5" />
              Add FAQ
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Max file size: 50MB • Formats: PDF, DOCX, TXT, CSV, JSON
          </p>
        </CardContent>
      </Card>

      {/* Documents list */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-500" />
              Knowledge Documents
            </CardTitle>
            <span className="text-sm text-muted-foreground">{mockDocs.length} documents</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {mockDocs.map((doc) => {
              const TypeIcon = typeIcons[doc.type as keyof typeof typeIcons];
              const status = statusConfig[doc.status as keyof typeof statusConfig];
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center flex-shrink-0">
                    <TypeIcon className="w-5 h-5 text-violet-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">
                      {doc.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {doc.agent} • {doc.size} • {doc.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 text-xs ${status.color}`}>
                      <status.icon className="w-3.5 h-3.5" />
                      {status.label}
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {doc.type}
                    </Badge>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
