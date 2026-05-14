import React from "react";
import { Send } from "lucide-react";

const FriendChatPanel = ({
  friend,
  messages,
  loading,
  messageInput,
  onMessageChange,
  onSend,
  scrollAnchorRef,
  onMessageContextMenu,
  contextMenu,
  onCloseContextMenu,
  onStartEdit,
  onDeleteMessage,
  editingMessageId,
  editingContent,
  onEditChange,
  onEditSave,
  onEditCancel,
}) => {
  return (
    <section className="flex flex-col h-full border border-gray-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-black">
      <div className="flex items-center gap-3 px-4 md:px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
        <img
          src={friend.avatar}
          alt={friend.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-neutral-800"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {friend.name}
          </p>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto px-4 md:px-5 py-4 space-y-3 relative custom-scrollbar"
        onClick={onCloseContextMenu}
      >
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((message) => {
            const isSender = message.sender === "You";
            const isEditing = message.messageId === editingMessageId;
            return (
              <div
                key={message.id}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] ${isSender ? "items-end" : "items-start"} flex flex-col gap-1`}
                >
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    {message.sender} • {message.time}
                  </span>
                  {isEditing ? (
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed w-full
                        ${
                          isSender
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200"
                        }`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <textarea
                        value={editingContent}
                        onChange={(event) => onEditChange(event.target.value)}
                        rows={2}
                        className={`w-full resize-none bg-transparent text-sm outline-none border border-transparent rounded-lg px-2 py-1
                          ${
                            isSender
                              ? "placeholder-gray-300"
                              : "placeholder-gray-400"
                          }`}
                        placeholder="Edit message"
                      />
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={onEditCancel}
                          className="px-3 py-1 rounded-full text-xs font-semibold border border-current/20"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={onEditSave}
                          disabled={!editingContent.trim()}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-900 disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm leading-relaxed
                        ${
                          isSender
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                            : "bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200"
                        }`}
                      onContextMenu={(event) =>
                        onMessageContextMenu(event, message)
                      }
                    >
                      {message.text}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        {contextMenu?.isOpen && (
          <div
            className="fixed z-50 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg py-2 w-40"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onStartEdit(contextMenu.message)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-900"
            >
              Edit message
            </button>
            <button
              type="button"
              onClick={() => onDeleteMessage(contextMenu.message)}
              className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-900"
            >
              Delete message
            </button>
          </div>
        )}
        <div ref={scrollAnchorRef} />
      </div>

      <div className="px-3 md:px-5 py-3 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-900 rounded-xl px-3 py-2">
          <input
            type="text"
            value={messageInput}
            onChange={(event) => onMessageChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSend();
              }
            }}
            placeholder={`Message ${friend.name}...`}
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!messageInput.trim()}
            className="p-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:hover:bg-gray-900"
            title="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FriendChatPanel;
