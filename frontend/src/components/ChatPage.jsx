import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Plus, Send, Mic, Download, Play, Pause, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import API from '../context/api';

const ChatPage = () => {
  const { user, cropDetails } = useContext(UserContext);
  
  // Initialize with empty messages array
  const [displayedMessages, setDisplayedMessages] = useState([]);

  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
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

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDatePicker]);

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

      console.log('User object:', JSON.stringify(user, null, 2)); // Debug log
      console.log('User ID:', user.id); // Debug log

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
      setIsTyping(true);

      // Add typing indicator message
      const typingMessage = {
        id: 'typing-indicator',
        type: 'typing',
        content: '',
        sender: 'ai',
        timestamp: new Date(),
      };
      setDisplayedMessages(prev => [...prev, typingMessage]);
      
      try {
        // Get crop_id from cropDetails if available
        let cropId = null;
        console.log('Available crop details:', JSON.stringify(cropDetails, null, 2)); // Debug log
        
        if (cropDetails && Array.isArray(cropDetails) && cropDetails.length > 0) {
          // If cropDetails is an array, get the first crop's ID
          cropId = cropDetails[0]._id || cropDetails[0].id;
        } else if (cropDetails && typeof cropDetails === 'object') {
          // If cropDetails is an object, get its ID directly
          cropId = cropDetails._id || cropDetails.id;
        }
        
        // Ensure crop_id is a string if it exists, otherwise keep it null
        if (cropId) {
          cropId = String(cropId);
        }
        
        console.log('Using crop_id:', cropId); // Debug log
        console.log('API Base URL:', API.defaults.baseURL); // Debug log
        
        // Validate required fields
        if (!user.id || !currentMessage.trim()) {
          throw new Error('Missing required fields: farmer_id or query');
        }
        
        // Ensure farmer_id is a string
        const farmerId = String(user.id);
        
        console.log('Final farmer_id to send:', farmerId); // Debug log
        console.log('Sending request to:', '/chat/query'); // Debug log
        
        // Create request payload - only include crop_id if it's valid
        const requestPayload = {
          farmer_id: farmerId,
          query: currentMessage
        };
        
        if (cropId) {
          requestPayload.crop_id = cropId;
        }
        
        console.log('Request payload:', JSON.stringify(requestPayload, null, 2)); // Debug log

        // Send query to backend using the correct endpoint
        const response = await API.post('/chat/query', requestPayload);

        console.log('API Response:', JSON.stringify(response, null, 2)); // Debug log
        console.log('Response data:', JSON.stringify(response.data, null, 2)); // Debug log

        // Remove typing indicator
        setDisplayedMessages(prev => prev.filter(msg => msg.id !== 'typing-indicator'));
        
        // Add AI response to messages - updated to match new API response structure
        const aiResponse = {
          id: response.data.results._id,
          type: 'text',
          content: response.data.results.answer,
          sender: 'ai',
          timestamp: new Date(response.data.results.date),
        };
        
        setDisplayedMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('Error sending message:', error);
        console.error('Error response:', JSON.stringify(error.response, null, 2)); // Debug log
        console.error('Error message:', error.message); // Debug log
        
        // Remove typing indicator on error
        setDisplayedMessages(prev => prev.filter(msg => msg.id !== 'typing-indicator'));
        
        let errorMessage = 'Sorry, I encountered an error. Please try again.';
        
        if (error.response) {
          // Server responded with error status
          console.error('Server error status:', error.response.status);
          console.error('Server error data:', JSON.stringify(error.response.data, null, 2));
          
          if (error.response.status === 404) {
            errorMessage = 'Chat service not found. Please check if the backend is running.';
          } else if (error.response.status === 400) {
            const serverError = error.response.data?.error || 'Invalid request format';
            errorMessage = `${serverError}`;
            console.error('400 Error details:', JSON.stringify(error.response.data, null, 2));
          } else if (error.response.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          } else if (error.response.status === 401) {
            errorMessage = 'Authentication failed. Please login again.';
          } else {
            errorMessage = `Server error (${error.response.status}). Please try again.`;
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
          errorMessage = 'Unable to connect to server. Please check your connection.';
        }
        
        toast.error('Failed to send message. Please try again.');
        
        // Add error message to chat
        const errorMsg = {
          id: Date.now() + 1,
          type: 'text',
          content: errorMessage,
          sender: 'ai',
          timestamp: new Date(),
        };
        setDisplayedMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsSending(false);
        setIsTyping(false);
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
            sender: 'ai',
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
    const isAI = message.sender === 'ai' || message.sender === 'llm';
    
    return (
      <div 
        key={message.id} 
        data-message-id={message.id}
        className={`flex mb-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div 
          className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
            isUser 
              ? 'bg-[#365949] text-white rounded-br-md' 
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
          }`}
        >
          {message.type === 'typing' && (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-gray-500">AI is typing...</span>
            </div>
          )}

          {message.type === 'text' && (
            <div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 ${isUser ? 'text-green-100' : 'text-gray-500'}`}>
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
              <p className={`text-xs ${isUser ? 'text-green-100' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          )}
          
          {message.type === 'file' && (
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isUser ? 'bg-[#2d4a3a]' : 'bg-gray-200'
                }`}>
                  <Download className="w-5 h-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{message.content}</p>
                <p className={`text-xs ${isUser ? 'text-green-100' : 'text-gray-500'}`}>
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
                      ? 'bg-green-400 hover:bg-green-300' 
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
                    isUser ? 'bg-green-400' : 'bg-gray-300'
                  }`}>
                    <div className={`h-full rounded-full transition-all duration-300 ${
                      isUser ? 'bg-green-200' : 'bg-gray-500'
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
                    isUser ? 'text-green-100' : 'text-gray-600'
                  }`}>
                    <span className={`font-medium ${
                      isUser ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      Transcribed:
                    </span>
                    {' "' + message.transcription + '"'}
                  </p>
                </div>
              )}
              
              {/* Timestamp */}
              <p className={`text-xs ${isUser ? 'text-green-100' : 'text-gray-500'}`}>
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

  // Add custom CSS for animations
  const customStyles = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); opacity: 0.7; }
        40% { transform: scale(1); opacity: 1; }
      }
      .animate-bounce {
        animation: bounce 1.4s infinite;
      }
    </style>
  `;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      <div className="max-w-4xl mx-auto p-4 md:p-6 flex flex-col" style={{ height: 'calc(100vh - 6rem)' }}>
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm p-4 md:p-6 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-[#365949]">AI Chat Assistant</h1>
              {cropDetails && (
                <p className="text-sm text-gray-600 mt-1">
                  {Array.isArray(cropDetails) && cropDetails.length > 0 
                    ? `Discussing: ${cropDetails[0].crop_type || cropDetails[0].name || 'Your crop'}`
                    : cropDetails.crop_type || cropDetails.name || 'Your crop'
                  }
                </p>
              )}
            </div>
            
            {/* Date Navigation */}
            <div className="flex items-center space-x-3">
              <div className="relative date-picker-container">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-[#365949] hover:bg-[#2d4a3a] text-white rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-medium hidden sm:inline">Jump to Date</span>
                </button>
                
                {/* Date Picker Dropdown */}
                {showDatePicker && messageGroups.length > 0 && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-10 min-w-[200px]">
                    <div className="max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 px-3 py-2">Available Dates</div>
                        {messageGroups.map((group) => (
                          <button
                            key={group.date}
                            onClick={() => scrollToDate(group.date)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                          >
                            {formatDate(group.date)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-b-xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
          {/* Chat Messages Area */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
          >
            {/* Loading Spinner */}
            {isLoadingOlder && (
              <div className="flex justify-center py-6">
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-gray-300 border-t-[#365949] rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
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
                <div className="space-y-4">
                  {group.messages.map(renderMessage)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Footer */}
          <div className="border-t border-gray-100 bg-white p-4 md:p-6 flex-shrink-0">
            <div className="flex items-end space-x-4">
              {/* Input Field Container */}
              <div className="flex-1 relative">
                <div className="flex items-end bg-gray-50 rounded-2xl border-2 border-gray-100 focus-within:border-[#365949] focus-within:bg-white transition-all">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isSending ? "Sending..." : "Ask me anything about farming..."}
                    rows="1"
                    disabled={isSending}
                    className="flex-1 bg-transparent px-6 py-4 text-sm resize-none outline-none max-h-32 min-h-[3rem] disabled:opacity-50 placeholder:text-gray-400"
                    style={{ 
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#CBD5E0 transparent' 
                    }}
                  />
                  
                  {/* Microphone Button */}
                  <button
                    onClick={toggleRecording}
                    className={`flex-shrink-0 w-10 h-10 mx-3 mb-2 rounded-full flex items-center justify-center transition-all ${
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
                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all transform hover:scale-105 ${
                  newMessage.trim() && !isSending
                    ? 'bg-[#365949] hover:bg-[#2d4a3a] text-white shadow-md hover:shadow-lg'
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
        </div>
        </div>
      </div>
    </>


  );
};export default ChatPage;