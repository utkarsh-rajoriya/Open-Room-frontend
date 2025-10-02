import { useEffect, useRef, useState } from "react";
import Aurora from "../stylings/Aurora";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Room = ({ roomId = 1 }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [message, setMessage] = useState("");
  // --- FIX: Start with an empty array, not mock data ---
  const [messages, setMessages] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const stompClientRef = useRef(null);
  const chatContainerRef = useRef(null);
  const clientId = localStorage.getItem("clientChatId");

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const socket = new SockJS(`${baseUrl}/ws`);
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({}, () => {
      console.log("Connected to Websocket");

      stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
        const chat = JSON.parse(msg.body);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newMessage = {
            type: chat.clientId === clientId ? "sent" : "received",
            text: chat.message,
            name: chat.memberName,
            picture: chat.memberPicture,
            time: time,
        };

        setMessages((prev) => [...prev, newMessage]);
      });
    });

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [roomId, clientId, baseUrl]);

  const handleSend = async () => {
    if (message.trim().length === 0) {
      return;
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      try {
        await fetch(`${baseUrl}/send/${roomId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Id": clientId,
            email: localStorage.getItem("email"),
          },
          body: JSON.stringify({ text: message }),
        });
        setMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-4  text-white">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Aurora
          colorStops={["#17153B", "#009fff", "#433D8B"]}
          blend={0.02}
          amplitude={0.4}
          speed={0.8}
        />
      </div>

      {/* Main Glassmorphism Chat Container */}
      <div className="relative w-full mt-16 h-[calc(100%-4rem)] max-w-4xl mx-auto flex flex-col z-10 bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-white/10 flex items-center justify-between p-3 sm:p-4">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Agra Chat Room</h1>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* --- FIX: Removed stray ">" character from path data --- */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
          </button>
        </header>

        {/* Chat Body */}
        <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-3 ${
                msg.type === "sent" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.type === "received" && (
                <img
                  src={msg.picture || `https://i.pravatar.cc/150?u=${msg.name}`}
                  alt={msg.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div
                className={`flex flex-col max-w-[75%] md:max-w-[70%] ${
                  msg.type === "sent" ? "items-end" : "items-start"
                }`}
              >
                {msg.type === "received" && (
                    <p className="text-xs text-gray-400 mb-1 px-1">{msg.name}</p>
                )}
                <div
                  className={`px-4 py-2 text-white break-words ${
                    msg.type === "sent"
                      ? "bg-blue-600 rounded-t-xl rounded-bl-xl"
                      : "bg-zinc-700 rounded-t-xl rounded-br-xl"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-1">
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </main>

        {/* Input Form */}
        <footer className="flex-shrink-0 border-t border-white/10">
          <form
            className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-colors flex-shrink-0 ${ isPrivate ? "bg-teal-500" : "bg-gray-600"}`}
            >
              <div className={`w-5 h-5 z-10 bg-white rounded-full shadow-md transform transition-transform ${ isPrivate ? "translate-x-7" : "translate-x-0" }`}/>
              <span className="absolute right-3 text-xs text-teal-900 font-bold">AI</span>
            </button>
            <input
              name="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-black/20 border border-transparent px-4 py-2 text-white rounded-full w-full focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              placeholder="Type a message..."
            />
            <button type="submit" className="bg-teal-500 rounded-full p-3 text-white hover:bg-teal-600 transition-colors flex-shrink-0 disabled:opacity-50" disabled={!message.trim()}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Room;

