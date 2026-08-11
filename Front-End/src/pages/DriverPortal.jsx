import { useState, useCallback } from "react";
// import carImage from "./assets/f1-car.png";
import { Mic , AudioLines } from "lucide-react";

export default function Driver() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [recording, setRecording] = useState(false);

  const quickMsgs = [
    { label: "Box this lap", text: "Box, box, box." },
    { label: "Gap to car ahead", text: "Gap to car ahead?" },
    { label: "Push now", text: "Push now, push." },
    { label: "Copy that", text: "Copy, understood." },
  ];

  const sendText = useCallback((text) => {
    if (!text.trim()) return;
    setStatus(`MESSAGE SENT: "${text}"`);
    setMessage("");
    setTimeout(() => setStatus(""), 2500);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* base layer: the real car photo */}
      <img
        src={"https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000001/content/dam/fom-website/manual/Misc/2021-Master-Folder/F1%202021%20LAUNCH%20RENDERING%20(2).webp"}
        alt="F1 car"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

      {/* foreground panel */}
      <div className="relative z-10 w-full max-w-xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 mb-6">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_2px_rgba(255,30,30,0.7)]" />
          <span className="text-xs font-bold tracking-[0.3em] text-red-500">
            PIT WALL LIVE
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Team <span className="text-yellow-400">Radio</span>
        </h1>

        <div className="flex items-center gap-3 rounded-full bg-black/80 border border-neutral-800 pl-5 pr-2 py-2 backdrop-blur">
          <span className="text-neutral-500 text-xl select-none">+</span>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendText(message)}
            placeholder="Send a message to the driver..."
            className="flex-1 bg-transparent text-neutral-100 placeholder-neutral-500 text-sm sm:text-base outline-none"
          />
          <button
            aria-label="Mute"
            className="h-10 w-10 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center hover:bg-neutral-700 transition"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            aria-label="Push to talk"
            onMouseDown={() => {
              setRecording(true);
              setStatus("TRANSMITTING...");
            }}
            onMouseUp={() => {
              setRecording(false);
              setStatus("RADIO MESSAGE SENT");
              setTimeout(() => setStatus(""), 2000);
            }}
            onMouseLeaveCapture={() => recording && setRecording(false)}
            style={{ height: 52, width: 52 }}
            className={`shrink-0 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
              recording ? "bg-black text-white animate-pulse" : "bg-red-600"
            }`}
          >
            {/* <MicIcon className="h-5 w-5 text-black" /> */}
            <AudioLines />
          </button>
        </div>

        <div className="h-5 mt-4 text-xs tracking-widest text-red-300">
          {status}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {quickMsgs.map((q) => (
            <button
              key={q.label}
              onClick={() => sendText(q.text)}
              className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs sm:text-sm text-red-100 hover:bg-black/60 transition"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
