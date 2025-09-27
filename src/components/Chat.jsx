import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  let stompClient = useRef(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/ws");

    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.current.onConnect = () => {
      console.log("Connected");

      stompClient.current.subscribe("/topic/messages", (message) => {
        console.log("latest recieved : ", message.body);
        setMessages((prevMessages) => [...prevMessages, message.body]);
      });
    };

    stompClient.current.activate();

    return () => {
      stompClient.current.deactivate();
    };
  }, []);

  const sendMessage = () => {
    console.log("sending message : ", value);
    stompClient.current.publish({
      destination: "/app/sendMessage",
      body: value,
    });
  };

  return (
    <>
      <h2>Hello world@</h2>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ color: "black" }}
      />
      <br />
      <button
        onClick={sendMessage}
        style={{ backgroundColor: "black", marginTop: "5px" }}
      >
        Send
      </button>

      <br />

      <div style={{ color: "white" }}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </>
  );
};

export default Chat;
