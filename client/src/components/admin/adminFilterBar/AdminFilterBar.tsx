import { FiCalendar, FiFilter, FiSearch, FiSliders } from "react-icons/fi";
import "./AdminFilterBar.css";

interface TableFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dateSortOrder: "asc" | "desc";
  setDateSortOrder: (value: "asc" | "desc") => void;
  location: string[];
  status: string[];
  locationPlaceholder?: string;
  sortField?: string;
  onSortFieldChange?: (value: "create_time" | "appointment_date") => void;
}

function AdminFilterBar({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  statusFilter,
  setStatusFilter,
  dateSortOrder,
  setDateSortOrder,
  location,
  status,
  locationPlaceholder = "Tous les départements",
  sortField,
  onSortFieldChange,
}: TableFiltersProps) {
  return (
    <div className="admin-users-filters-bar">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input search-input"
        />
      </div>

      <div className="filter-select-wrapper">
        <FiFilter className="filter-icon" />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">{locationPlaceholder}</option>
          {location.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-select-wrapper">
        <FiFilter className="filter-icon" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les statuts</option>
          {status.map((stat) => (
            <option key={stat} value={stat}>
              {stat}
            </option>
          ))}
        </select>
      </div>
      <div className="filters-controls-wrapper">
        {sortField !== undefined && onSortFieldChange && (
          <div className="filter-select-wrapper">
            <FiSliders className="filter-icon" />
            <select
              value={sortField}
              onChange={(e) =>
                onSortFieldChange(
                  e.target.value as "create_time" | "appointment_date",
                )
              }
              className="filter-select"
            >
              <option value="create_time">Trier par : Date de création</option>
              <option value="appointment_date">Trier par : Date du RDV</option>
            </select>
          </div>
        )}

        <div className="filter-select-wrapper">
          <FiCalendar className="filter-icon" />
          <select
            value={dateSortOrder}
            onChange={(e) => setDateSortOrder(e.target.value as "asc" | "desc")}
            className="filter-select"
          >
            <option value="desc">Plus récent au plus ancien</option>
            <option value="asc">Plus ancien au plus récent</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default AdminFilterBar;
