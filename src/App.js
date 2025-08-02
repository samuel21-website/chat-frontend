import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://chat-backend-6nc8.onrender.com');

function App() {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', 'main');

    socket.on('chatHistory', (history) => {
      setMessages(history);
    });

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);

      // 알림
      if (document.visibilityState !== 'visible' && data.nickname !== nickname) {
        if (Notification.permission === 'granted') {
          new Notification(`${data.nickname}: ${data.message}`);
        }
      }
    });

    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    return () => {
      socket.disconnect();
    };
  }, [nickname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !nickname.trim()) return;

    socket.emit('sendMessage', {
      roomId: 'main',
      nickname,
      message,
    });
    setMessage('');
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString();
  };

  return (
    <div className="container">
      <h1>실시간 채팅</h1>

      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="닉네임"
        className="input"
      />

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className="chat-message">
            <strong>{msg.nickname}</strong> [{msg.ip}] 🕒 {formatTime(msg.time)}:
            <span className="message"> {msg.message}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="input"
        />
        <button type="submit" className="btn">전송</button>
      </form>

      <footer>
        <a href="/terms" target="_blank" rel="noreferrer">이용약관</a>
        <a href="/privacy" target="_blank" rel="noreferrer">개인정보처리방침</a>
        <a href="/cookies" target="_blank" rel="noreferrer">쿠키 정책</a>
      </footer>
    </div>
  );
}

export default App;
