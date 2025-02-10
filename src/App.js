import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Games from "./views/Games";
import Settings from "./views/Settings";
import Transactions from "./views/Transactions";
import Blackjack from "./views/Blackjack";
import Plinko from "./views/Plinko";

const App = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isChatOpen]);

  const toggleSidebar = () => setSidebarExpanded(!isSidebarExpanded);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <Router>
      <div className="layout">
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

        <div
          className={`main-content ${isSidebarExpanded ? "shrink-left" : ""} ${
            isChatOpen ? "shrink-right" : ""
          }`}
        >
          <Header
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
            isSidebarOpen={isSidebarExpanded}
            toggleSidebar={toggleSidebar}
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Games" element={<Games />} />
            <Route path="/Games/:gameName" element={<Games />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Transactions" element={<Transactions />} />
            <Route path="/Transactions/Deposits" element={<Transactions />} />
            <Route
              path="/Transactions/Withdrawals"
              element={<Transactions />}
            />

            <Route path="/Games/Blackjack" element={<Blackjack />} />
            <Route path="/Games/Plinko" element={<Plinko />} />
          </Routes>

          <Footer />
        </div>

        <Chat isOpen={isChatOpen} />
      </div>
    </Router>
  );
};

export default App;
