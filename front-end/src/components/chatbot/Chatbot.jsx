import { useState } from "react";
import fetchData from "../../util/fetchData";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    { from: "bot", text: "Hi! How can I help you with parking?" }
  ]);

  async function send() {
    if (!msg.trim()) return;

    const userMsg = msg.trim();
    setChat([...chat, { from: "user", text: userMsg }]);
    setMsg("");

    try {
      const res = await fetchData("POST", "/chat", { message: userMsg });
      
      setChat((c) => [
        ...c,
        { from: "bot", text: res?.reply || res?.message || "Sorry, I couldn't process that." }
      ]);
    } catch (error) {
      setChat((c) => [
        ...c,
        { from: "bot", text: "Connection error. Please try again." }
      ]);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-c3 text-white px-4 py-2 rounded-full z-50"
      >
        Chat
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-[320px] h-[400px] bg-white rounded-lg shadow-xl z-50 flex flex-col">
          <div className="p-3 font-bold border-b">JUSTPARK Assistant</div>

          <div className="flex-1 p-2 overflow-auto">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`p-2 my-1 rounded ${
                  c.from === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100"
                }`}
              >
                {c.text}
              </div>
            ))}
          </div>

          <div className="flex border-t">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 p-2 outline-none"
              placeholder="Ask about parking..."
            />
            <button
              onClick={send}
              className="px-4 bg-c3 text-white"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
