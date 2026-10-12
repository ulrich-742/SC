import { useMemo, useState } from "react";

export interface AdminFilterState {
  searchTerm: string;
  locationFilter: string;
  statusFilter: string;
  dateSortOrder: "asc" | "desc";
}

export function useAdminFilters<T extends Record<string, unknown>>(
  initialData: T[],
  searchFields: (keyof T)[] = [],
  defaultSortField?: keyof T,
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<keyof T>(() => {
    if (defaultSortField) return defaultSortField;
    return "create_time" as keyof T;
  });

  const filteredData = useMemo(() => {
    let result = [...initialData];

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          return (
            val !== undefined &&
            val !== null &&
            String(val).toLowerCase().includes(lower)
          );
        }),
      );
    }

    if (locationFilter) {
      result = result.filter((item) => {
        if ("location_type" in item && typeof item.location_type === "string") {
          return item.location_type === locationFilter;
        }

        const loc = item.location as string | undefined;
        const pc = item.postal_code as string | undefined;
        const val = loc || pc;

        if (!val) return false;
        return String(val).toLowerCase().includes(locationFilter.toLowerCase());
      });
    }

    if (statusFilter) {
      if (statusFilter === "signaler") {
        result = result.filter(
          (item) => (item.reporting as number | undefined) === 1,
        );
      } else {
        result = result.filter(
          (item) => (item.status as string | undefined) === statusFilter,
        );
      }
    }

    result.sort((a, b) => {
      const valA = a[sortField] as string | undefined;
      const valB = b[sortField] as string | undefined;

      const timeA = valA ? new Date(valA).getTime() : 0;
      const timeB = valB ? new Date(valB).getTime() : 0;

      return dateSortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [
    initialData,
    searchTerm,
    locationFilter,
    statusFilter,
    dateSortOrder,
    sortField,
    searchFields,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    locationFilter,
    setLocationFilter,
    statusFilter,
    setStatusFilter,
    dateSortOrder,
    setDateSortOrder,
    sortField,
    setSortField,
    filteredData,
  };
}
