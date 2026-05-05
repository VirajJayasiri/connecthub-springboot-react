import { Hash } from "lucide-react";

function EmptyState() {
  return (
    <div className="empty-state">
      <Hash size={64} />
      <h2>Welcome to Chat Rooms</h2>
      <p>Select a room to start chatting or create a new one</p>
    </div>
  );
}

export default EmptyState;
