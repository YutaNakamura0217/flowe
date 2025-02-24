import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
}

export function PaginationControls({ totalPages, currentPage }: PaginationControlsProps) {
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Adjust as needed

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + 4);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push(-1); // -1 represents an ellipsis
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push(-1); // -1 represents an ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage === 1 ? (
            <PaginationPrevious href="#" />
          ) : (
            <Link href={`/communities?page=${currentPage - 1}`}>
              <PaginationPrevious href={`/communities?page=${currentPage - 1}`} />
            </Link>
          )}
        </PaginationItem>
        {pageNumbers.map((pageNumber, index) => (
          pageNumber === -1 ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink href={`/communities?page=${pageNumber}`} isActive={pageNumber === currentPage}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        ))}
        <PaginationItem>
          {currentPage === totalPages ? (
            <PaginationNext href="#" />
          ) : (
            <Link href={`/communities?page=${currentPage + 1}`}>
              <PaginationNext href={`/communities?page=${currentPage + 1}`} />
            </Link>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
