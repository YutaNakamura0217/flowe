"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const filters = {
  flowerTypes: ["バラ", "チューリップ", "ひまわり", "ユリ", "サクラ"],
  colors: ["赤", "青", "黄", "ピンク", "白"],
  seasons: ["春", "夏", "秋", "冬"],
  locations: ["東京", "大阪", "京都", "北海道", "沖縄"],
}

interface SearchFiltersProps {
  onApplyFilters: (filters: Record<string, string[]>) => void
}

export function SearchFilters({ onApplyFilters }: SearchFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    flowerTypes: [],
    colors: [],
    seasons: [],
    locations: [],
  })

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const updatedCategory = prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value]
      return { ...prev, [category]: updatedCategory }
    })
  }

  const handleApplyFilters = () => {
    onApplyFilters(selectedFilters)
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {Object.entries(filters).map(([category, options]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${category}-${option}`}
                      checked={selectedFilters[category].includes(option)}
                      onCheckedChange={() => handleFilterChange(category, option)}
                    />
                    <label
                      htmlFor={`${category}-${option}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button onClick={handleApplyFilters} className="w-full">
        フィルターを適用
      </Button>
    </div>
  )
}

