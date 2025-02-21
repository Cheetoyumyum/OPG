import React, { useState, useEffect } from "react";
import LiveBets from "./LiveBets";
import Games from "../views/Games";
import NavBar from "../components/NavBar";

const Home = () => {
  const [betsFilter, setBetsFilter] = useState("All Bets");
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchRandomImages = async () => {
      const carouselData = await Promise.all(
        Array.from({ length: isMobile ? 5 : 10 }).map(() =>
          fetch("https://picsum.photos/600/300?random").then(
            (response) => response.url
          )
        )
      );
      setCarouselImages(carouselData);
    };

    fetchRandomImages();
  }, [isMobile]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <div className="home-view flex flex-col min-h-full">
      <div className="flex-1">
        <div
          className={`carousel-container ${isMobile ? "mobile-carousel" : ""}`}
        >
          <div className="carousel">
            {carouselImages.length > 0 && (
              <div className="carousel-item">
                <img
                  src={carouselImages[currentIndex]}
                  alt={`Promo ${currentIndex + 1}`}
                  style={{
                    width: "100%",
                    height: isMobile ? "200px" : "300px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}
          </div>
          <div className="carousel-navigation">
            <button
              className="prev-button"
              onClick={handlePrev}
              style={{ opacity: isMobile ? 0.8 : 1 }}
            >
              &#10094;
            </button>
            <button
              className="next-button"
              onClick={handleNext}
              style={{ opacity: isMobile ? 0.8 : 1 }}
            >
              &#10095;
            </button>
          </div>
          <div className="carousel-dots">
            {carouselImages.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: isMobile ? "8px" : "10px",
                  height: isMobile ? "8px" : "10px",
                  margin: isMobile ? "0 4px" : "0 5px",
                }}
              />
            ))}
          </div>
        </div>

        <Games />

        <div className="px-4 mt-6 mb-6">
          <LiveBets
            filter={betsFilter}
            setFilter={setBetsFilter}
            isMobile={isMobile}
          />
        </div>
      </div>
      {isMobile && <div className="h-16" />} {/* Spacer for mobile nav */}
    </div>
  );
};

export default Home;
