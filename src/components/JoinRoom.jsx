import React, { useState } from "react";
import SpotlightCard from "../stylings/SpotlightCard";
import SwipeButton from "../stylings/SwipeButton";

const JoinRoom = ({ onClose }) => {
  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = () => {
    console.log("join room swiped", { roomId });
  };

  return (
    <div className="relative w-[20rem] text-white">
      <SpotlightCard
        className="custom-spotlight-card p-6 flex flex-col gap-5 relative"
        spotlightColor="rgba(0, 225, 180, 0.3)"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-red-400 transition"
        >
          ✕
        </button>

        {/* Room ID Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="roomId" className="text-sm font-medium">
            Room ID
          </label>
          <input
            id="roomId"
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
            className="px-3 py-2 rounded-2xl border border-white/40 bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Swipe Button */}
        <div className="mt-2  ">
          <SwipeButton onSuccess={handleJoinRoom} content="Join Room" />
        </div>
      </SpotlightCard>
    </div>
  );
};

export default JoinRoom;
