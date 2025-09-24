import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Plus, Send, Mic, Download, Play, Pause, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import API from '../context/api';

const ChatPage = () => {
  const { user } = useContext(UserContext);
  
  // Initialize with empty messages array
  const [displayedMessages, setDisplayedMessages] = useState([]);

  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const dateRefs = useRef({});
  const scrollPositionRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDate = (dateString) => {
    const dateRef = dateRefs.current[dateString];
    if (dateRef) {
      dateRef.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest' 
      });
      setShowDatePicker(false);
    }
  };

  const loadOlderMessages = useCallback(async () => {
    // For now, we'll disable loading older messages since we're starting fresh
    // You can implement this later by fetching historical queries from the backend
    return;
  }, []);

  // Infinite scroll detection
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop } = container;
      
      // If scrolled near the top (within 100px), load more messages
      if (scrollTop < 100 && !isLoadingOlder) {
        loadOlderMessages();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadOlderMessages, isLoadingOlder]);

  useEffect(() => {
    // Only auto-scroll to bottom for new messages sent by user or received responses
    // Don't auto-scroll when loading older messages
    if (!isLoadingOlder) {
      const lastMessage = displayedMessages[displayedMessages.length - 1];
      const isRecentMessage = lastMessage && new Date() - new Date(lastMessage.timestamp) < 5000; // Within 5 seconds
      
      if (isRecentMessage) {
        scrollToBottom();
      }
    }
  }, [displayedMessages, isLoadingOlder]);

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  const getAvailableDates = () => {
    const messageGroups = groupMessagesByDate(displayedMessages);
    return messageGroups.map(group => ({
      dateString: group.date,
      displayName: formatDate(group.date)
    }));
  };

  const sendMessage = async () => {
    if (newMessage.trim() && !isSending) {
      if (!user?.id) {
        toast.error('Please login to send messages');
        return;
      }

      const userMessage = {
        id: Date.now(),
        type: 'text',
        content: newMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setDisplayedMessages(prev => [...prev, userMessage]);
      const currentMessage = newMessage;
      setNewMessage('');
      setIsSending(true);
      
      try {
        // Send query to backend
        const response = await API.post('/query', {
          farmer_id: user.id,
          crop_id: null, // You can add crop_id logic if needed
          question: currentMessage
        });

        // Add AI response to messages
        const aiResponse = {
          id: response.data.id,
          type: 'text',
          content: response.data.answer,
          sender: 'llm',
          timestamp: new Date(response.data.date),
        };
        
        setDisplayedMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message. Please try again.');
        
        // Add error message to chat
        const errorMessage = {
          id: Date.now() + 1,
          type: 'text',
          content: 'Sorry, I encountered an error. Please try again.',
          sender: 'llm',
          timestamp: new Date(),
        };
        setDisplayedMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateMockTranscription = () => {
    const mockTranscriptions = [
      "Hello, how are you doing today?",
      "Can you help me with this project?",
      "What's the weather like tomorrow?",
      "I need some advice on this matter.",
      "Could you explain this concept to me?",
      "Thanks for your help with everything.",
      "I'm really excited about this opportunity.",
      "Let me know what you think about this.",
      "I have a question about the requirements.",
      "This looks great, let's proceed with it."
    ];
    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  };

  const generateLLMResponseToVoice = (transcription) => {
    const responses = {
      "Hello, how are you doing today?": "I'm doing well, thank you for asking! How can I help you today?",
      "Can you help me with this project?": "Of course! I'd be happy to help you with your project. What specific assistance do you need?",
      "What's the weather like tomorrow?": "I don't have access to real-time weather data, but you can check your local weather app for tomorrow's forecast!",
      "I need some advice on this matter.": "I'm here to help with advice! Please share more details about what you'd like guidance on.",
      "Could you explain this concept to me?": "Absolutely! I'd be glad to explain any concept. Which topic would you like me to clarify?",
      "Thanks for your help with everything.": "You're very welcome! I'm always happy to help. Let me know if you need anything else.",
      "I'm really excited about this opportunity.": "That's wonderful to hear! Excitement often leads to great outcomes. Tell me more about this opportunity.",
      "Let me know what you think about this.": "I'd be happy to share my thoughts! Could you provide more context about what you'd like my opinion on?",
      "I have a question about the requirements.": "Great! I'm here to help clarify any requirements. What specific question do you have?",
      "This looks great, let's proceed with it.": "Excellent! I'm glad you're satisfied with it. Let's move forward - what's the next step?"
    };
    
    return responses[transcription] || "Thank you for your voice message! I understand what you're saying and I'm here to help.";
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        const mockTranscription = generateMockTranscription();
        const voiceMessage = {
          id: Date.now(),
          type: 'voice',
          content: 'voice-recording.mp3',
          transcription: mockTranscription,
          sender: 'user',
          timestamp: new Date(),
        };
        setDisplayedMessages(prev => [...prev, voiceMessage]);
        
        // Generate LLM response to voice message
        setTimeout(() => {
          const llmResponse = {
            id: Date.now() + 1,
            type: 'text',
            content: generateLLMResponseToVoice(mockTranscription),
            sender: 'llm',
            timestamp: new Date(),
          };
          setDisplayedMessages(prev => [...prev, llmResponse]);
        }, 1500);
      }, 2000);
    }
  };

  const toggleAudioPlayback = (messageId) => {
    if (playingAudio === messageId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(messageId);
      setTimeout(() => setPlayingAudio(null), 3000);
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const message = {
          id: Date.now(),
          type: file.type.startsWith('image/') ? 'image' : 'file',
          content: file.type.startsWith('image/') 
            ? URL.createObjectURL(file) 
            : file.name,
          sender: 'user',
          timestamp: new Date(),
        };
        setDisplayedMessages(prev => [...prev, message]);
      }
    };
    input.click();
  };

  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    
    return (
      <div 
        key={message.id} 
        data-message-id={message.id}
        className={`flex mb-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div 
          className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
            isUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          }`}
        >
          {message.type === 'text' && (
            <div>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          )}
          
          {message.type === 'image' && (
            <div>
              <img 
                src={message.content} 
                alt="Shared image" 
                className="rounded-lg max-w-full h-auto mb-2"
              />
              <p className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          )}
          
          {message.type === 'file' && (
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isUser ? 'bg-blue-400' : 'bg-gray-200'
                }`}>
                  <Download className="w-5 h-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{message.content}</p>
                <p className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          )}
          
          {message.type === 'voice' && (
            <div className="space-y-3">
              {/* Audio Player */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleAudioPlayback(message.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isUser 
                      ? 'bg-blue-400 hover:bg-blue-300' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {playingAudio === message.id ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className={`w-24 h-2 rounded-full ${
                    isUser ? 'bg-blue-400' : 'bg-gray-300'
                  }`}>
                    <div className={`h-full rounded-full transition-all duration-300 ${
                      isUser ? 'bg-blue-200' : 'bg-gray-500'
                    } ${playingAudio === message.id ? 'w-1/3' : 'w-0'}`} />
                  </div>
                </div>
              </div>
              
              {/* Transcription */}
              {message.transcription && (
                <div className="border-t pt-2" style={{
                  borderColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                }}>
                  <p className={`text-sm leading-relaxed ${
                    isUser ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    <span className={`font-medium ${
                      isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      Transcribed:
                    </span>
                    {' "' + message.transcription + '"'}
                  </p>
                </div>
              )}
              
              {/* Timestamp */}
              <p className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const messageGroups = groupMessagesByDate(displayedMessages);
  const availableDates = getAvailableDates();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header with Date Picker */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Chat</h1>
          
          {/* Date Picker Button */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Jump to Date</span>
            </button>
            
            {/* Date Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                  Select a date
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {availableDates.map((date) => (
                    <button
                      key={date.dateString}
                      onClick={() => scrollToDate(date.dateString)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {date.displayName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {/* Loading Spinner */}
        {isLoadingOlder && (
          <div className="flex justify-center py-6 animate-fade-in">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="animate-fade-in">
            {/* Date Divider */}
            <div 
              ref={(el) => {
                if (el) dateRefs.current[group.date] = el;
              }}
              className="flex items-center justify-center my-6"
            >
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="px-4 py-2 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                {formatDate(group.date)}
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            
            {/* Messages for this date */}
            <div>
              {group.messages.map(renderMessage)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Footer */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-end space-x-3">
          {/* Add Files Button */}
          <button
            onClick={handleFileUpload}
            className="flex-shrink-0 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>

          {/* Input Field Container */}
          <div className="flex-1 relative">
            <div className="flex items-end bg-gray-100 rounded-xl border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isSending ? "Sending..." : "Type a message..."}
                rows="1"
                disabled={isSending}
                className="flex-1 bg-transparent px-4 py-3 text-sm resize-none outline-none max-h-32 min-h-[2.5rem] disabled:opacity-50"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E0 transparent' 
                }}
              />
              
              {/* Microphone Button */}
              <button
                onClick={toggleRecording}
                className={`flex-shrink-0 w-8 h-8 mx-2 mb-2 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              newMessage.trim() && !isSending
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Click outside to close date picker */}
      {showDatePicker && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDatePicker(false)}
        />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;