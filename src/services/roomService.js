import { ref, get } from "firebase/database";
import { db } from "./firebase.js";

export async function getRooms() {
  const roomRef = ref(db, "meeting_rooms");

  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(([id, room]) => ({
    id,
    ...room
  }));
}


// ดึงห้องเดียว
export async function getRoomById(roomId) {
  try {
    const roomRef = ref(
      db,
      `meeting_rooms/${roomId}`
    );

    const snapshot = await get(roomRef);

    if (snapshot.exists()) {
      return {
        id: roomId,
        ...snapshot.val()
      };
    }

    return null;

  } catch (error) {
    console.error(
      "โหลดรายละเอียดห้องไม่สำเร็จ:",
      error
    );

    throw error;
  }
}
