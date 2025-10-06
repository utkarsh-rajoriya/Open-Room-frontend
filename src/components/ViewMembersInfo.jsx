import React, { useEffect, useState } from "react";
import Aurora from "../stylings/Aurora";
import { useParams, useNavigate } from "react-router-dom";

const ViewMembersInfo = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);

  const fetchMembersInfo = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/roomMembersInfo?roomId=${roomId}`,
        {
          credentials: "include",
        }
      );
      if (response.status === 401 || response.status === 500) {
        navigate("/");
        setTimeout(() => alert("Backchodi mt kr!!"), 1000);
        return;
      }
      const data = await response.json();
      console.log(data);
      setRoomData(data);
    } catch (error) {
      console.error("Error fetching members info:", error);
    }
  };

  useEffect(() => {
    fetchMembersInfo();
  }, [roomId]);

  return (
    <div className="w-full h-screen flex flex-col items-center p-4 text-white">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 w-full h-[90vh] z-0">
        <Aurora
          colorStops={["#17153B", "#009fff", "#433D8B"]}
          blend={0.02}
          amplitude={0.4}
          speed={0.8}
        />
      </div>

      {/* Main Container */}
      <div className="relative w-full mt-16 h-[calc(100%-4rem)] max-w-4xl mx-auto flex flex-col z-10 bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-white/10 flex items-center justify-between p-3 sm:p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h1 className="text-xl font-bold">
            {roomData ? roomData.roomName : "Loading..."}
          </h1>

          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          </button>
        </header>

        {/* Members Section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {roomData ? (
            <>
              {/* 🔹 Admin Card */}
              <div>
                <h2 className="text-lg font-semibold mb-3 text-blue-300">
                  Admin
                </h2>
                <div className="flex items-center gap-4 p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <img
                    src={roomData.admin?.picture}
                    alt={roomData.admin?.name}
                    className="w-12 h-12 rounded-full border border-white/20 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {roomData.admin?.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {roomData.admin?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* 🔹 Members List */}
              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3 text-purple-300">
                  Members
                </h2>
                <div className="space-y-3">
                  {roomData.membersInfo
                    .filter((member) => member.id !== roomData.admin?.id)
                    .map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-4 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
                      >
                        <img
                          src={member.picture}
                          alt={member.name}
                          className="w-12 h-12 rounded-full border border-white/20 object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">
                            {member.name}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-400">Loading members...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMembersInfo;
