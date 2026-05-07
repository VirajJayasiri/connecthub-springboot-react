import React from "react";
import { Users } from "lucide-react";

const FriendEmptyState = () => {
  return (
    <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-2xl px-6">
      <Users
        size={56}
        className="text-gray-200 dark:text-gray-700 mb-4"
        strokeWidth={1.5}
      />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Select a friend to start messaging
      </p>
    </div>
  );
};

export default FriendEmptyState;
