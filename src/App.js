// src/App.js
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookie from './pages/Cookie';
import './App.css';

function App() {
  const adRef = useRef(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    // 광고 스크립트 추가
    if (!isAdLoaded) {
      const script = document.createElement('script');
      script.async = true;
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      script.onload = () => setIsAdLoaded(true);
      adRef.current?.appendChild(script);
    }
  }, [isAdLoaded]);

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">채팅</Link> |{" "}
          <Link to="/terms">이용약관</Link> |{" "}
          <Link to="/privacy">개인정보처리방침</Link> |{" "}
          <Link to="/cookie">쿠키정책</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ChatRoom />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookie" element={<Cookie />} />
        </Routes>

        {/* 광고 배너 영역 */}
        <div className="ad-banner" ref={adRef}>
          <ins className="kakao_ad_area"
            style={{ display: 'none' }}
            data-ad-unit="DAN-6g82BnhMT7gbh8nR"  // ← 이 부분은 당신의 광고 단위 ID로 교체!
            data-ad-width="320"
            data-ad-height="100">
          </ins>
        </div>
      </div>
    </Router>
  );
}

export default App;
