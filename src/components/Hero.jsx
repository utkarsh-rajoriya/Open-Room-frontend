import { useRef, useState } from "react";
import Aurora from "../stylings/Aurora";
import RotatingText from "../stylings/RotatingText";
import SpotlightCard from "../stylings/SpotlightCard";
import SwipeButton from "../stylings/SwipeButton";
import CreateRoom from "./CreateRoom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import JoinRoom from "./JoinRoom";
import {useNavigate } from "react-router-dom";

const Hero = ({user}) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  gsap.registerPlugin(ScrollToPlugin)
  const navigate = useNavigate();
  const buttonsRef = useRef(null)
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

  const tl = gsap.timeline();

  const showLogins = () => {
  tl.clear(); // clear previous timeline animations

  // Scroll smoothly to the login buttons
  tl.to(window, {
    duration: 1,
    scrollTo: { y: buttonsRef.current, offsetY: 200 },
    ease: "power2.inOut",
  });

  // GitHub button animation
  tl.to(".github", {
    scale: 1.4,
    rotation: 5,
    duration: 0.4,
    yoyo: true,
    repeat: 1,
    ease: "bounce.out",
    boxShadow: "0px 0px 20px rgba(255,255,255,0.5)",
  }, "-=0.2");
  
  tl.to(".google", {
    scale: 1.3,
    rotation: -5,
    duration: 0.4,
    yoyo: true,
    repeat: 1,
    ease: "elastic.out(1, 0.5)",
    boxShadow: "0px 0px 20px rgba(255,255,255,0.5)",
  }, "-=0.35");
  
  tl.to([".github", ".google"], {
    x: 5,
    duration: 0.05,
    yoyo: true,
    repeat: 5,
    ease: "power1.inOut",
  });
};


  const handleCreateRoom = () =>{
    if(!localStorage.getItem('email')){
      showLogins()
      return;
    }

  setShowCreateRoom(true);
  }

  const handleJoinRoom = () =>{
    if(!localStorage.getItem('email')){
      showLogins()
      return;
    }
    navigate("/viewRooms")
  }
  
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

        {!user && <div className="buttons" ref={buttonsRef}>
          <div className="w-55">
            <button
              onClick={(e) =>
                (window.location.href = `${baseUrl}/oauth2/authorization/github`)
              }
              type="button"
              className="github py-2 max-w-md flex justify-center items-center bg-gray-700 hover:bg-[#433D8B] focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 1792 1792"
              >
                <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
              </svg>
              Sign in with GitHub
            </button>
          </div>

          <div className="w-50">
            <button
              className="gsi-material-button google"
              onClick={(e) =>
                (window.location.href = `${baseUrl}/oauth2/authorization/google`)
              }
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg
                    version="1.1"
                    viewBox="0 0 48 48"
                    style={{ display: "block" }}
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">
                  Sign in with Google
                </span>
                <span style={{ display: "none" }}>Sign in with Google</span>
              </div>
            </button>
          </div>
        </div>}

        {/* Room Cards */}
        <div className="flex-row mt-[3rem] md:mt-[4rem]">
          <div className="flex justify-evenly flex-wrap gap-[2rem] md:gap-[0.9rem] lg:gap-[2rem] w-[90%]">
            {RoomCardArray.map((card) => (
              <div className="spotcard" key={card.roomName}>
                <SpotlightCard
                  className="custom-spotlight-card flex-col h-[20rem] overflow-visible relative"
                  spotlightColor="rgba(0, 225, 180, 0.3)"
                >
                  <div className="flex-row justify-between gap-[1.5rem]">
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
            onClick={closeModal}
          >
            <div
              className="relative z-30 w-full max-w-md px-4 flex-row"
              onClick={(e) => e.stopPropagation()}
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
