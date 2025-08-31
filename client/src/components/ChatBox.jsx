import React, { useEffect, useRef, useState } from "react";
import { Mic, Sparkles, ArrowUp, Square } from "lucide-react";
import logo from "../assests/images/logo4.png";
import axios from "axios";
import serverObj from "../config/serverObj";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useDispatch, useSelector } from "react-redux";
import { toggleNewChat } from "../store/slices/newChatSlice";
import { handleErrorMsg } from "../config/toast";

const ChatBox = () => {
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [chatId, setChatId] = useState(null);
  const { serverURL } = serverObj;
  const messageEndRef = useRef(null);
  const textareaRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const isNewChat = useSelector((state) => state.newChat.isNewChat);
  const selectedHistory = useSelector((state) => state.selectedHistory.history);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  // create refs to hold always-latest values
  const messagesRef = useRef(messages);
  const selectedHistoryRef = useRef(selectedHistory);

  const handleSendMessage = async () => {
    try {
      setLoading(true);
      SpeechRecognition.stopListening();
      setIsSpeaking(false);

      setMessages((prev) => [...prev, { sender: "user", msg: inputVal }]);
      setInputVal("");
      const { data } = await axios.post(`${serverURL}/chat/sendMessage`, {
        msg: inputVal,
      });

      setMessages((prev) => [...prev, { sender: "system", msg: data.reply }]);
    } catch (err) {
      handleErrorMsg(err.message);
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          msg: "Something Went Wrong. try again later!",
          color: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    if (user && messages.length > 0) {
      try {
        await axios.post(
          `${serverURL}/chat/addHistory`,
          { chatId: chatId || null, messages },
          {
            withCredentials: true,
          }
        );

        setMessages([]);
      } catch (err) {
        handleErrorMsg(err.message);
      } finally {
        dispatch(toggleNewChat());
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputVal?.trim()) {
        handleSendMessage();
      }
    }
  };

  const handleVoiceToText = () => {
    if (!browserSupportsSpeechRecognition) {
      alert(
        "Your browser does not support speech recognition. Try Chrome on Android."
      );
    }

    if (!isSpeaking) {
      resetTranscript();
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();
    }
    setIsSpeaking(!isSpeaking);
  };

  const scrollToBottom = () => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Keep transcript synced to input when mic is active
  useEffect(() => {
    if (transcript) setInputVal(transcript);
  }, [transcript]);

  // Keep the textarea expand as per the text
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
      setIsMultiLine(textarea.scrollHeight > 40);
    }
  }, [inputVal]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isNewChat == true) {
      setChatId(null);
      handleNewChat();
    }
  }, [isNewChat]);

  useEffect(() => {
    if (selectedHistory) {
      setChatId(selectedHistory.chatId);
      if (user) setMessages(selectedHistory.chats);
    }
  }, [selectedHistory]);

  // keep refs in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    selectedHistoryRef.current = selectedHistory;
  }, [selectedHistory]);

  // add unload listener only once
  useEffect(() => {
    const handleUnload = () => {
      if (messagesRef.current.length > 0) {
        const payload = JSON.stringify({
          chatId: selectedHistoryRef.current?.chatId || null,
          messages: messagesRef.current,
        });

        navigator.sendBeacon(
          `${serverURL}/chat/addHistory`,
          new Blob([payload], { type: "application/json" })
        );
      }
    };

    if (user) {
      window.addEventListener("beforeunload", handleUnload);
    }
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [serverURL]); // only depends on serverURL, not messages

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setChatId(null);
    }
  }, [user]);

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
                message?.sender === "user" ? "justify-end" : "justify-start"
              } group`}
            >
              <div
                className={`rounded-xl px-3  py-1 ${
                  message?.sender === "user"
                    ? "bg-[#303030bd] rounded-tr-none max-w-[80%] lg:max-w-lg xl:max-w-xl"
                    : "rounded-tl-none   xl:max-w-full"
                }`}
              >
                <p
                  className={`break-words whitespace-pre-line text-[14.5px] tracking-wide ${
                    message?.color && "text-red-400"
                  }`}
                >
                  {message?.color ? <>😕 {message.msg}</> : message.msg}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Loading example */}
        {loading && (
          <div className="flex justify-start group">
            <div className="flex max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
              <div className="h-7 w-7 p-1.5 shrink-0 -translate-y-0.5 rounded-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800 mr-1">
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

        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 lg:px-25 mb-3 md:mb-0 ">
        <div className="bg-[#303030] rounded-xl  py-2 shadow-inner px-2">
          <div
            className={`flex ${
              isMultiLine ? "flex-col " : " items-end"
            }  gap-2`}
          >
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              placeholder="Ask Anything..."
              className={`w-full ${
                (!inputVal.trim() || textareaRef.current.scrollHeight <= 40) &&
                "leading-[40px]"
              } bg-transparent  border-none outline-none resize-none px-3 text-zinc-100
              overflow-y-scroll min-h-[40px] max-h-[200px] break-words`}
              rows={1}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />

            {/* Action buttons */}
            <div className="flex gap-2 self-end">
              <button
                className={`p-2  hover:text-white cursor-pointer transition-colors rounded-full  ${
                  isSpeaking
                    ? "bg-red-400/20 text-red-400"
                    : "hover:bg-zinc-700/50 text-zinc-400"
                }`}
                title="Voice input"
                type="button"
                onClick={handleVoiceToText}
              >
                <Mic
                  size={20}
                  className={`${isSpeaking && "animate-pulse text-red-400 "}`}
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
                onClick={handleSendMessage}
              >
                {loading ? (
                  <Square
                    fill="white"
                    size={20}
                    className="p-0.5 cursor-pointer animate-pulse"
                  />
                ) : (
                  <ArrowUp size={20} />
                )}{" "}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="w-full hidden md:block my-2 text-center text-xs text-zinc-400">
        Zenvio AI · Powered by Gemini Flash · Always verify key details.
      </p>
    </div>
  );
};

export default ChatBox;
