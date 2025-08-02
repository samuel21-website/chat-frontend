import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("https://chat-backend-6nc8.onrender.com");

function App() {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", "main");

    socket.on("chatHistory", (messages) => {
      setChatList(messages);
    });

    socket.on("receiveMessage", (msg) => {
      setChatList((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, []);

  const handleSend = () => {
    if (nickname.trim() && message.trim()) {
      socket.emit("sendMessage", {
        roomId: "main",
        nickname,
        message,
      });
      setMessage("");
    }
  };

  return (
    <div className="app">
      <h1>💬 FNC - Chat</h1>
      <div className="nickname-input">
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div className="chat-box">
        {chatList.map((chat, idx) => (
          <div key={idx} className="chat">
            <strong>{chat.nickname}</strong> ({chat.ip})<br />
            {chat.message}
            <span className="time">{new Date(chat.time).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="send-box">
        <input
          type="text"
          placeholder="메시지 입력..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>보내기</button>
      </div>

      {/* 📢 광고 배너 */}
      <div className="adfit-banner">
        <ins className="kakao_ad_area"
          style={{ display: "block" }}
          data-ad-unit="DAN-6g82BnhMT7gbh8nR"
          data-ad-width="320"
          data-ad-height="100">
        </ins>
        <script async src="//t1.daumcdn.net/kas/static/ba.min.js"></script>
      </div>
    </div>
  );
}

export default App;
