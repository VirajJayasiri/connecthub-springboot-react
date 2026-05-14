import React, { useEffect, useRef, useState } from "react";
import { UserPlus } from "lucide-react";

const SuggestedFriends = ({
  friends,
  addedFriendIds,
  onAdd,
  loading,
  error,
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [friends.length]);

  const handleScroll = () => {
    updateScrollButtons();
  };

  const scrollByAmount = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const firstCard = container.querySelector("[data-suggested-card='true']");
    const styles = window.getComputedStyle(container);
    const gapValue = styles.columnGap || styles.gap || "0px";
    const gap = Number.parseFloat(gapValue) || 0;
    const cardWidth = firstCard ? firstCard.offsetWidth : 320;
    container.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  };

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
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-gray-600 dark:text-gray-300 shadow-sm disabled:opacity-40"
            aria-label="Scroll left"
          >
            {"<"}
          </button>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto pb-2 px-2 -mx-2 scroll-smooth"
          >
            {friends.map((friend) => {
              const isAdded = addedFriendIds.includes(friend.id);
              return (
                <div
                  key={friend.id}
                  className="flex-none w-[calc((100%-3rem)/4)] flex flex-col items-center text-center bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl px-4 py-5 shadow-sm hover:shadow-md transition-all"
                  data-suggested-card="true"
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
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-gray-600 dark:text-gray-300 shadow-sm disabled:opacity-40"
            aria-label="Scroll right"
          >
            {">"}
          </button>
        </div>
      )}
    </section>
  );
};

export default SuggestedFriends;
