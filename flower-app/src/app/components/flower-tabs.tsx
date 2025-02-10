"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type React from "react" // Added import for React

const tabItems = [
  { value: "aiueo", label: "あ行〜わ行" },
  { value: "family", label: "科名" },
  { value: "origin", label: "原産地" },
]

interface FlowerTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  children: React.ReactNode
}

export function FlowerTabs({ activeTab, onTabChange, children }: FlowerTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {tabItems.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabItems.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {children}
        </TabsContent>
      ))}
    </Tabs>
  )
}

