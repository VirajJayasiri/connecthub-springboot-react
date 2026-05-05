import { MessageSquare, Mic, Video, Users, Lock } from 'lucide-react'

const typeConfig = {
  text: { label: 'Text Chat', icon: MessageSquare },
  voice: { label: 'Voice Chat', icon: Mic },
  video: { label: 'Video Chat', icon: Video },
}

function RoomCard({ room, isSelected, selectedFilter, onJoinRoom }) {
  const config = typeConfig[room.type] || typeConfig.text
  const Icon = config.icon
  const shouldShowJoinButton =
    selectedFilter === 'voice' || selectedFilter === 'video'
  const isCardClickable =
    selectedFilter === 'all' || selectedFilter === 'text'

  return (
    <article
      className={[
        'room-card',
        isSelected ? 'selected' : '',
        isCardClickable ? 'clickable' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => {
        if (isCardClickable) {
          onJoinRoom(room)
        }
      }}
    >
      <div className="room-card-top">
        <div className="room-card-title">
          <span className="room-icon" aria-hidden="true">
            <Icon size={18} />
          </span>
          <div>
            <h3>{room.name}</h3>
            <div className="room-badges">
              <span className="badge">{config.label}</span>
              {room.isPrivate && (
                <span className="badge badge-dark">
                  <Lock size={12} />
                  Private
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="room-description">{room.description}</p>
      <div className="room-meta">
        <span>
          <Users size={14} />
          {room.members} members
        </span>
        <span className="room-time">{room.lastActive}</span>
      </div>
      {shouldShowJoinButton && (
        <button
          type="button"
          className="room-join-btn"
          onClick={(event) => {
            event.stopPropagation()
            onJoinRoom(room)
          }}
        >
          Join Room
        </button>
      )}
    </article>
  )
}

export default RoomCard
