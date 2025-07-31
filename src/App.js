import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// 서버 주소 (로컬 서버일 경우 localhost)
const socket = io('https://chat-backend-6nc8.onrender.com');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // 채팅방 입장
    socket.emit('joinRoom', 'room1');

    // 메시지 수신
    socket.on('receiveMessage', (msg) => {
      setChat((prev) => [...prev, msg]);
    });
  }, []);

  const send = () => {
    if (message.trim() !== '') {
      socket.emit('sendMessage', { roomId: 'room1', message });
      setMessage('');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2>💬 실시간 채팅</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px', marginBottom: '10px' }}>
        {chat.map((m, i) => (
          <div key={i} style={{ marginBottom: '5px' }}>🗨️ {m}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder="메시지를 입력하세요..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '80%', padding: '8px' }}
      />
      <button onClick={send} style={{ padding: '8px 12px', marginLeft: '5px' }}>
        보내기
      </button>
    </div>
  );
}

export default App;
