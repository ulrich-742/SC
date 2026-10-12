import "./Search.css";
import { IoIosSearch } from "react-icons/io";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function Search({ value, onChange }: Props) {
  return (
    <div className="search_bar">
      <IoIosSearch className="searchbar_icon" />

      <input
        type="text"
        placeholder="Rechercher un coiffeur ou une ville..."
        className="searchbar_input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default Search;
