import { useAuth0 } from "@auth0/auth0-react";
import { FaBars, FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Wallet from "./Wallet";

const Header = ({
  isChatOpen,
  toggleChat,
  isSidebarOpen,
  toggleSidebar,
  isMobile,
}) => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();
  return (
    <header className={`header ${isSidebarOpen || isChatOpen ? "shrink" : ""}`}>
      <div className="header-left">
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle-btn hidden lg:flex items-center text-[#1ffdb0] hover:text-white transition-colors"
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>
        <h1 className="logo">
          <img
            src={null}
            className="h-8 w-8 lg:h-12 lg:w-12"
            onClick={() => navigate("/")}
          />
          <span className="logo-part-1 hidden lg:inline">OP</span>
          <span className="logo-part-2 hidden lg:inline">DUEL</span>
        </h1>
      </div>

      <div className="flex-1 flex justify-center">
        <Wallet />
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="header-right flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <button
                className="login-btn px-2 py-1 lg:px-4 lg:py-2"
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: {
                      screen_hint: "login",
                    },
                  })
                }
              >
                Login
              </button>
              <button
                className="register-btn px-2 py-1 lg:px-4 lg:py-2"
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: {
                      screen_hint: "signup",
                    },
                  })
                }
              >
                Register
              </button>
            </>
          ) : (
            <button
              className="logout-btn px-2 py-1 lg:px-4 lg:py-2"
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
          )}
          <button
            onClick={toggleChat}
            className="chat-toggle-btn hidden lg:flex items-center text-[#1ffdb0] hover:text-white transition-colors"
          >
            <FaCommentDots className="text-xl" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
