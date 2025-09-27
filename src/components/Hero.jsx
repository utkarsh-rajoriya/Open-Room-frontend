import { useState } from "react";
import Aurora from "../stylings/Aurora";
import RotatingText from "../stylings/RotatingText";
import SpotlightCard from "../stylings/SpotlightCard";
import SwipeButton from "../stylings/SwipeButton";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";

const Hero = () => {
  const RoomCardArray = [
    {
      roomImg:
        "https://cdn-icons-png.freepik.com/256/2082/2082022.png?semt=ais_white_label",
      roomName: "Research Room",
      roomInfo:
        "Research room is designed for deep work, studies, and academic projects.",
    },
    {
      roomImg: "https://cdn-icons-png.flaticon.com/512/7185/7185812.png",
      roomName: "Conference Room",
      roomInfo:
        "Conference room is ideal for meetings, presentations, and team discussions.",
    },
    {
      roomImg:
        "https://static.vecteezy.com/system/resources/thumbnails/027/396/079/small_2x/business-team-working-in-coordination-for-data-analytics-ai-generated-png.png",
      roomName: "Collaboration Room",
      roomInfo:
        "Collaboration room is built for brainstorming, pair programming, and real-time teamwork.",
    },
    {
      roomImg:
        "https://static.vecteezy.com/system/resources/previews/049/629/813/non_2x/game-controller-mascot-png.png",
      roomName: "Gaming Room",
      roomInfo:
        "Gaming room is equipped with consoles and PCs for recreation and relaxation.",
    },
    {
      roomImg:
        "https://png.pngtree.com/png-vector/20240806/ourmid/pngtree-focus-group-concept-in-flat-design-png-image_13147376.png",
      roomName: "Focus Room",
      roomInfo:
        "Focus room offers a distraction-free environment for coding sprints and solo tasks.",
    },
  ];

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  const handleCreateRoom = () => setShowCreateRoom(true);
  const handleJoinRoom = () => setShowJoinRoom(true);
  const closeModal = () => {
    setShowCreateRoom(false);
    setShowJoinRoom(false);
  };

  return (
    <div>
      {/* Aurora Background */}
      <div className="z-[-1] absolute top-0 left-0 w-full h-[90vh] max-lg:h-[50vh] overflow-hidden">
        <Aurora
          colorStops={["#17153B", "#009fff", "#433D8B"]}
          blend={0.05}
          amplitude={0.5}
          speed={0.8}
        />
      </div>

      {/* Main Content */}
      <div className="mt-[10rem] p-5">
        {/* Heading */}
        <div className="flex-row gap-2">
          <span className="text-[#fff] text-5xl font-black">Open</span>
          <div className="w-[10rem] text-5xl font-black">
            <RotatingText
              texts={["Room", "Create", "Play", "Enjoy!"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-gradient-to-b from-[#435D8B] to-[#17153B] text-[#fff] overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>
        </div>

        {/* Intro Paragraph */}
        <div className="mt-[2rem] p-5 flex-row">
          <p className="text-white text-center text-md w-[70rem] max-w-full">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur
            ad sequi dolores eos, minima, delectus temporibus nesciunt officia
            ut laborum deleniti voluptatum sunt eum voluptates ex nemo, dolor
            non quia?
          </p>
        </div>

        {/* Room Cards */}
        <div className="flex-row mt-[4rem]">
          <div className="flex justify-evenly flex-wrap gap-[2rem] md:gap-[0.9rem] lg:gap-[2rem] w-[90%]">
            {RoomCardArray.map((card) => (
              <div className="spotcard" key={card.roomName}>
                <SpotlightCard
                  className="custom-spotlight-card flex-col h-[20rem] overflow-visible relative"
                  spotlightColor="rgba(0, 225, 180, 0.3)"
                >
                  <div className="flex-row justify-between gap-[1rem] lg:gap-[1.5rem]">
                    <img
                      src={card.roomImg}
                      alt=""
                      className="h-20 lg:h-[7rem]"
                    />

                    <div className="flex flex-col gap-3 w-full max-w-[10rem]">
                      <SwipeButton
                        onSuccess={handleCreateRoom}
                        content="Create Room"
                      />
                      <SwipeButton
                        onSuccess={handleJoinRoom}
                        content="Join Room"
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-center text-white text-md">
                    {card.roomName}
                  </p>
                  <p className="mt-2 text-center text-white text-md">
                    {card.roomInfo}
                  </p>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>

        {(showCreateRoom || showJoinRoom) && (
  <div
    className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={closeModal} // closes when clicking outside modal
  >
    <div
      className="relative z-30 w-full max-w-md px-4 flex-row"
      onClick={(e) => e.stopPropagation()} // prevents overlay click from closing modal
    >
      {showCreateRoom && <CreateRoom onClose={closeModal} />}
      {showJoinRoom && <JoinRoom onClose={closeModal} />}
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default Hero;
