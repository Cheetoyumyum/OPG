import { FaCommentDots, FaWallet, FaBars } from 'react-icons/fa';

const Header = ({ isChatOpen, toggleChat, isSidebarOpen, toggleSidebar }) => {
  return (
    <header className={`header ${isSidebarOpen || isChatOpen ? 'shrink' : ''}`}>
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
        aria-label="Toggle Sidebar"
      >
        <FaBars />
      </button>

      <h1 className="logo">
        <span className="logo-part-1">OP</span>
        <span className="logo-part-2">DUEL</span>
      </h1>

      <div className="header-right">
        <button className="login-btn">Login</button>
        <button className="register-btn">Register</button>
        <button onClick={toggleChat} className="chat-toggle-btn">
          <FaCommentDots />
        </button>
      </div>
    </header>
  );
};

export default Header;
