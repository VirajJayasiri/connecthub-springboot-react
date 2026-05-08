import React from "react";
import { UserPlus } from "lucide-react";

const SuggestedFriends = ({
  friends,
  addedFriendIds,
  onAdd,
  loading,
  error,
}) => {
  return (
    <section className="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-2xl px-4 md:px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Suggested Friends
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {friends.length} suggestions
        </span>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Loading suggestions...
        </div>
      ) : error ? (
        <div className="text-sm text-rose-500">{error}</div>
      ) : friends.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No suggested friends available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => {
            const isAdded = addedFriendIds.includes(friend.id);
            return (
              <div
                key={friend.id}
                className="flex flex-col items-center text-center bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl px-4 py-5 shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-neutral-800"
                />
                <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {friend.name}
                </p>
                <button
                  type="button"
                  onClick={() => onAdd(friend.id)}
                  disabled={isAdded}
                  className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all
                    ${
                      isAdded
                        ? "bg-gray-100 dark:bg-neutral-900 text-gray-500 dark:text-gray-400"
                        : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                    }`}
                >
                  <UserPlus size={14} />
                  {isAdded ? "Added" : "Add"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SuggestedFriends;
