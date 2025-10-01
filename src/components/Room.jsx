import { useEffect, useRef, useState } from "react";
import SpotlightCard from "../stylings/SpotlightCard";
import Aurora from "../stylings/Aurora";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Room = ({ roomId = 1 }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const stompClientRef = useRef(null);
  const clientId = useRef(Math.random().toString().substring(2,10));

  useEffect(() => {
    const socket = SockJS(`${baseUrl}/ws`);

    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({}, () => {
      console.log("Connected to Websocket");

      stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
        const chat = JSON.parse(msg.body);
        if(chat.clientId !== clientId.current)
        setMessages((prev) => [...prev, { type: "received", text: chat.text }]);
      });
    });

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [roomId]);

  const handleSend = async () => {
    if (message.length == 0) {
      console.log("Write a message");
      return;
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      try {
        await fetch(`${baseUrl}/send/${roomId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Client-Id": clientId.current },
         body: JSON.stringify({ text: message }),
        });

        setMessages((prev) => {
          const updated = [...prev, { type: "sent", text: message }];
          console.log(updated);
          return updated;
        });

        setMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  return (
  <div className="flex-row">
    {/* Aurora Background */}
    <div className="z-[-1] absolute top-0 left-0 w-full h-[90vh] max-lg:h-[50vh] overflow-hidden">
      <Aurora
        colorStops={["#17153B", "#009fff", "#433D8B"]}
        blend={0.05}
        amplitude={0.5}
        speed={0.8}
      />
    </div>

    <div className="relative mt-[6rem] h-[80vh] w-[95%] md:w-[70%]">
      <SpotlightCard
        className="relative custom-spotlight-card h-full opacity-80 bg-transparent"
        spotlightColor="rgba(0, 225, 180, 0.3)"
      >
        <div className="flex justify-between items-center md:px-4 py-2 ">
          <div className="border border-white rounded-full flex-row p-2">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
          </div>

          <h1 className="text-3xl text-white font-black text-center">
            Room name
          </h1>

          <div className="border border-white rounded-full flex-row p-2">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
              />
            </svg>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto md:px-5 py-4 space-y-2 max-h-[80%]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "sent" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  msg.type === "sent" ? "bg-teal-600" : "bg-amber-700"
                } text-white rounded-2xl px-4 py-2 max-w-xs`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <form
          className="flex justify-between py-2 md:px-5 absolute bottom-5 gap-5 w-[85%] md:w-[95%]"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <div className="flex items-center gap-3 w-[80%]">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-colors ${
                  isPrivate ? "bg-teal-400" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-5 h-5 z-10 bg-white rounded-full shadow-md transform transition-transform ${
                    isPrivate ? "translate-x-7" : "translate-x-0"
                  }`}
                />
                <span className="absolute right-3 text-teal-400">Ai</span>
              </button>
            </div>

            <input
              name="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border-1 border-white px-4 py-2 text-white flex items-center rounded-3xl w-full"
              placeholder="Send Message"
            />
          </div>

          <div>
            <img
              src="https://cdn-icons-png.freepik.com/512/5582/5582878.png"
              alt=""
              className="h-10 cursor-pointer"
              onClick={handleSend}
            />
          </div>
        </form>
      </SpotlightCard>
    </div>
  </div>
);

};

export default Room;
