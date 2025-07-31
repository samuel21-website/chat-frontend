import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://chat-backend-6nc8.onrender.com');

function App() {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', 'room1');

    socket.on('receiveMessage', (data) => {
      setChat((prev) => [...prev, data]);
    });
  }, []);

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
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2>💬 실시간 채팅</h2>
      <input
        placeholder="닉네임 입력"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ marginBottom: '10px', padding: '6px', width: '60%' }}
      />
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px', marginBottom: '10px' }}>
        {chat.map((m, i) => (
          <div key={i}>
            <strong>[{m.nickname} @ {m.ip}]</strong>: {m.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="메시지 입력"
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
