import API from "./api";

export function mapRoomFromApi(dto) {
  if (!dto) return null;
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description || "",
    type: (dto.type || "TEXT").toLowerCase(),
    members: dto.memberCount ?? 0,
    lastActive: dto.createdAt
      ? new Date(dto.createdAt).toLocaleString()
      : "",
    hostUserId: dto.hostUserId,
    hostId: dto.hostUserId,
    myRole: dto.myRole,
    privacy: "Public",
  };
}

export async function fetchRooms() {
  const { data } = await API.get("/rooms");
  return data.map(mapRoomFromApi);
}

export async function createRoomApi({ name, description, type }) {
  const { data } = await API.post("/rooms", {
    name,
    description,
    type: String(type).toUpperCase(),
  });
  return mapRoomFromApi(data);
}

export async function joinRoomApi(roomId) {
  const { data } = await API.post(`/rooms/${roomId}/join`);
  return mapRoomFromApi(data);
}

export async function fetchRoomState(roomId) {
  const { data } = await API.get(`/rooms/${roomId}/state`);
  return data;
}

export async function fetchLiveKitToken(roomId, displayName) {
  const params = displayName ? { displayName } : undefined;
  const { data } = await API.get(`/rooms/${roomId}/livekit-token`, { params });
  return data;
}

export async function deleteRoomApi(roomId) {
  await API.delete(`/rooms/${roomId}`);
}
