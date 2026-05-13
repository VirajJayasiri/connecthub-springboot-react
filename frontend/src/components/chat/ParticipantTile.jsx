import React from "react";
import { Mic, MicOff, Crown, Shield, User, X, LogOut } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function ParticipantTile({ 
  participant, 
  isLocal, 
  onMuteToggle, 
  onRemove,
  canManage = false 
}) {
  const { name, role, isMuted, isSpeaking, avatar } = participant;

  const RoleIcon = role === "host" ? Crown : role === "admin" ? Shield : User;
  const roleColor = role === "host" ? "text-yellow-500" : role === "admin" ? "text-blue-500" : "text-gray-400";

  return (
    <div className={cn(
      "relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 group bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800",
      isSpeaking && "ring-2 ring-green-500 shadow-lg shadow-green-500/10",
      !isSpeaking && "hover:border-gray-200 dark:hover:border-neutral-700"
    )}>
      {/* Role Indicator */}
      <div className="absolute top-3 right-3">
        <RoleIcon size={16} className={cn(roleColor, "opacity-80")} />
      </div>

      {/* Avatar */}
      <div className="relative mb-3">
        <div className={cn(
          "w-16 h-16 rounded-full overflow-hidden border-2 transition-transform duration-300 group-hover:scale-105",
          isSpeaking ? "border-green-500" : "border-gray-200 dark:border-neutral-800"
        )}>
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-bold text-gray-500">
              {name[0]}
            </div>
          )}
        </div>
        
        {/* Mic Indicator */}
        <div className={cn(
          "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm",
          isMuted ? "bg-red-500" : "bg-green-500"
        )}>
          {isMuted ? (
            <MicOff size={12} className="text-white" />
          ) : (
            <Mic size={12} className="text-white" />
          )}
        </div>
      </div>

      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate w-full text-center">
        {isLocal ? "You" : name}
      </span>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {isLocal && (
          <button
            onClick={() => onMuteToggle(!isMuted)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium transition-colors",
              isMuted 
                ? "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                : "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            )}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        )}

        {canManage && !isLocal && (
          <button
            onClick={() => onRemove(participant.id)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Remove from Stage"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
