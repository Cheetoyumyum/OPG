const Footer = () => {
    return (
      <footer className="p-4 bg-[#121212] border-t border-[#2a2e38] text-center text-sm text-[#1ffdb0]">
        <div className="max-w-screen-xl mx-auto">
          <h1 className=" text-4xl font-bold relative mb-6 break-after-auto" style={{ fontFamily: 'Bebas Neue' }}>
            <span
              className="text-transparent bg-clip-text bg-gradient-to-b from-[#1ffdb0] to-[#1fae9a]"
            >
              OP
            </span>
            <span
              className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] to-[#e3e3e3]"
            >
              DUEL
            </span>
          </h1>
          <div>© {new Date().getFullYear()} OPDUEL. All rights reserved.</div>
          <div className="mt-1 text-xs">OPDUEL is not affiliated or endorsed by any gaming companies.</div>
  
          <div className="flex justify-center mt-2 gap-16 flex-wrap">
            <div className="text-left">
              <div className="font-bold text-[#1ffdb0]">Games</div>
              <a href="/dice" className="text-white hover:text-[#1ffdb0]">Dice</a><br />
              <a href="/mines" className="text-white hover:text-[#1ffdb0]">Mines</a><br />
              <a href="/plinko" className="text-white hover:text-[#1ffdb0]">Plinko</a><br />
              <a href="/roulette" className="text-white hover:text-[#1ffdb0]">Roulette</a><br />
            </div>
  
            <div className="text-left">
              <div className="font-bold text-[#1ffdb0]">Support</div>
              <a href="/fairness" className="text-white hover:text-[#1ffdb0]">Fairness</a><br />
              <a href="/live-support" className="text-white hover:text-[#1ffdb0]">Live Support</a><br />
            </div>
  
            <div className="text-left">
              <div className="font-bold text-[#1ffdb0]">Community</div>
              <a href="https://discord.gg/opduelop" target="_blank" className="text-white hover:text-[#1ffdb0]">Discord</a><br />
              <a href="https://www.twitch.tv/opduel" target="_blank" className="text-white hover:text-[#1ffdb0]">Twitch</a><br />
            </div>
  
            <div className="text-left">
              <div className="font-bold text-[#1ffdb0]">About Us</div>
              <a href="/terms" className="text-white hover:text-[#1ffdb0]">Terms of Service</a><br />
              <a href="/privacy" className="text-white hover:text-[#1ffdb0]">Privacy Policy</a><br />
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  