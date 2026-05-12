import React from "react";

const MessageList = ({ friends, selectedFriendId, onSelect }) => {
  return (
    <aside className="flex flex-col h-full border border-gray-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-black p-4 md:p-5 overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Messages
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {friends.length} conversations
        </p>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
        {friends.map((friend) => {
          const isSelected = friend.id === selectedFriendId;
          return (
            <button
              key={friend.id}
              type="button"
              onClick={() => onSelect(friend)}
              className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all
                ${
                  isSelected
                    ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-neutral-900"
                    : "border-transparent hover:border-gray-200 dark:hover:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900"
                }`}
            >
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-neutral-800"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-black
                    ${friend.online ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {friend.name}
                  </p>
                  {friend.unread > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] font-semibold flex items-center justify-center">
                      {friend.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {friend.lastMessage}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default MessageList;
