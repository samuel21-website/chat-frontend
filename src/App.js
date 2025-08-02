import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("https://chat-backend-6nc8.onrender.com");

function App() {
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const roomId = "main";
    socket.emit("joinRoom", roomId);

    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, []);

  const handleSend = () => {
    if (nickname && message) {
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
      <h1 className="title">💬 Chatolate</h1>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className="chat-line">
            <span className="chat-item">{msg.nickname}</span> |
            <span className="chat-item">{msg.ip}</span> |
            <span className="chat-item">
              {new Date(msg.time).toLocaleTimeString()}
            </span> |
            <span className="chat-item">{msg.message}</span>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>전송</button>
      </div>

      {/* 광고 배너 */}
      <div className="ad-banner">
        <ins
          className="kakao_ad_area"
          style={{ display: "none" }}
          data-ad-unit="DAN-6g82BnhMT7gbh8nR"
          data-ad-width="320"
          data-ad-height="100"
        ></ins>
        <script
          type="text/javascript"
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          async
        ></script>
      </div>

      {/* 약관 링크 */}
      <footer className="footer">
        <a href="https://chatolate-privacy.netlify.app" target="_blank" rel="noreferrer">
          이용약관
        </a>
        &nbsp;|&nbsp;
      
        
      </footer>
    </div>
  );
}

export default App;
