function SearchBar({ value, onChange, placeholder = 'Search recipes...' }) {
  return (
    <label className="search-bar" htmlFor="recipe-search">
      <span className="search-icon" aria-hidden="true">🔎</span>
      <input
        id="recipe-search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  )
}

export default SearchBar