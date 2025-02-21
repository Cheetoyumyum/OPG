import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Games = () => {
  const navigate = useNavigate();
  const games = [
    {
      name: "Slayer Tower",
      image: "/games/Slayer-tower.webp",
      color: "bg-purple-500",
      route: "Slayer tower",
    },
    {
      name: "Plinko",
      image: "/games/plinko.webp",
      color: "bg-pink-500",
      route: "plinko",
    },
    {
      name: "Dice",
      image: "/games/dice.webp",
      color: "bg-green-500",
      route: "dice",
    },
    {
      name: "Keno",
      image: "/games/keno.webp",
      color: "bg-orange-500",
      route: "keno",
    },
    {
      name: "Limbo",
      image: "/games/limbo.webp",
      color: "bg-yellow-500",
      route: "limbo",
    },
    {
      name: "Mines",
      image: "/games/mines.webp",
      color: "bg-red-500",
      route: "mines",
    },
    {
      name: "Blackjack",
      image: "/games/blackjack.webp",
      color: "bg-red-700",
      route: "blackjack",
    },
    {
      name: "Slayer Tower",
      image: "/games/Slayer-tower.webp",
      color: "bg-purple-500",
      route: "Slayer tower",
    },
    {
      name: "Plinko",
      image: "/games/plinko.webp",
      color: "bg-pink-500",
      route: "plinko",
    },
    {
      name: "Dice",
      image: "/games/dice.webp",
      color: "bg-green-500",
      route: "dice",
    },
    {
      name: "Keno",
      image: "/games/keno.webp",
      color: "bg-orange-500",
      route: "keno",
    },
    {
      name: "Limbo",
      image: "/games/limbo.webp",
      color: "bg-yellow-500",
      route: "limbo",
    },
    {
      name: "Mines",
      image: "/games/mines.webp",
      color: "bg-red-500",
      route: "mines",
    },
    {
      name: "Blackjack",
      image: "/games/blackjack.webp",
      color: "bg-red-700",
      route: "blackjack",
    },
  ];

  const CustomArrow = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-full bg-[#1E1E1E] hover:bg-[#2A2A2A] transition-all duration-300`}
    >
      {direction === "left" ? (
        <HiChevronLeft className="w-5 h-5 text-white" />
      ) : (
        <HiChevronRight className="w-5 h-5 text-white" />
      )}
    </button>
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6.5,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1536,
        settings: { slidesToShow: 5.5 },
      },
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4.5 },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
    ],
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl md:text-2xl">🎮</span>
          <h2 className="text-xl md:text-2xl font-bold text-white">Games</h2>
        </div>
        <div className="flex items-center justify-end gap-4">
          <button className="px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
            View all
          </button>
          <div className="flex gap-2 ml-auto">
            <CustomArrow
              direction="left"
              onClick={() => document.querySelector(".slick-prev").click()}
            />
            <CustomArrow
              direction="right"
              onClick={() => document.querySelector(".slick-next").click()}
            />
          </div>
        </div>
      </div>

      <div className="[&_.slick-list]:!p-0">
        <Slider {...settings}>
          {games.map((game, index) => (
            <div key={index} className="px-2">
              <div
                onClick={() => navigate(`/games/${game.route}`)}
                className="relative group cursor-pointer rounded-xl md:rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 ${game.color} opacity-50`} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full aspect-[3/4] object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3
                    className="text-xl md:text-2xl font-bold text-white"
                    style={{ fontFamily: "Bebas Neue" }}
                  >
                    {game.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Games;
