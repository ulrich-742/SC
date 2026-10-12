import { useState } from "react";
import "./UserDataGrid.css";

export interface DataGridColumn<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataGridProps<T> {
  columns: DataGridColumn<T>[];
  data: T[];
  emptyMessage?: string;
  rowsPerPage: number;
  onRowClick?: (item: T) => void;
  selectedId?: number;
}

function UserDataGrid<T extends { id: string | number }>({
  columns,
  data,
  emptyMessage = "Aucune donnée disponible.",
  rowsPerPage,
  onRowClick,
  selectedId,
}: DataGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const paginatedData = data.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const neighbors = 1;
    pages.push(1);
    if (currentPage - neighbors > 2) {
      pages.push("...");
    }
    const start = Math.max(2, currentPage - neighbors);
    const end = Math.min(totalPages - 1, currentPage + neighbors);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage + neighbors < totalPages - 1) {
      pages.push("...");
    }
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="table-container-global">
      <div className="table-responsive">
        <table className="custom-data-grid">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                onKeyDown={(event) => {
                  if (!onRowClick) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onRowClick(item);
                  }
                }}
                role={onRowClick ? "button" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                className={`${onRowClick ? "clickable-row" : ""} ${
                  selectedId === item.id ? "selected-row" : ""
                }`}
              >
                {columns.map((col) => (
                  <td key={`${item.id}-${col.key}`}>
                    {col.render
                      ? col.render(item)
                      : (item[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {totalRows === 0 && <p className="data-grid-empty">{emptyMessage}</p>}
      </div>

      {totalRows > 0 && (
        <div className="grid-pagination-container">
          <span className="pagination-info">
            Affichage de {startIndex + 1} à {endIndex} sur {totalRows}
          </span>

          <div className="pagination-buttons">
            <button
              type="button"
              className="nav-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {visiblePages.map((page) => {
              if (page === "...") {
                return (
                  <span key="ellipsis" className="pagination-ellipsis">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={`page-${page}`}
                  type="button"
                  className={`page-num-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page as number)}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              className="nav-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDataGrid;
