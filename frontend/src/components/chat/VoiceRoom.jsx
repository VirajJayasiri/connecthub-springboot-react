import React, { useState, useEffect } from "react";
import StageArea from "./StageArea";
import RoomChat from "./RoomChat";
import { X, UserPlus, Shield, User } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

/* ─── AddToStage Modal Sub-component ─────────────────────────── */
const AddToStageModal = ({ isOpen, onClose, onApprove, request }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 dark:border-neutral-800 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Add {request.name} to Stage</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Choose the role for this participant on the stage:
          </p>

          <div className="space-y-3">
            <button 
              onClick={() => onApprove(request.id, "participant")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
                <User size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">Participant</div>
                <div className="text-xs text-gray-400">Can speak on stage</div>
              </div>
            </button>

            <button 
              onClick={() => onApprove(request.id, "admin")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">Admin</div>
                <div className="text-xs text-gray-400">Can speak and manage others</div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main VoiceRoom Component ─────────────────────────────── */
export default function VoiceRoom({ room, onLeave }) {
  // Mock State
  const [participants, setParticipants] = useState([
    { id: "1", name: "Viraj", role: "host", isMuted: false, isSpeaking: true, avatar: null },
    { id: "2", name: "Sarah John", role: "admin", isMuted: true, isSpeaking: false, avatar: null },
    { id: "3", name: "Mike Chen", role: "participant", isMuted: false, isSpeaking: false, avatar: null },
  ]);
  
  const [messages, setMessages] = useState([
    { id: 1, sender: "Viraj", text: "Welcome to the stage everyone!", time: "10:30 PM", avatar: null },
    { id: 2, sender: "Sarah John", text: "Happy to be here!", time: "10:31 PM", avatar: null },
  ]);

  const [requests, setRequests] = useState([
    { id: "req1", name: "Emma Davis", avatar: null }
  ]);

  const [localParticipantId] = useState("1"); // Mocking local user as the host for demo
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const isOnStage = participants.some(p => p.id === localParticipantId);
  const localParticipant = participants.find(p => p.id === localParticipantId);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      sender: "You",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: null
    };
    setMessages([...messages, newMessage]);
  };

  const handleRequestStage = () => {
    setIsRequestPending(true);
    // In real app: websocketService.send("/app/room.requestStage", { roomId: room.id });
    setTimeout(() => {
        // Mocking a response for demo if needed, but normally wait for admin
    }, 2000);
  };

  const handleMuteToggle = (muted) => {
    setParticipants(prev => prev.map(p => 
      p.id === localParticipantId ? { ...p, isMuted: muted } : p
    ));
    // In real app: room.localParticipant.setMicrophoneEnabled(!muted);
  };

  const handleRemoveFromStage = (id) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleApproveRequest = (requestId, role) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      const newParticipant = {
        id: Math.random().toString(36).substr(2, 9),
        name: request.name,
        role: role,
        isMuted: true,
        isSpeaking: false,
        avatar: request.avatar
      };
      setParticipants([...participants, newParticipant]);
      setRequests(requests.filter(r => r.id !== requestId));
      setSelectedRequest(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-black">
      {/* Top Half: Stage */}
      <div className="flex-[1.2] min-h-0">
        <StageArea 
          participants={participants}
          localParticipantId={localParticipantId}
          onMuteToggle={handleMuteToggle}
          onRemoveFromStage={handleRemoveFromStage}
          requests={requests}
          onOpenRequests={() => setShowRequests(true)}
          currentUserRole={localParticipant?.role || "user"}
        />
      </div>

      {/* Bottom Half: Chat */}
      <div className="flex-1 min-h-0">
        <RoomChat 
          messages={messages}
          onSendMessage={handleSendMessage}
          onRequestStage={handleRequestStage}
          isRequestPending={isRequestPending}
          isOnStage={isOnStage}
          roomName={room.name}
        />
      </div>

      {/* Requests Sidebar/Modal Overlay (Simplified for UI) */}
      {showRequests && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xs z-50 flex justify-end transition-all">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Stage Requests</h3>
              <button onClick={() => setShowRequests(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {requests.length === 0 ? (
                <div className="py-20 text-center opacity-40">
                  <p>No pending requests.</p>
                </div>
              ) : (
                requests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700" />
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{req.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold hover:scale-105 transition-transform"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => setRequests(requests.filter(r => r.id !== req.id))}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Role Modal */}
      <AddToStageModal 
        isOpen={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApprove={handleApproveRequest}
      />
    </div>
  );
}
