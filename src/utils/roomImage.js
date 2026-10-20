export function getRoomImage(room) {
  const roomId = room.room_id;

  const imageMap = {
    MR001: "/images/rooms/small/room_small_01.webp",
    MR002: "/images/rooms/medium/room_medium_01.webp",
    MR003: "/images/rooms/large/room_large_01.webp",

    MR004: "/images/rooms/medium/room_medium_02.webp",
    MR005: "/images/rooms/small/room_small_02.webp",
    MR006: "/images/rooms/large/room_large_02.webp",

    MR007: "/images/rooms/medium/room_medium_03.webp",
    MR008: "/images/rooms/large/room_large_03.webp",
    MR009: "/images/rooms/small/room_small_03.webp",

    MR010: "/images/rooms/medium/room_medium_04.webp",
    MR011: "/images/rooms/small/room_small_04.webp",
    MR012: "/images/rooms/medium/room_medium_05.webp",

    MR013: "/images/rooms/small/room_small_05.webp",
    MR014: "/images/rooms/medium/room_medium_06.webp",
    MR015: "/images/rooms/large/room_large_04.webp"
  };

  return imageMap[roomId] || "/images/rooms/small/room_small_01.webp";
}