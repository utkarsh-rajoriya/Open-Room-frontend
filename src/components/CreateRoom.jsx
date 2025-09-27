import React, { useState } from "react";
import SpotlightCard from "../stylings/SpotlightCard";
import SwipeButton from "../stylings/SwipeButton";

const CreateRoom = ({ onClose }) => {
  const [roomName, setRoomName] = useState("");
  const [limit, setLimit] = useState(5);
  const [isPrivate, setIsPrivate] = useState(false);
  const [enableAI, setEnableAI] = useState(false);

  const handleCreateRoom = () => {
    console.log("create room swiped", { roomName, limit, isPrivate, enableAI });
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

        {/* Room Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="roomName" className="text-sm font-medium">
            Room Name
          </label>
          <input
            id="roomName"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="px-3 py-2 rounded-2xl border border-white/40 bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Room Limit */}
        <div className="flex flex-col gap-2">
          <label htmlFor="limit" className="text-sm font-medium">
            Limit
          </label>
          <input
            id="limit"
            type="number"
            value={limit}
            min={1}
            max={100}
            onChange={(e) => setLimit(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-white/40 bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium">Privacy</label>
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors ${
              isPrivate ? "bg-teal-400" : "bg-gray-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                isPrivate ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* AI Toggle */}
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium">AI Assistant</label>
          <button
            onClick={() => setEnableAI(!enableAI)}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors ${
              enableAI ? "bg-teal-400" : "bg-gray-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                enableAI ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Swipe Button */}
        <div className="mt-4">
          <SwipeButton onSuccess={handleCreateRoom} content="Create Room" />
        </div>
      </SpotlightCard>
    </div>
  );
};

export default CreateRoom;
