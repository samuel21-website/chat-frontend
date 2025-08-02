import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('https://chat-backend-6nc8.onrender.com');

function App() {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // 광고 스크립트 로드 (AdFit)
    const script = document.createElement('script');
    script.async = true;
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    socket.on('connect', () => {
      socket.emit('joinRoom', 'room1');
    });

    socket.on('chatHistory', (messages) => {
      setChat(messages);
    });

    socket.on('receiveMessage', (data) => {
      setChat((prev) => [...prev, data]);

      // 알림
      if (Notification.permission === 'granted') {
        new Notification(`[${data.nickname}]`, {
          body: data.message,
          icon: '/logo.png',
        });
      }
    });

    return () => {
      socket.off('connect');
      socket.off('chatHistory');
      socket.off('receiveMessage');
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center' }}>💬 FkingNiceChat</h2>

      <input
        placeholder="닉네임 입력"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <div style={{
        border: '1px solid #ccc',
        padding: '10px',
        minHeight: '250px',
        maxHeight: '400px',
        overflowY: 'auto',
        background: '#f9f9f9',
        marginBottom: '10px'
      }}>
        {chat.map((m, i) => {
          const time = new Date(m.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          return (
            <div key={i} style={{ marginBottom: '6px' }}>
              <strong>[{m.nickname}@{m.ip}]</strong> ({time}): {m.message}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          type="text"
          value={message}
          placeholder="메시지 입력"
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
            borderRadius: '4px'
          }}
        >
          보내기
        </button>
      </div>

      {/* 👇👇👇 애드핏 광고 위치 👇👇👇 */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <ins className="kakao_ad_area"
             style={{ display: 'none' }}
             data-ad-unit="DAN-6g82BnhMT7gbh8nR"
             data-ad-width="320"
             data-ad-height="100">
        </ins>
      </div>
    </div>
  );
}

export default App;
