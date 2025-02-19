import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import Games from "./views/Games";
import Settings from "./views/Settings";
import Transactions from "./views/Transactions";
import Blackjack from "./views/Blackjack";
import Plinko from "./views/Plinko";

const AppContent = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarExpanded(false);
        setIsChatOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile && isChatOpen) {
      setIsChatOpen(false);
    }
    setSidebarExpanded(!isSidebarExpanded);
  };

  const toggleChat = () => {
    if (isMobile && isSidebarExpanded) {
      setSidebarExpanded(false);
    }
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="layout bg-[#181818] min-h-screen">
      {/* Show sidebar on desktop and mobile */}
      <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      <div
        className={`main-content flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarExpanded && !isMobile ? "lg:ml-[250px]" : ""
        } ${isChatOpen && !isMobile ? "lg:mr-[300px]" : ""}`}
      >
        <Header
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
          isSidebarOpen={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:gameName" element={<Games />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/deposits" element={<Transactions />} />
            <Route
              path="/transactions/withdrawals"
              element={<Transactions />}
            />
            <Route path="/games/blackjack" element={<Blackjack />} />
            <Route path="/games/plinko" element={<Plinko />} />
          </Routes>
        </main>

        <Footer />

        {/* Updated NavBar with toggle props */}
        {isMobile && (
          <NavBar
            toggleSidebar={toggleSidebar}
            toggleChat={toggleChat}
            isSidebarExpanded={isSidebarExpanded}
            isChatOpen={isChatOpen}
          />
        )}
      </div>

      {/* Show chat on desktop and mobile */}
      <Chat isOpen={isChatOpen} />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
