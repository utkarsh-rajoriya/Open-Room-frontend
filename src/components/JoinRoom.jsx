import { useState } from "react";
import SpotlightCard from "../stylings/SpotlightCard";
import SwipeButton from "../stylings/SwipeButton";

const JoinRoom = ({ roomId, onClose }) => {
  const [roomCode, setRoomCode] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSend = async () => {
    if (!roomCode) {
      alert("❌ Please enter the room code");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/joinRoom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          roomId: Number(roomId),
          email: localStorage.getItem("email"),
          roomCode,
        }),
      });

      const data = await response.json();
      if (data.message === "success") {
        onClose();
        window.location.reload();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while joining the room");
    }
  };

  return (
    <div className="relative w-[20rem] text-white">
      <SpotlightCard
        className="custom-spotlight-card p-6 flex flex-col gap-5 relative"
        spotlightColor="rgba(0, 225, 180, 0.3)"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-red-400 transition"
        >
          ✕
        </button>

        <div className="flex flex-col gap-2">
          <label htmlFor="roomCode" className="text-sm font-medium">Room Code</label>
          <input
            id="roomCode"
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
            className="px-3 py-2 rounded-2xl border border-white/40 bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div className="mt-2 flex-row">
          <SwipeButton onSuccess={handleSend} content="Join Room" />
        </div>
      </SpotlightCard>
    </div>
  );
};

export default JoinRoom;
