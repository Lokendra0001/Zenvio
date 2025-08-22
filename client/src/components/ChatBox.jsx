import React, { useState, useRef, useEffect } from "react";
import { Mic, Bot, Sparkles, ArrowUp, Square, Ear } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import logo from "../assests/images/logo3.png";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import serverObj from "../config/serverObj";

const ChatBox = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [messages, setMessages] = useState([]);
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    shouldUnregister: false,
  });
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const inputVal = watch("inputVal");
  const { serverURL } = serverObj;

  const handleChangeInput = (e) => {
    if (e) {
      const textarea = e.target;
      textarea.style.height = `0px`;
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
      setIsMultiLine(textarea.scrollHeight > 40);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      if (inputVal?.trim()) {
        handleSubmit(handleSendMessage)(); // trigger your form submit
      }
    }
  };

  const handleSendMessage = async ({ inputVal }) => {
    try {
      setIsLoading(true);

      // Add user message
      setMessages((prev) => [...prev, { role: "user", text: inputVal }]);

      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
      setIsMultiLine(false);
      reset();

      // Get AI response
      const { data } = await axios.post(`${serverURL}/chat`, {
        msg: inputVal,
      });
      console.log(data.reply);
      setMessages((prev) => [...prev, { role: "system", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          text: "Something Went Wrong try again later!",
          color: "text-red-500",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to handle textarea height when input value changes
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
      setIsMultiLine(textarea.scrollHeight > 40);
    }
  }, [inputVal]);

  useEffect(() => {
    // Whenever listening stops, reset isSpeaking
    if (browserSupportsSpeechRecognition) {
      const handleEnd = () => setIsSpeaking(false);
      SpeechRecognition.onend = handleEnd;

      return () => {
        SpeechRecognition.onend = null; // cleanup
      };
    }
  }, [browserSupportsSpeechRecognition]);

  const handleVoiceToText = () => {
    if (!browserSupportsSpeechRecognition) {
      alert(
        "Your browser does not support speech recognition. Try Chrome on Android."
      );
      return;
    }

    if (!isSpeaking) {
      SpeechRecognition.startListening({ continuous: true });
      setIsSpeaking(true);
    } else {
      SpeechRecognition.stopListening();
      setIsSpeaking(false);
    }
  };

  // Add this effect in your component
  useEffect(() => {
    if (transcript) {
      setValue("inputVal", transcript); // update textarea value with transcript
    }
  }, [transcript, setValue]);

  return (
    <div className="h-full flex flex-col text-zinc-100 rounded-xl overflow-hidden pt-3">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-scroll p-1 sm:p-4 space-y-6  lg:px-25">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <div className="relative ">
              <div className="w-16 h-16  rounded-full flex items-center justify-center">
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
                className={`flex max-w-xs md:max-w-md  ${
                  message.role === "user"
                    ? "flex-row-reverse lg:max-w-xl"
                    : " lg:max-w-full"
                }`}
              >
                <div>
                  <div
                    className={`rounded-xl px-3 py-1 ${
                      message.role === "user"
                        ? "bg-[#303030] rounded-tr-none"
                        : "rounded-tl-none"
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
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start group">
            <div className="flex max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
              <div className="h-7 w-7 shrink-0 -translate-y-0.5 rounded-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800 mr-1">
                {/* <Bot size={16} className="text-white" /> */}
                <img src={logo} alt="" className="h-full w-full " />
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 lg:px-25 mb-2">
        <div className="bg-[#303030] rounded-xl py-2 shadow-inner px-2">
          <form
            className={`flex  ${isMultiLine ? "flex-col" : "items-end"} gap-2`}
            onSubmit={handleSubmit(handleSendMessage)}
          >
            {/* Textarea */}
            <textarea
              {...register("inputVal", {
                required: true,
              })}
              placeholder="How can I help you today?"
              className="w-full bg-transparent border-none outline-none resize-none px-3 text-zinc-100
              overflow-y-hidden min-h-[40px] max-h-[200px] break-words"
              rows={1}
              onInput={(e) => handleChangeInput(e)}
              onKeyDown={(e) => handleKeyDown(e)}
              ref={(el) => {
                textareaRef.current = el; // keep your ref
                register("inputVal").ref(el); // also give RHF its ref
              }}
            />
            {/* Action buttons */}
            <div className="flex gap-2 self-end">
              <button
                className={`p-2 text-zinc-400 hover:text-white cursor-pointer transition-colors rounded-full hover:bg-zinc-700/50 ${
                  isSpeaking && "bg-zinc-700"
                }`}
                title="Voice input"
                type="button"
                onClick={handleVoiceToText}
              >
                <Mic
                  size={20}
                  className={`${isSpeaking && "animate-pulse text-zinc-300"}`}
                />
              </button>
              <button
                disabled={!inputVal?.trim()}
                className={`p-2 rounded-full transition-all ${
                  inputVal?.trim()
                    ? "bg-white text-black cursor-pointer shadow-md"
                    : "text-zinc-500 bg-zinc-700"
                }`}
                title="Send message"
              >
                {isLoading ? (
                  <Square fill="white" className="p-1 cursor-pointer" />
                ) : (
                  <ArrowUp size={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
