"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingActionButton() {
  return (
    <Button
      className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-accent-pink shadow-lg"
      size="icon"
      aria-label="新規投稿"
      onClick={() => (window.location.href = "/posts/new")}
    >
      <Plus className="h-6 w-6" />
    </Button>
  )
}

