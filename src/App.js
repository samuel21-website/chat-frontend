import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import './App.css';

const socket = io('https://chat-backend-6nc8.onrender.com');

function App() {
  const [roomId] = useState('main');
  const [nickname, setNickname] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('chatHistory', (history) => {
      setMessages(history);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);

      if (document.visibilityState !== 'visible') {
        if (Notification.permission === 'granted') {
          new Notification(`${message.nickname}`, {
            body: message.message,
          });
        }
      }
    });

    return () => socket.disconnect();
  }, [roomId]);

  const sendMessage = () => {
    if (!nickname.trim() || !input.trim()) return;

    socket.emit('sendMessage', { roomId, nickname, message: input });
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <Router>
      <div className="App">
        <h1>💬 채팅방</h1>
        <div>
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className="chat-message">
              <strong>{msg.nickname}</strong>: {msg.message}
              <div className="chat-meta">
                <span>{msg.ip}</span> | <span>{new Date(msg.time).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="메시지 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>전송</button>

        <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '14px' }}>
          <Link to="/privacy" style={{ margin: '0 10px' }}>개인정보처리방침</Link>
          <Link to="/terms" style={{ margin: '0 10px' }}>이용약관</Link>
          <Link to="/cookies" style={{ margin: '0 10px' }}>쿠키 정책</Link>
        </footer>
      </div>

      <Routes>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
