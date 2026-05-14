import React from "react";
import ParticipantTile from "./ParticipantTile";
import { Users, Bell, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function StageArea({ 
  participants, 
  localParticipantId, 
  onMuteToggle, 
  onRemoveFromStage,
  requests = [],
  onOpenRequests,
  currentUserRole
}) {
  const canManage = currentUserRole === "host" || currentUserRole === "admin";
  const hasRequests = requests.length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Stage Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-gray-400" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            Stage <span className="text-gray-400 font-normal ml-1">({participants.length})</span>
          </h3>
        </div>

        {canManage && (
          <button 
            onClick={onOpenRequests}
            className={cn(
              "relative flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 text-sm font-medium",
              hasRequests 
                ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 animate-pulse" 
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800"
            )}
          >
            <Bell size={16} />
            <span>Requests</span>
            {hasRequests && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {requests.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {participants.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Users size={48} className="mb-4" strokeWidth={1} />
            <p className="text-sm">No one is on stage yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {participants.map((p) => (
              <ParticipantTile
                key={p.id}
                participant={p}
                isLocal={p.id === localParticipantId}
                onMuteToggle={onMuteToggle}
                onRemove={onRemoveFromStage}
                canManage={canManage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
