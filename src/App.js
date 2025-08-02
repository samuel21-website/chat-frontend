import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('https://chat-backend-6nc8.onrender.com');

function App() {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // 브라우저 알림 권한 요청
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // 소켓 연결 및 이벤트 등록
    socket.on('connect', () => {
      socket.emit('joinRoom', 'room1');
    });

    socket.on('chatHistory', (messages) => {
      setChat(messages);
    });

    socket.on('receiveMessage', (data) => {
      setChat((prev) => [...prev, data]);

      // 🔔 브라우저 알림 띄우기
      if (Notification.permission === 'granted') {
        new Notification(`[${data.nickname}]`, {
          body: data.message,
          icon: '/logo.png', // 선택사항 (public 폴더에 파일 존재해야 함)
        });
      }
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
    <div style={{ padding: '15px', fontFamily: 'Arial', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>💬 FkingNiceChat</h2>

      <input
        placeholder="닉네임 입력"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
      />

      <div style={{
        border: '1px solid #ccc',
        padding: '10px',
        minHeight: '200px',
        maxHeight: '400px',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9',
        marginBottom: '10px'
      }}>
        {chat.map((m, i) => {
          const time = new Date(m.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={i}>
              <strong>[{m.nickname} @ {m.ip}]</strong> ({time}): {m.message}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="메시지 입력"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          style={{ flex: 1, padding: '10px' }}
        />
        <button
          onClick={send}
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          보내기
        </button>
      </div>
    </div>
  );
}

export default App;
