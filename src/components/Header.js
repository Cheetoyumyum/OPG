import { FaCommentDots, FaBars } from "react-icons/fa";
import Wallet from "./Wallet";
import { useAuth0 } from "@auth0/auth0-react";
const Header = ({ isChatOpen, toggleChat, isSidebarOpen, toggleSidebar }) => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  return (
    <header className={`header ${isSidebarOpen || isChatOpen ? "shrink" : ""}`}>
      <div className="header-left">
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
      </div>

      <Wallet />
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="header-right">
          {!isAuthenticated ? (
            <>
              <button className="login-btn" onClick={loginWithRedirect}>
                Login
              </button>
              <button className="register-btn" onClick={loginWithRedirect}>
                Register
              </button>
            </>
          ) : (
            <>
              <button
                className="logout-btn"
                onClick={() =>
                  logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    },
                  })
                }
              >
                Logout
              </button>
            </>
          )}
          <button onClick={toggleChat} className="chat-toggle-btn">
            <FaCommentDots />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
