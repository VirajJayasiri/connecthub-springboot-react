import { MessageSquare, Mic, Video, Users } from "lucide-react";

const typeConfig = {
  text: { label: "Text Chat", icon: MessageSquare },
  voice: { label: "Voice Chat", icon: Mic },
  video: { label: "Video Chat", icon: Video },
};

function RoomDetails({
  room,
  messages,
  messageText,
  onMessageTextChange,
  onSendMessage,
}) {
  const config = typeConfig[room.type] || typeConfig.text;
  const Icon = config.icon;
  const isSendDisabled = !messageText.trim();

  return (
    <div className="room-details">
      <div className="room-details-header">
        <div>
          <div className="room-details-title">
            <Icon size={18} />
            <h2>{room.name}</h2>
          </div>
          <div className="room-badges">
            <span className="badge">{config.label}</span>
          </div>
        </div>
        <div className="room-members">
          <Users size={16} />
          {room.members} members
        </div>
      </div>

      {room.type === "text" ? (
        <div className="room-chat">
          <div className="message-list">
            {messages.map((msg) => (
              <div key={msg.id} className="message-item">
                <div className="message-meta">
                  <span className="message-user">{msg.sender}</span>
                  <span className="message-time">{msg.time}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <label className="message-input">
            <MessageSquare size={16} />
            <input
              type="text"
              placeholder="Write a message..."
              value={messageText}
              onChange={(event) => onMessageTextChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSendMessage();
                }
              }}
            />
            <button
              type="button"
              className="ghost-btn send-btn"
              onClick={onSendMessage}
              disabled={isSendDisabled}
            >
              Send
            </button>
          </label>
        </div>
      ) : (
        <div className="room-preview">
          <div className="preview-card">
            <Icon size={36} />
            <h3>
              {room.type === "voice"
                ? "Voice room preview"
                : "Video room preview"}
            </h3>
            <p>
              {room.type === "voice"
                ? "Join the audio channel to start talking."
                : "Launch video to collaborate face to face."}
            </p>
            <button type="button" className="primary-btn">
              {room.type === "voice" ? "Join Voice" : "Join Video"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetails;
