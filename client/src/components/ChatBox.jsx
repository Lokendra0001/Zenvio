import React, { useEffect, useRef, useState } from "react";
import { Mic, Sparkles, ArrowUp, Square, AlertCircle } from "lucide-react";
import logo from "../assests/images/logo3.png";
import axios from "axios";
import serverObj from "../config/serverObj";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ChatBox = () => {
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [micError, setMicError] = useState(null);
  const { serverURL } = serverObj;
  const messageEndRef = useRef(null);
  const textareaRef = useRef(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Handle microphone errors
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setMicError("Speech recognition is not supported in your browser");
    } else if (!isMicrophoneAvailable) {
      setMicError("Microphone is not available or permission denied");
    } else {
      setMicError(null);
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  const handleVoiceToText = async () => {
    if (!browserSupportsSpeechRecognition || !isMicrophoneAvailable) {
      return;
    }

    try {
      if (listening) {
        SpeechRecognition.stopListening();
      } else {
        resetTranscript();
        await SpeechRecognition.startListening({ 
          continuous: true, 
          language: "en-US" 
        });
      }
    } catch (error) {
      console.error("Microphone error:", error);
      setMicError("Failed to access microphone. Please check permissions.");
    }
  };

  // Keep transcript synced to input when mic is active
  useEffect(() => {
    if (listening) {
      setInputVal(transcript);
    }
  }, [transcript, listening]);

  // Auto-scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
      setIsMultiLine(textarea.scrollHeight > 40);
    }
  }, [inputVal]);

  return (
    <div className="h-full flex flex-col text-zinc-100 rounded-xl overflow-hidden pt-3">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-scroll p-1 sm:p-4 space-y-6 lg:px-25">
        {/* Empty state */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <Sparkles size={28} className="text-white" />
              </div>
            </div>
            <p className="text-lg font-medium mb-1">
              How can I help you today?
            </p>
            <p className="text-center text-zinc-500 text-sm max-w-md">
              Ask anything or try typing "What can you do?" to get started.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } group`}
            >
              <div
                className={`rounded-xl px-3 py-1 ${
                  message.role === "user"
                    ? "bg-[#303030bd] rounded-tr-none max-w-[80%] lg:max-w-lg xl:max-w-xl"
                    : "rounded-tl-none xl:max-w-full"
                }`}
              >
                <p
                  className={`break-words whitespace-pre-line text-[14.5px] tracking-wide ${
                    message?.color && "text-red-400"
                  }`}
                >
                  {message?.color ? <>😕 {message.text}</> : message.text}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-start group">
            <div className="flex max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
              <div className="h-7 w-7 shrink-0 -translate-y-0.5 rounded-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800 mr-1">
                <img src={logo} alt="" className="h-full w-full" />
              </div>
              <div className="rounded-xl px-4 pt-2 bg-zinc-800 rounded-tl-none">
                <div className="flex space-x-1.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 180}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Microphone error message */}
        {micError && (
          <div className="flex justify-center">
            <div className="flex items-center bg-red-900/30 text-red-300 px-4 py-2 rounded-lg text-sm">
              <AlertCircle size={16} className="mr-2" />
              {micError}
            </div>
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 lg:px-25 mb-2">
        <div className="bg-[#303030] rounded-xl py-2 shadow-inner px-2">
          <div
            className={`flex ${
              isMultiLine ? "flex-col" : "items-end"
            } gap-2`}
          >
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              placeholder="Ask Anything..."
              className={`w-full ${
                !inputVal.trim() && "leading-[40px]"
              } bg-transparent border-none outline-none resize-none px-3 text-zinc-100
              overflow-y-scroll min-h-[40px] max-h-[200px] break-words`}
              rows={1}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (inputVal?.trim()) {
                    handleSendMessage();
                  }
                }
              }}
            />
            
            {/* Action buttons */}
            <div className="flex gap-2 self-end">
              <button
                disabled={!browserSupportsSpeechRecognition || !isMicrophoneAvailable}
                className={`p-2 cursor-pointer transition-colors rounded-full ${
                  listening
                    ? "bg-red-500/20 text-red-400"
                    : !browserSupportsSpeechRecognition || !isMicrophoneAvailable
                    ? "text-zinc-600 cursor-not-allowed"
                    : "hover:bg-zinc-700/50 text-zinc-400 hover:text-white"
                }`}
                title={
                  !browserSupportsSpeechRecognition
                    ? "Speech recognition not supported"
                    : !isMicrophoneAvailable
                    ? "Microphone not available"
                    : listening
                    ? "Stop listening"
                    : "Voice input"
                }
                type="button"
                onClick={handleVoiceToText}
              >
                <Mic 
                  size={20} 
                  className={listening ? "animate-pulse" : ""} 
                />
              </button>
              
              <button
                disabled={!inputVal?.trim()}
                className={`p-2 rounded-full transition-all duration-100 ${
                  inputVal?.trim()
                    ? loading
                      ? "bg-zinc-700"
                      : "bg-white text-black cursor-pointer shadow-md"
                    : "text-zinc-500 bg-zinc-700"
                }`}
                title="Send message"
                onClick={() => {
                  if (inputVal?.trim()) {
                    handleSendMessage();
                  }
                }}
              >
                {loading ? (
                  <Square
                    fill="white"
                    size={20}
                    className="p-0.5 cursor-pointer"
                  />
                ) : (
                  <ArrowUp size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;