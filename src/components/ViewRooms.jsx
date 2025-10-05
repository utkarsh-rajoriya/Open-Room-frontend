import { useEffect, useState } from "react";
import Aurora from "../stylings/Aurora";
import SpotlightCard from "../stylings/SpotlightCard";
import SwipeButton from "../stylings/SwipeButton";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import {useNavigate } from "react-router-dom";

const ViewRooms = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [availableRooms, setAvailableRooms] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [joinRoomModal, setJoinRoomModal] = useState({
    open: false,
    room: null,
  });
  const navigate = useNavigate();


  // Fetch Rooms
  const fetchRooms = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/getRooms?email=${localStorage.getItem("email")}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data = await res.json();
      setAvailableRooms(data.availableRooms || []);
      setMyRooms(data.myRooms || []);
    } catch (err) {
      console.error(err);
      // fallback demo data
      setAvailableRooms([
        {
          id: 1,
          name: "Global Community Chat",
          memberLimit: 50,
          members: [],
          privacy: false,
        },
        {
          id: 2,
          name: "React Developers Hangout",
          memberLimit: 25,
          members: [],
          privacy: true,
        },
      ]);
      setMyRooms([
        {
          id: 3,
          name: "Project Alpha",
          memberLimit: 10,
          members: [],
          privacy: false,
          roomCode: "PROJ-ALPHA",
        },
      ]);
    }
  };

  useEffect(() => {
    !localStorage.getItem('email') ? navigate("/") : navigate("/viewRooms")
    fetchRooms();
  }, []);

  // Join Room logic
  const handleRoomJoin = async (room) => {
    if (!room.privacy) {
      try {
        const res = await fetch(`${baseUrl}/api/joinRoom`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: localStorage.getItem("email"),
            roomId: room.id,
          }),
        });
        const data = await res.json();
        if (data.message === "success") window.location.reload();
        else alert(`❌ ${data.message}`);
      } catch (err) {
        console.error(err);
        alert("❌ Something went wrong while joining the room");
      }
    } else {
      setJoinRoomModal({ open: true, room });
    }
  };


  // Entering room
  const handleRoomEnter = (room) => {
    return navigate(`/room/${room.id}`)
  };

  const closeModal = () => {
    setShowCreateRoom(false);
    setShowJoinRoom(false);
    setJoinRoomModal({ open: false, room: null });
  };

  // Room Card
  const RoomCard = ({ room, isMyRoom }) => {
    const members = room.currentMembers ?? 0;
    const [tooltipText, setTooltipText] = useState(room.roomCode);

    const handleCopyCode = () => {
      if (!room.roomCode) return;
      navigator.clipboard
        .writeText(room.roomCode)
        .then(() => {
          setTooltipText("Copied!");
          setTimeout(() => setTooltipText(room.roomCode), 2000);
        })
        .catch((err) => console.error("Failed to copy: ", err));
    };

    const ShareIcon = () =>
      isMyRoom &&
      room.roomCode && (
        <div className="relative group flex items-center" onClick={handleCopyCode}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors cursor-pointer"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-auto whitespace-nowrap bg-gray-900 text-white text-xs font-mono px-3 py-1.5 rounded-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none">
            {tooltipText}
          </span>
        </div>
      );

    return (
      <SpotlightCard
        className="w-full flex items-start gap-4 p-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:border-white/20 transition-all duration-300"
        spotlightColor="rgba(0, 225, 180, 0.2)"
      >
        <img
          src={room.roomImg || `https://i.pravatar.cc/150?u=${room.name}`}
          alt={room.name}
          className="w-14 h-14 rounded-full object-cover border-2 ring-2 ring-white/20 flex-shrink-0"
        />
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="flex w-full justify-between items-start">
            <p className="text-white text-lg font-bold truncate pr-4">{room.name}</p>
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              <ShareIcon />
              <p className="text-cyan-400 font-semibold text-base">
                {members} / {room.memberLimit}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <SwipeButton
              content={isMyRoom ? "Enter Room" : "Join Room"}
              bg={isMyRoom ? "#00637c" : "#10B981"}
              onSuccess={() => {isMyRoom ? handleRoomEnter(room) : handleRoomJoin(room)}}
            />
            <div className="flex md:hidden items-center gap-4 flex-shrink-0">
              <ShareIcon />
              <p className="text-cyan-400 font-semibold text-base">
                {members} / {room.memberLimit}
              </p>
            </div>
          </div>
        </div>
      </SpotlightCard>
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-4 sm:p-3 lg:p-8 text-white relative">
      <div className="absolute top-0 left-0 w-full h-[80vh] z-0">
        <Aurora
          colorStops={["#17153B", "#009fff", "#433D8B"]}
          blend={0.02}
          amplitude={0.4}
          speed={0.8}
        />
      </div>

      <main className="relative w-full max-w-7xl mt-20 md:mt-18 flex flex-col md:flex-row md:gap-x-8 lg:gap-x-12 gap-y-12 z-10">
        {/* My Rooms Section */}
        <section className="flex-1 flex flex-col">

          <div className="mb-4 p-2 border-b border-white/10 flex justify-between" >
            <span className="text-3xl font-bold text-center md:text-left">
              My Rooms
            </span>
            <button onClick={() => setShowCreateRoom(true)} className="py-2 px-5 bg-[#10B981] text-white text-lg font-semibold rounded-2xl">Create Room</button>
          </div>

          <div className="flex flex-col gap-5">
            {myRooms.length > 0 ? (
              myRooms.map((room) => <RoomCard key={room.id} room={room} isMyRoom />)
            ) : (
              <div className="text-center text-gray-400 p-8 bg-black/10 rounded-lg">
                You haven't joined any rooms yet.
              </div>
            )}
          </div>
        </section>

        {/* Available Rooms Section */}
        <section className="flex-1 flex flex-col">
          <h2 className="text-3xl font-bold mb-4 pb-2 border-b border-white/10 text-center md:text-left">
            Available Rooms
          </h2>
          <div className="flex flex-col gap-5">
            {availableRooms.length > 0 ? (
              availableRooms.map((room) => (
                <RoomCard key={room.id} room={room} isMyRoom={false} />
              ))
            ) : (
              <div className="text-center text-gray-400 p-8 bg-black/10 rounded-lg">
                No available rooms found.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modals */}
      {(showCreateRoom || showJoinRoom || joinRoomModal.open) && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative z-30 w-full max-w-md px-4 flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {showCreateRoom && <CreateRoom onClose={closeModal} />}
            {showJoinRoom && <JoinRoom onClose={closeModal} />}
            {joinRoomModal.open && (
              <JoinRoom
                roomId={joinRoomModal.room.id}
                onClose={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRooms;
