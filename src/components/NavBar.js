import { IoTrophyOutline } from "react-icons/io5";
import { MdSportsBaseball } from "react-icons/md";
import { RiChat1Line, RiMenuLine, RiSearchLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";

const NavBar = ({
  toggleSidebar,
  toggleChat,
  isSidebarExpanded,
  isChatOpen,
}) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-gray-800 z-50">
      <div className="flex justify-between items-center px-4 py-2">
        <button
          onClick={toggleSidebar}
          className="flex flex-col items-center space-y-1 flex-1"
        >
          <RiMenuLine
            className={`text-2xl ${
              isSidebarExpanded ? "text-[#1ffdb0]" : "text-gray-400"
            }`}
          />
          <span
            className={`text-xs ${
              isSidebarExpanded ? "text-[#1ffdb0]" : "text-gray-400"
            }`}
          >
            Menu
          </span>
        </button>

        <button
          onClick={() => {}} // Search functionality
          className="flex flex-col items-center space-y-1 flex-1"
        >
          <RiSearchLine className="text-2xl text-gray-400" />
          <span className="text-xs text-gray-400">Search</span>
        </button>

        <button
          onClick={toggleChat}
          className="flex flex-col items-center space-y-1 flex-1"
        >
          <RiChat1Line
            className={`text-2xl ${
              isChatOpen ? "text-[#1ffdb0]" : "text-gray-400"
            }`}
          />
          <span
            className={`text-xs ${
              isChatOpen ? "text-[#1ffdb0]" : "text-gray-400"
            }`}
          >
            Chat
          </span>
        </button>

        <button
          onClick={() => {}}
          className="flex flex-col items-center space-y-1 flex-1"
        >
          <IoTrophyOutline
            className={`text-2xl ${
              isActive("/rewards") ? "text-[#1ffdb0]" : "text-gray-400"
            }`}
          />
          <span
            className={`text-xs ${
              isActive("/rewards") ? "text-[#1ffdb0]" : "text-gray-400"
            }`}
          >
            Rewards
          </span>
        </button>

        <button
          onClick={() => {}}
          className="flex flex-col items-center space-y-1 flex-1"
        >
          <MdSportsBaseball
            className={`text-2xl ${
              isActive("/sports") ? "text-[#1ffdb0]" : "text-gray-400"
            }`}
          />
          <span
            className={`text-xs ${
              isActive("/sports") ? "text-[#1ffdb0]" : "text-gray-400"
            }`}
          >
            Sports
          </span>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
