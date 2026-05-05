import { Plus, Search } from 'lucide-react'

function SearchCreateBar({ searchTerm, onSearchChange, onCreateClick }) {
  return (
    <div className="search-create">
      <label className="search-field" aria-label="Search chat rooms">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search chat rooms..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
      <button type="button" className="primary-btn" onClick={onCreateClick}>
        <Plus size={16} />
        Create Room
      </button>
    </div>
  )
}

export default SearchCreateBar
