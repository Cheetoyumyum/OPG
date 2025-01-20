import React, { useState, useEffect, useRef } from 'react';
import { FaArrowAltCircleUp } from 'react-icons/fa';

const Chat = ({ isOpen, loggedInUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState(0);
  const [showRainBanner, setShowRainBanner] = useState(false);
  const [rainTime, setRainTime] = useState(30);
  const [autoscroll, setAutoscroll] = useState(true);

  const currentUser = loggedInUser || 'Guest'; // Set values; currently for visual testing
  const chatMessagesRef = useRef(null);

  const handleRainClick = () => {
    setShowRainBanner(true);
    setRainTime(30);
  };

  useEffect(() => {
    if (showRainBanner) {
      const countdown = setInterval(() => {
        setRainTime((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setShowRainBanner(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [showRainBanner]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: currentUser, text: message },
      ]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (autoscroll) {
      scrollToBottom();
      setNewMessages(0);
    } else {
      setNewMessages((prev) => prev + 1); 
    }
  }, [messages, autoscroll]);

  const handleScroll = () => {
    if (chatMessagesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isAtBottom) {
        setAutoscroll(true);
        setNewMessages(0);
      } else {
        setAutoscroll(false);
      }
    }
  };

  const resumeAutoscroll = () => {
    setAutoscroll(true);
    scrollToBottom();
  };

  return (
    <div className={`chat ${isOpen ? 'expanded' : ''}`}>
      {showRainBanner && (
        <div className="rain-banner">Rain is happening in {rainTime}s!</div>
      )}
      <div className="chat-header">
        <span className="online-count">💬 100 Users Online</span>
        <button onClick={handleRainClick} className="rain-btn">
          Tip Rain 💰
        </button>
      </div>
      <div
        className="chat-messages"
        ref={chatMessagesRef}
        onScroll={handleScroll}
        style={{ overflowY: 'auto', height: '300px', position: 'relative' }}
      >
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span className="username">{msg.user}: </span>
            <span className="message-text">{msg.text}</span>
          </div>
        ))}
        {!autoscroll && newMessages > 0 && (
          <button
            className="resume-autoscroll"
            onClick={resumeAutoscroll}
          >
            {newMessages} new messages
          </button>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSendMessage}>
          <FaArrowAltCircleUp />
        </button>
      </div>
    </div>
  );
};

export default Chat;
