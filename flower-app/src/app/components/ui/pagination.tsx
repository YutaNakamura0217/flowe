"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface PaginationProps {
  children: React.ReactNode
}

export const Pagination = ({ children }: PaginationProps) => {
  return <nav className="flex justify-center">{children}</nav>
}

export const PaginationContent = ({ children }: PaginationProps) => {
  return <ul className="inline-flex -space-x-px">{children}</ul>
}

interface PaginationItemProps {
  children: React.ReactNode
}

export const PaginationItem = ({ children }: PaginationItemProps) => {
  return <li>{children}</li>
}

interface PaginationLinkProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
  isDisabled?: boolean
}

export const PaginationLink = ({ href, children, isActive = false, isDisabled = false }: PaginationLinkProps) => {
  const className = `relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
    isActive ? "bg-primary text-white" : "bg-white text-muted-foreground"
  } ${isDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-muted"}`

  if (isDisabled) {
    return <span className={className}>{children}</span>
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export const PaginationEllipsis = () => (
  <span className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium">...</span>
)

export const PaginationPrevious = ({ href }: { href: string }) => (
  <PaginationLink href={href}>
    <ChevronLeft className="h-4 w-4 mr-2" />
    <span>前へ</span>
  </PaginationLink>
)

export const PaginationNext = ({ href }: { href: string }) => (
  <PaginationLink href={href}>
    <span>次へ</span>
    <ChevronRight className="h-4 w-4 ml-2" />
  </PaginationLink>
)

