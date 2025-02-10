"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface FlowerPhotoCarouselProps {
  photos: string[]
  flowerName: string
}

export function FlowerPhotoCarousel({ photos, flowerName }: FlowerPhotoCarouselProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      className="w-full aspect-square rounded-lg overflow-hidden"
    >
      {photos.map((photo, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-full">
            <Image
              src={photo || "/placeholder.svg"}
              alt={`${flowerName}の写真 ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

