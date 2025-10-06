import { useEffect, useRef, useState } from "react";
import Aurora from "../stylings/Aurora";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const Room = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [ai, setAi] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [roomName, setRoomName] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const stompClientRef = useRef(null);
  const chatContainerRef = useRef(null);
  const clientId = localStorage.getItem("clientChatId");
  const { id: roomId } = useParams();

  // ✅ 1. Add a ref to track the initial message load
  const isInitialLoad = useRef(true);

  // Check if user is allowed in this room
  const checkUserValidity = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/checkUserValidity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ roomId, email: localStorage.getItem("email") }),
      });

      if (response.status === 401 || response.status === 500) {
        navigate("/");
        setTimeout(() => alert("Access Denied!"), 1000);
        return;
      }

      const data = await response.json();

      if (data.message === "Not valid") {
        navigate("/");
        setTimeout(() => alert("You are not a member of this room."), 1000);
      } else {
        setRoomName(data.roomName || "Chat Room");
        setShowAi(data.ai);
      }
    } catch (err) {
      console.error("Error validating user:", err);
    }
  };

  // Fetch paginated chats
  const fetchChats = async (currentPage) => {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const response = await fetch(
        `${baseUrl}/api/getChats/${roomId}?page=${currentPage}&size=15`,
        { credentials: "include" }
      );
      const data = await response.json();

      if (data?.content) {
        setTotalPages(data.totalPages);
        const newMessages = data.content.map((chat) => ({
          type: chat.clientId === clientId ? "sent" : "received",
          text: chat.message,
          name: chat.memberName,
          picture: chat.memberPicture,
          time: new Date(chat.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        const chatContainer = chatContainerRef.current;
        const previousScrollHeight = chatContainer.scrollHeight;

        setMessages((prev) => [...newMessages.reverse(), ...prev]);

        if (currentPage > 0) {
          requestAnimationFrame(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight - previousScrollHeight;
          });
        }
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Scroll handler to detect when the user hits the top
  const handleScroll = () => {
    if (loadingMore) return;
    if (chatContainerRef.current.scrollTop === 0 && page + 1 < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchChats(nextPage);
    }
  };
  
  // ✅ 2. Modify the auto-scroll effect
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer || messages.length === 0) return;

    if (isInitialLoad.current) {
      // On the very first load of messages, force scroll to the bottom.
      chatContainer.scrollTop = chatContainer.scrollHeight;
      isInitialLoad.current = false; // Mark as complete
    } else {
      // For new incoming (WebSocket) messages, only scroll if user is near the bottom.
      const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 200;
      if (isNearBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Initialize component, fetch initial chats, and connect WebSocket
  useEffect(() => {
    checkUserValidity();
    fetchChats(0); 

    const socket = new SockJS(`${baseUrl}/ws`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; 
    stompClientRef.current = stompClient;

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
        const chat = JSON.parse(msg.body);
        const newMessage = {
          type: chat.clientId === clientId ? "sent" : "received",
          text: chat.message,
          name: chat.memberName,
          picture: chat.memberPicture,
          time: new Date(chat.timestamp).toLocaleTimeString([], {
             hour: "2-digit",
             minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, newMessage]);
      });
    });

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [roomId, clientId, baseUrl]);

  // Send chat message
  const handleSend = async () => {
    const text = message.trim();
    if (!text) return;
    setMessage("");

    if (stompClientRef.current?.connected) {
      try {
        await fetch(`${baseUrl}/send/${roomId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Id": clientId,
            email: localStorage.getItem("email"),
          },
          credentials: "include",
          body: JSON.stringify({ text, ai }),
        });
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-4 text-white">
      <div className="absolute top-0 left-0 w-full h-[90vh] z-0">
        <Aurora
          colorStops={["#17153B", "#009fff", "#433D8B"]}
          blend={0.02} amplitude={0.4} speed={0.8}
        />
      </div>

      <div className="relative w-full mt-16 h-[calc(100%-4rem)] max-w-4xl mx-auto flex flex-col z-10 bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
        <header className="flex-shrink-0 border-b border-white/10 flex items-center justify-between p-3 sm:p-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 className="text-xl font-bold">{roomName || "Loading..."}</h1>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors" onClick={()=>navigate(`/viewMembersInfo/${roomId}`)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/>
                </svg>
            </button>
        </header>

        <main
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6"
        >
          {loadingMore && <p className="text-center text-gray-400 text-sm">Loading previous messages...</p>}
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-3 ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
              {msg.type === "received" && (
                <img
                  src={msg.picture || `https://i.pravatar.cc/150?u=${msg.name}`}
                  alt={msg.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className={`flex flex-col max-w-[75%] md:max-w-[70%] ${msg.type === "sent" ? "items-end" : "items-start"}`}>
                {msg.type === "received" && (<p className="text-xs text-gray-400 mb-1 px-1">{msg.name}</p>)}
                <div className={`px-4 py-2 text-white break-words markdown-content ${msg.type === "sent" ? "bg-blue-600 rounded-t-xl rounded-bl-xl" : "bg-zinc-700 rounded-t-xl rounded-br-xl"}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </main>

        <footer className="flex-shrink-0 border-t border-white/10">
          <form
            className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4"
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            {showAi && (
              <button
                type="button"
                onClick={() => setAi((prev) => !prev)}
                className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-colors flex-shrink-0 ${ai ? "bg-teal-500" : "bg-gray-600"}`}
              >
                <div className={`w-5 h-5 z-10 bg-white rounded-full shadow-md transform transition-transform ${ai ? "translate-x-7" : "translate-x-0"}`} />
                <span className="absolute right-3 text-xs text-teal-900 font-bold">AI</span>
              </button>
            )}
            <input
              name="message" type="text" value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-black/20 border border-transparent px-4 py-2 text-white rounded-full w-full focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-teal-500 rounded-full p-3 text-white hover:bg-teal-600 transition-colors flex-shrink-0 disabled:opacity-50"
              disabled={!message.trim()}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Room;