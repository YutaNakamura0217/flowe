"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewPostModal } from "@/components/new-post-modal";

interface FloatingActionButtonProps {
  onPostCreated?: () => void;
}

export function FloatingActionButton({ onPostCreated }: FloatingActionButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-10 right-10 rounded-full h-14 w-14"
        onClick={() => setModalOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
      <NewPostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onPostCreated={onPostCreated} 
      />
    </>
  );
}
