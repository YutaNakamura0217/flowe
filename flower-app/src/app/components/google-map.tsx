"use client"

import { useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface GoogleMapProps {
  address: string
}

export function GoogleMap({ address }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
    })

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 35.6812, lng: 139.7671 }, // Tokyo coordinates as default
          zoom: 14,
        })

        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            map.setCenter(results[0].geometry.location)
            new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
            })
          }
        })
      }
    })
  }, [address])

  return <div ref={mapRef} className="w-full h-96 rounded-lg overflow-hidden" />
}

