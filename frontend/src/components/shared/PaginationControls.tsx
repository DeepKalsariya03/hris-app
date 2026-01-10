import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalData?: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  totalData,
}: PaginationControlsProps) {
  if (totalPages <= 1 && !totalData) return null;

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <div className="text-sm text-slate-500">
        {totalData !== undefined ? (
          <span>
            Total <strong>{totalData}</strong> records.{" "}
          </span>
        ) : null}
        Page <span className="font-medium text-slate-900">{currentPage}</span>{" "}
        of <span className="font-medium text-slate-900">{totalPages}</span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
        >
          {isLoading && currentPage >= totalPages ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
