import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';

const socket = io('https://chat-backend-6nc8.onrender.com');

function ChatPage() {
  const [roomId] = useState('default');
  const [nickname, setNickname] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('chatHistory', (history) => {
      setMessages(history);
    });

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (Notification.permission === 'granted') {
        new Notification(`${msg.nickname}님의 메시지`, { body: msg.message });
      }
    });

    return () => {
      socket.off('chatHistory');
      socket.off('receiveMessage');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (nickname.trim() === '' || input.trim() === '') return;
    socket.emit('sendMessage', { roomId, nickname, message: input });
    setInput('');
  };

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: 'auto' }}>
      <h2>실시간 채팅</h2>
      <input
        type="text"
        placeholder="닉네임 입력"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <div style={{ border: '1px solid #ccc', padding: '1rem', height: 300, overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.nickname}</strong> ({msg.ip}) - {new Date(msg.time).toLocaleString()}
            <br />
            {msg.message}
            <hr />
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="메시지 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', marginTop: '0.5rem' }}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage} style={{ width: '100%', marginTop: '0.5rem' }}>
        보내기
      </button>
      <footer style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <Link to="/terms">이용약관</Link> |{' '}
        <Link to="/privacy">개인정보처리방침</Link> |{' '}
        <Link to="/cookies">쿠키 정책</Link>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
