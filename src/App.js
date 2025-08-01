import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('https://chat-backend-6nc8.onrender.com'); // Render 주소

function App() {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('joinRoom', 'room1');
    });

    socket.on('chatHistory', (messages) => {
      setChat(messages);
    });

    socket.on('receiveMessage', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off('chatHistory');
      socket.off('receiveMessage');
      socket.off('connect');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const send = () => {
    if (nickname.trim() && message.trim()) {
      socket.emit('sendMessage', {
        roomId: 'room1',
        nickname,
        message,
      });
      setMessage('');
    }
  };

  return (
    <div style={{
      padding: '10px',
      fontFamily: 'Arial',
      maxWidth: '500px',
      margin: 'auto',
    }}>
      <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>💬 실시간 채팅</h2>

      <input
        placeholder="닉네임 입력"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{
          marginBottom: '8px',
          padding: '8px',
          width: '100%',
          fontSize: '1rem',
        }}
      />

      <div style={{
        border: '1px solid #ccc',
        padding: '10px',
        minHeight: '200px',
        maxHeight: '60vh',
        overflowY: 'auto',
        marginBottom: '8px',
        backgroundColor: '#fafafa',
        fontSize: '0.95rem'
      }}>
        {chat.map((m, i) => (
          <div key={i}>
            <strong>[{m.nickname} @ {m.ip}]</strong>: {m.message}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div style={{
        display: 'flex',
        gap: '6px'
      }}>
        <input
          type="text"
          placeholder="메시지 입력"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '1rem',
          }}
        />
        <button
          onClick={send}
          style={{
            padding: '10px 15px',
            fontSize: '1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          보내기
        </button>
      </div>
    </div>
  );
}

export default App;
