const filters = [
  { id: 'all', label: 'All' },
  { id: 'text', label: 'Text' },
  { id: 'voice', label: 'Voice' },
  { id: 'video', label: 'Video' },
]

function FilterTabs({ selectedFilter, onChange }) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Room filters">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`filter-tab${
            selectedFilter === filter.id ? ' active' : ''
          }`}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs
