import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../redux/chatSlice';
import { motion, AnimatePresence } from 'framer-motion';
import userImage from '../assets/userimage.png';
import robotImage from '../assets/robot.png';
import backgroundImage from '../assets/bgimage.jpg';
import { FiSend } from 'react-icons/fi';
import { suggestions, uiText } from '../data/textData';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messages = useSelector((state: { chat: { messages: Message[] } }) => state.chat.messages);
  const dispatch = useDispatch();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (message: string) => {
    if (message.trim() === '') return;

    dispatch(addMessage({ sender: 'user', text: message }));
    setUserInput('');
    setIsTyping(true);

    setTimeout(async () => {
      const response = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      dispatch(addMessage({ sender: 'ai', text: data.message }));
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col bg-white rounded-lg shadow-lg w-full max-w-md h-[90vh]">
        <div className="bg-black text-white p-4 text-center font-bold text-lg">{uiText.header}</div>
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4"
          style={{ maxHeight: 'calc(100% - 120px)' }}
        >
          <AnimatePresence>
            {messages.map((msg: Message, index: number) => (
              <motion.div
                key={index}
                className={`my-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 10 }}
              >
                <div className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && <img src={robotImage} alt="AI Robot" className="w-8 h-8 mr-2" />}
                  <div
                    className={`relative inline-block p-3 rounded-lg max-w-xs transition-all duration-300 ${
                      msg.sender === 'user'
                        ? 'bg-green-500 text-white rounded-br-lg rounded-tl-lg'
                        : 'bg-white text-black border border-gray-300 rounded-bl-lg rounded-tr-lg'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && <img src={userImage} alt="User" className="w-8 h-8 rounded-full ml-2" />}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                className="flex items-center my-2 animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <img src={robotImage} alt="AI Robot" className="w-8 h-8 mr-2" />
                <div className="inline-block p-2 rounded-lg bg-gray-300 text-black">{uiText.aiTyping}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-gray-100 p-2 border-t border-gray-300">
          <div className="text-sm font-semibold mb-2">{uiText.recentlyAsked}</div>
          <div className="flex space-x-2 overflow-x-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-gray-500 text-white px-3 py-1 rounded-full hover:bg-slate-700 transition flex-shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(userInput);
          }}
          className="p-4 flex border-t border-gray-300"
          style={{ maxHeight: '10vh' }}
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={uiText.placeholder}
            style={{ minWidth: '0px' }}
          />
          <button
            type="submit"
            className="ml-2 bg-black text-white rounded-full p-2 hover:bg-gray-800 transition duration-200 flex justify-center items-center"
            style={{ minWidth: '40px', maxWidth: '50px', width: 'fit-content' }}
          >
            <FiSend size={20} color="white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
