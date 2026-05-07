import React from "react";
import { Search } from "lucide-react";

const FriendSearch = ({ value, onChange, onSearch }) => {
  return (
    <section className="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-2xl px-4 md:px-6 py-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-neutral-900 rounded-full px-4 py-2">
          <Search size={16} className="text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSearch();
              }
            }}
            placeholder="Search for new friends..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={onSearch}
          className="px-5 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Search
        </button>
      </div>
    </section>
  );
};

export default FriendSearch;
