"use client"

import { useState } from "react"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface FlowerDetailsProps {
  name: string
  scientificName: string
  family: string
  origin: string
  description: string
  imageUrl: string
  userPhotos: string[]
}

export function FlowerDetails({
  name,
  scientificName,
  family,
  origin,
  description,
  imageUrl,
  userPhotos,
}: FlowerDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0">
          詳細を見る
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-square">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div>
              <p>
                <strong>学名:</strong> {scientificName}
              </p>
              <p>
                <strong>科名:</strong> {family}
              </p>
              <p>
                <strong>原産地:</strong> {origin}
              </p>
            </div>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="description">
              <AccordionTrigger>説明</AccordionTrigger>
              <AccordionContent>{description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="user-photos">
              <AccordionTrigger>ユーザー投稿写真</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-2">
                  {userPhotos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`${name}のユーザー投稿写真 ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  )
}

