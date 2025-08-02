import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CookiePolicy from "./pages/CookiePolicy";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatRoom />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookie" element={<CookiePolicy />} />
        </Routes>

        <footer className="footer">
          <Link to="/terms">이용약관</Link>
          <Link to="/privacy">개인정보처리방침</Link>
          <Link to="/cookie">쿠키 정책</Link>

          {/* 광고 배너 */}
          <div className="ad-banner">
            <ins className="kakao_ad_area"
              style={{ display: "none" }}
              data-ad-unit="DAN-6g82BnhMT7gbh8nR"
              data-ad-width="320"
              data-ad-height="100"
            ></ins>
          </div>
        </footer>
      </div>
      {/* 광고 스크립트 삽입 */}
      <script
        type="text/javascript"
        src="//t1.daumcdn.net/kas/static/ba.min.js"
        async
      ></script>
    </Router>
  );
}

export default App;
