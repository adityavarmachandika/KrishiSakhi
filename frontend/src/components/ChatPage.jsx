import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Plus, Send, Mic, Download, Play, Pause, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import API from '../context/api';
const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY;
const SARVAM_API_URL = "https://api.sarvam.ai/speech-to-text-translate";

// Translation function using MyMemory API (free translation service)
const translateToMalayalam = async (text) => {
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ml`);
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    
    // Fallback: return original text if translation fails
    console.warn('Translation failed, using original text');
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    toast.warning('Translation service unavailable, proceeding with English text');
    return text;
  }
};

const ChatPage = () => {
  const { user, cropDetails } = useContext(UserContext);
  
  // Initialize with empty messages array
  const [displayedMessages, setDisplayedMessages] = useState([]);

  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
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
    // Don't auto-scroll when loading older messages or initial chat history
    if (!isLoadingOlder) {
      const lastMessage = displayedMessages[displayedMessages.length - 1];

      const isNewMessage = lastMessage && (
        (lastMessage.sender === 'user' && !lastMessage.id.toString().includes('-question')) ||
        (lastMessage.sender === 'ai' && !lastMessage.id.toString().includes('-answer') && lastMessage.type !== 'typing')
      );
      
      if (isNewMessage) {
        setTimeout(() => scrollToBottom(), 100); // Small delay to ensure render
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

  // Fetch previous chats when component mounts
  useEffect(() => {
    const fetchPreviousChats = async () => {
      if (!user?.id) return;

      try {
        setIsLoadingOlder(true);
        console.log('Fetching previous chats for user:', user.id);
        
        const response = await API.get(`/chat/fetch_all_queries/${user.id}`);
        console.log('Previous chats response:', response.data);

        if (response.data.success && response.data.data) {
          const previousChats = [];
          
          response.data.data.forEach(chat => {
            // Add user question
            previousChats.push({
              id: `${chat._id}-question`,
              type: 'text',
              content: chat.question,
              sender: 'user',
              timestamp: new Date(chat.date),
            });
            
            // Add AI response immediately after the question
            previousChats.push({
              id: `${chat._id}-answer`,
              type: 'text',
              content: chat.answer || 'No response available',
              sender: 'ai',
              timestamp: new Date(chat.date),
            });
          });

          setDisplayedMessages(previousChats);
          console.log('Loaded previous chats:', previousChats.length, 'messages');
        }
      } catch (error) {
        console.error('Error fetching previous chats:', error);
      } finally {
        setIsLoadingOlder(false);
      }
    };

    fetchPreviousChats();
  }, [user?.id]); // Only run when user.id changes

  // Cleanup effect for microphone resources
  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      // Clear any audio chunks
      setAudioChunks([]);
    };
  }, [mediaRecorder]);

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


    const formatLLMResponse = (response) => {
    if (!response) return response;
    
    let formatted = response;
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    
    // Convert numbered lists (1. text) to proper HTML lists
    const numberedListRegex = /^(\d+\.\s+.+)(?:\n(\d+\.\s+.+))*$/gm;
    formatted = formatted.replace(/(\n|^)(\d+\.\s+.+(?:\n\d+\.\s+.+)*)/g, (match, prefix, listContent) => {
        const items = listContent.split('\n').map(item => {
            const cleaned = item.replace(/^\d+\.\s+/, '');
            return `<li>${cleaned}</li>`;
        }).join('');
        return `${prefix}<ol>${items}</ol>`;
    });
    
    // Convert bullet points (- text or • text) to proper HTML lists
    const bulletListRegex = /(\n|^)([-•]\s+.+(?:\n[-•]\s+.+)*)/g;
    formatted = formatted.replace(bulletListRegex, (match, prefix, listContent) => {
        const items = listContent.split('\n').map(item => {
            const cleaned = item.replace(/^[-•]\s+/, '');
            return cleaned ? `<li>${cleaned}</li>` : '';
        }).filter(item => item).join('');
        return items ? `${prefix}<ul>${items}</ul>` : match;
    });
    
    // Convert line breaks to <br> tags
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Clean up extra <br> tags around lists
    formatted = formatted.replace(/<br><ol>/g, '<ol>');
    formatted = formatted.replace(/<\/ol><br>/g, '</ol>');
    formatted = formatted.replace(/<br><ul>/g, '<ul>');
    formatted = formatted.replace(/<\/ul><br>/g, '</ul>');
    
    return formatted;
}; 
  
  const sendMessage = async () => {
    if (newMessage.trim() && !isSending) {
      if (!user?.id) {
        toast.error('Please login to send messages');
        return;
      }

      console.log('User object:', JSON.stringify(user, null, 2)); // Debug log
      console.log('User ID:', user.id); // Debug log

      const currentMessage = newMessage;
      setNewMessage('');
      setIsSending(true);
      setIsTyping(true);

      // Translate message to Malayalam
      let translatedMessage = '';
      try {
        translatedMessage = await translateToMalayalam(currentMessage);
        console.log('Original message:', currentMessage);
        console.log('Translated to Malayalam:', translatedMessage);
      } catch (error) {
        console.error('Translation failed:', error);
        translatedMessage = currentMessage; // Fallback to original
      }

      const userMessage = {
        id: Date.now(),
        type: 'text',
        content: currentMessage,
        translatedContent: translatedMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setDisplayedMessages(prev => [...prev, userMessage]);

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
          query: currentMessage,
          translated_query: translatedMessage // Add Malayalam translation
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
        
        console.log('Original AI response:', response.data.results.answer);
        console.log('Translated AI response from backend:', response.data.results.translated_answer);
        
        // Add AI response to messages - updated to match new API response structure
        const aiResponse = {
          id: response.data.results._id,
          type: 'text',
          content: response.data.results.answer,
          translatedContent: response.data.results.translated_answer || response.data.results.answer,
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


  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 48000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true
          } 
        });
        
        // Use webm format but we'll send as mp4
        const recorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        
        const chunks = [];
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          await processAudioForSpeechToText(audioBlob);
          
          // Stop all tracks to release microphone
          stream.getTracks().forEach(track => track.stop());
        };
        
        recorder.start();
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
        setIsRecording(true);
        
        toast.success('Recording started...');
        
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast.error('Could not access microphone. Please check permissions.');
      }
    } else {
      // Stop recording
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setIsRecording(false);
        toast.info('Processing audio...');
      }
    }
  };

  const processAudioForSpeechToText = async (audioBlob) => {
    try {
      // Debug logging for API key
      console.log('SARVAM_API_KEY loaded:', SARVAM_API_KEY ? 'YES' : 'NO');
      console.log('API Key length:', SARVAM_API_KEY ? SARVAM_API_KEY.length : 0);
      
      // Check if API key is configured
      if (!SARVAM_API_KEY || SARVAM_API_KEY === "YOUR_SARVAM_API_KEY_HERE") {
        toast.error('Sarvam AI API key not configured. Please add your API key to enable speech-to-text.');
        console.error('Please configure VITE_SARVAM_API_KEY in your .env file');
        return;
      }

      // Create FormData for the API request
      const formData = new FormData();
      
      // Convert webm to a file-like object that can be sent as mp4
      // Note: The API expects mp4, but we're sending webm with mp4 filename
      const audioFile = new File([audioBlob], 'recording.mp4', { 
        type: 'audio/mp4' 
      });
      
      formData.append("file", audioFile);
      
      // Speech To Text Translate API call
      const response = await fetch(SARVAM_API_URL, {
        method: "POST",
        headers: {
          "api-subscription-key": SARVAM_API_KEY
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Speech-to-text result:', result);
      
      // Extract transcribed text from the API response
      // The API response structure may vary, so we try multiple possible fields
      const transcribedText = result.transcript || result.text || result.translated_text || '';
      
      if (transcribedText) {
        // Translate transcribed text to Malayalam
        let translatedTranscription = '';
        try {
          translatedTranscription = await translateToMalayalam(transcribedText);
          console.log('Original transcription:', transcribedText);
          console.log('Translated transcription to Malayalam:', translatedTranscription);
        } catch (error) {
          console.error('Transcription translation failed:', error);
          translatedTranscription = transcribedText; // Fallback to original
        }

        // Add voice message to chat
        const voiceMessage = {
          id: Date.now(),
          type: 'voice',
          content: URL.createObjectURL(audioBlob),
          transcription: transcribedText,
          translatedTranscription: translatedTranscription,
          sender: 'user',
          timestamp: new Date(),
        };
        
        setDisplayedMessages(prev => [...prev, voiceMessage]);
        
        // Set the transcribed text in the input field for user to review/edit
        setNewMessage(transcribedText);
        
        toast.success('Voice transcribed and translated! You can edit the text before sending.');
      } else {
        console.warn('No transcript found in API response:', result);
        toast.error('Could not transcribe audio. Please try speaking clearly.');
      }
      
    } catch (error) {
      console.error('Error processing audio:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        toast.error('Authentication failed. Please check your Sarvam AI API key.');
      } else if (error.message.includes('429')) {
        toast.error('API rate limit exceeded. Please try again later.');
      } else {
        toast.error('Error processing voice message. Please try again.');
      }
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
              {/* Show Malayalam first, then English */}
              {message.translatedContent && message.translatedContent !== message.content && (
                <div className="mb-2">
                  <p className={`text-xs font-medium mb-1 ${
                    isUser ? 'text-green-200' : 'text-gray-600'
                  }`}>
                    മലയാളം (Malayalam):
                  </p>
                  <div 
                    className="text-sm leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: formatLLMResponse(message.translatedContent) }}
                  />
                </div>
              )}
              
              <div className={message.translatedContent && message.translatedContent !== message.content ? "mt-2 pt-2 border-t" : ""} style={{
                borderColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
              }}>
                {message.translatedContent && message.translatedContent !== message.content && (
                  <p className={`text-xs font-medium mb-1 ${
                    isUser ? 'text-green-200' : 'text-gray-600'
                  }`}>
                    English:
                  </p>
                )}
                <div 
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatLLMResponse(message.content) }}
                />
              </div>
              
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
                  {/* Malayalam Translation */}
                  {message.translatedTranscription && message.translatedTranscription !== message.transcription && (
                    <div className="mb-2">
                      <p className={`text-xs font-medium mb-1 ${
                        isUser ? 'text-green-200' : 'text-gray-600'
                      }`}>
                        മലയാളം (Malayalam):
                      </p>
                      <div className={`text-sm leading-relaxed ${
                        isUser ? 'text-green-100' : 'text-gray-600'
                      }`}>
                        "<span dangerouslySetInnerHTML={{ __html: formatLLMResponse(message.translatedTranscription) }}></span>"
                      </div>
                    </div>
                  )}
                  
                  {/* English Transcription */}
                  <div className={message.translatedTranscription && message.translatedTranscription !== message.transcription ? "mt-2 pt-2 border-t" : ""} style={{
                    borderColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                  }}>
                    <div className={`text-sm leading-relaxed ${
                      isUser ? 'text-green-100' : 'text-gray-600'
                    }`}>
                      <span className={`font-medium ${
                        isUser ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.translatedTranscription && message.translatedTranscription !== message.transcription ? 'English: ' : 'Transcribed: '}
                      </span>
                      "<span dangerouslySetInnerHTML={{ __html: formatLLMResponse(message.transcription) }}></span>"
                    </div>
                  </div>
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
            {isLoadingOlder && displayedMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-gray-300 border-t-[#365949] rounded-full animate-spin mb-3"></div>
                <p className="text-gray-500 text-sm">Loading your chat history...</p>
              </div>
            )}

            {/* Empty state when no messages */}
            {!isLoadingOlder && displayedMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-[#365949] rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Start a conversation</h3>
                <p className="text-gray-500 text-sm">Ask me anything about farming, crops, or agricultural practices!</p>
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