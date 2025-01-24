import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaFootballBall, FaQuestionCircle, FaGift, FaUserCog } from "react-icons/fa";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { TbNumber21Small } from "react-icons/tb";
import { LuFlower2 } from "react-icons/lu";
import { LiaMeteorSolid } from "react-icons/lia";
import { GiUnlitBomb } from "react-icons/gi";
import { TbPigMoney } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";
import { FaCircleNotch } from "react-icons/fa";
import { GiOpenTreasureChest } from "react-icons/gi";

const Sidebar = ({ isExpanded, toggleSidebar }) => {
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState({
    games: false,
    wallet: false,
    rewards: false,
    features: false,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredGames = [
    { name: "Blackjack", icon: <TbNumber21Small /> },
    { name: "Flower Poker", icon: <LuFlower2 /> },
    { name: "Limbo", icon: <LiaMeteorSolid /> },
    { name: "Plinko", icon: <GiUnlitBomb /> },
  ].filter((game) => game.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredWallet = [
    { name: "Deposit", icon: <GrMoney /> },
    { name: "Withdraw", icon: <GiUnlitBomb /> },
    { name: "Transfer", icon: <TbPigMoney /> },
  ].filter((wallet) => wallet.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredRewards = [
    { name: "Rakeback", icon: <FaGift /> },
    { name: "Redeem Code", icon: <FaGift /> },
  ].filter((reward) => reward.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredFeatures = [
    { name: "Settings", icon: <FaUserCog /> },
    { name: "Stats", icon: <FaCircleNotch /> },
  ].filter((feature) => feature.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <button
        className="text-xl text-[#1ffdb0] hover:text-white mb-6"
        onClick={toggleSidebar}
      >
        {isExpanded ? <HiChevronUp /> : <HiChevronDown />}
      </button>

      <div className="flex flex-col gap-4">
        <div className="sidebar-search-container">
          <input
            type="text"
            placeholder="Search for games..."
            className="sidebar-search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="sidebar-btn-group">
          <div className="sidebar-btn-container">
            <button className="sidebar-btn" onClick={() => navigate("/home")}>
              <FaHome />
              {isExpanded && <span>Home</span>}
            </button>
          </div>
          <div className="sidebar-btn-container">
            <button className="sidebar-btn" onClick={() => navigate("/sports")}>
              <FaFootballBall />
              {isExpanded && <span>Sports</span>}
            </button>
          </div>
        </div>

        <div className="group">
          <div
            className="section-title cursor-pointer flex justify-between items-center"
            onClick={() => toggleGroup("games")}
          >
            <span>Games</span>
            {isExpanded && (
              <span>{expandedGroups.games ? <HiChevronUp /> : <HiChevronDown />}</span>
            )}
          </div>
          <div className={`group-content ${expandedGroups.games ? "expanded" : "hidden"}`}>
            {filteredGames.map((game) => (
              <div className="sidebar-btn-container" key={game.name}>
                <button
                  className="sidebar-btn"
                  onClick={() => navigate(`/games/${game.name.toLowerCase()}`)}
                >
                  {game.icon}
                  {isExpanded && <span>{game.name}</span>}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="group">
          <div
            className="section-title cursor-pointer flex justify-between items-center"
            onClick={() => toggleGroup("wallet")}
          >
            <span>Wallet</span>
            {isExpanded && (
              <span>{expandedGroups.wallet ? <HiChevronUp /> : <HiChevronDown />}</span>
            )}
          </div>
          <div className={`group-content ${expandedGroups.wallet ? "expanded" : "hidden"}`}>
            {filteredWallet.map((wallet) => (
              <div className="sidebar-btn-container" key={wallet.name}>
                <button
                  className="sidebar-btn"
                  onClick={() => navigate(`/wallet/${wallet.name.toLowerCase()}`)}
                >
                  {wallet.icon}
                  {isExpanded && <span>{wallet.name}</span>}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="group">
          <div
            className="section-title cursor-pointer flex justify-between items-center"
            onClick={() => toggleGroup("rewards")}
          >
            <span>Rewards</span>
            {isExpanded && (
              <span>{expandedGroups.rewards ? <HiChevronUp /> : <HiChevronDown />}</span>
            )}
          </div>
          <div className={`group-content ${expandedGroups.rewards ? "expanded" : "hidden"}`}>
            {filteredRewards.map((reward) => (
              <div className="sidebar-btn-container" key={reward.name}>
                <button
                  className="sidebar-btn"
                  onClick={() => navigate(`/rewards/${reward.name.toLowerCase()}`)}
                >
                  {reward.icon}
                  {isExpanded && <span>{reward.name}</span>}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="group">
          <div
            className="section-title cursor-pointer flex justify-between items-center"
            onClick={() => toggleGroup("features")}
          >
            <span>Features</span>
            {isExpanded && (
              <span>{expandedGroups.features ? <HiChevronUp /> : <HiChevronDown />}</span>
            )}
          </div>
          <div className={`group-content ${expandedGroups.features ? "expanded" : "hidden"}`}>
            {filteredFeatures.map((feature) => (
              <div className="sidebar-btn-container" key={feature.name}>
                <button
                  className="sidebar-btn"
                  onClick={() => navigate(`/features/${feature.name.toLowerCase()}`)}
                >
                  {feature.icon}
                  {isExpanded && <span>{feature.name}</span>}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-btn-container">
          <button className="sidebar-btn" onClick={() => navigate("/support")}>
            <FaQuestionCircle />
            {isExpanded && <span>Support</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
