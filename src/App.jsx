import React, { useState } from "react";
import html2canvas from "html2canvas";
import { Download, Plus, Video, Phone, Pencil, Trash2 } from "lucide-react";

const platforms = ["WhatsApp", "Instagram"];

const getCurrentTime = () => {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
};

function App() {
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [platform, setPlatform] = useState("WhatsApp");
  const [memeText, setMemeText] = useState("");
  const [profileName, setProfileName] = useState("Chekki ❤️");
  const [profileImage, setProfileImage] = useState(null);
  const [statusText, setStatusText] = useState("online");

 const parseAndAddChat = () => {
  const lines = newMessage.split("\n").filter((line) => line.trim() !== "");

  const baseTime = new Date();
  const parsedChats = lines.map((line, index) => {
    const from = line.startsWith("Me:") ? "Me" : "Them";
    const text = line.replace(/^Me:|^Them:/, "").trim();

    // Add +1 minute for every 3 messages
    const time = new Date(baseTime.getTime() + Math.floor(index / 3) * 60000);

    const h = time.getHours();
    const m = time.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    const formattedTime = `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;

    return {
      from,
      text,
      time: formattedTime,
      editing: false,
    };
  });

  setChats(parsedChats);
};


  const downloadScreenshot = () => {
    const element = document.getElementById("chat-box");
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.download = "fake-chat.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const renderWhatsApp = () => (
    <div
      className="rounded-xl min-h-[400px] relative text-sm border"
      style={{
        backgroundImage: "url('/whatsapp-bg.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-[#075E54] text-white px-3 py-2 flex items-center gap-3 rounded-t-xl">
        <button className="text-white">←</button>
        <img
          src={profileImage || "https://i.imgur.com/9XnFZbC.png"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold">{profileName}</span>
          <span className="text-xs text-green-200">{statusText}</span>
        </div>
        <div className="ml-auto flex gap-2">
          <Video className="text-white w-5 h-5" />
          <Phone className="text-white w-5 h-5" />
          <span className="text-white">⋮</span>
        </div>
      </div>

      <div className="p-3">
        {chats.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.from === "Me" ? "justify-end" : "justify-start"
            } mb-1 group`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm ${
                msg.from === "Me"
                  ? "bg-[#dcf8c6] text-black"
                  : "bg-white border text-black"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {msg.editing ? (
                    <input
                      className="text-sm w-full bg-white border p-1 rounded"
                      value={msg.text}
                      onChange={(e) =>
                        setChats((prev) =>
                          prev.map((m, idx) =>
                            idx === i ? { ...m, text: e.target.value } : m
                          )
                        )
                      }
                      onBlur={() =>
                        setChats((prev) =>
                          prev.map((m, idx) =>
                            idx === i ? { ...m, editing: false } : m
                          )
                        )
                      }
                      autoFocus
                    />
                  ) : (
                    <div>{msg.text}</div>
                  )}
                  <div className="text-[10px] text-right text-gray-500 mt-1 flex items-center justify-end gap-1">
  <span>{msg.time}</span>
  {msg.from === "Me" && (
    <span className="text-[#34B7F1] text-xs relative ml-1" style={{ display: "inline-block", lineHeight: 1 }}>
      <span className="absolute left-0 top-0">✔</span>
      <span className="ml-[4px]">✔</span>
    </span>
  )}
</div>
                

                </div>
                <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil
                    size={14}
                    className="cursor-pointer text-gray-500"
                    onClick={() =>
                      setChats((prev) =>
                        prev.map((m, idx) =>
                          idx === i ? { ...m, editing: true } : m
                        )
                      )
                    }
                  />
                  <Trash2
                    size={14}
                    className="cursor-pointer text-red-400"
                    onClick={() =>
                      setChats((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInstagram = () => (
    <div className="bg-white border rounded-xl min-h-[400px] relative">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <img
            src={profileImage || "https://i.imgur.com/9XnFZbC.png"}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-bold">{profileName}</span>
        </div>
        <div className="flex gap-2">
          <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
          <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
        </div>
      </div>
      <div className="p-4">
        {chats.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.from === "Me" ? "justify-end" : "justify-start"
            } mb-1 group`}
          >
            <div
              className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                msg.from === "Me"
                  ? "bg-gradient-to-br from-indigo-500 to-pink-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {msg.editing ? (
                    <input
                      className="text-sm w-full bg-white text-black border p-1 rounded"
                      value={msg.text}
                      onChange={(e) =>
                        setChats((prev) =>
                          prev.map((m, idx) =>
                            idx === i ? { ...m, text: e.target.value } : m
                          )
                        )
                      }
                      onBlur={() =>
                        setChats((prev) =>
                          prev.map((m, idx) =>
                            idx === i ? { ...m, editing: false } : m
                          )
                        )
                      }
                      autoFocus
                    />
                  ) : (
                    <div>{msg.text}</div>
                  )}
               <div className="text-[10px] text-right text-gray-500 mt-1 flex items-center justify-end gap-1">
  <span>{msg.time}</span>
  {msg.from === "Me" && (
    <span className="text-[#34B7F1] text-xs relative ml-1" style={{ display: "inline-block", lineHeight: 1 }}>
      <span className="absolute left-0 top-0">✔</span>
      <span className="ml-[4px]">✔</span>
    </span>
  )}
</div>

    

                </div>
                <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil
                    size={14}
                    className="cursor-pointer text-white"
                    onClick={() =>
                      setChats((prev) =>
                        prev.map((m, idx) =>
                          idx === i ? { ...m, editing: true } : m
                        )
                      )
                    }
                  />
                  <Trash2
                    size={14}
                    className="cursor-pointer text-red-300"
                    onClick={() =>
                      setChats((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Fake Chat Screenshot Maker</h1>

      <div className="mb-4">
        <textarea
          className="border p-2 rounded w-full h-32"
          placeholder={`Paste chat in this format:\nMe: హాయ్ బేబీ ❤️\nThem: హాయ్ చెక్కి 😘`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded flex items-center"
          onClick={parseAndAddChat}
        >
          <Plus className="mr-1" /> Generate Chat
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-semibold">Platform:</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="p-2 rounded border w-full"
          >
            {platforms.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Profile Name:</label>
          <input
            className="border p-2 rounded w-full"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 font-semibold">Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageUpload}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Status Text:</label>
          <input
            className="border p-2 rounded w-full"
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            placeholder="e.g. online or last seen today at 5:32 PM"
          />
        </div>
      </div>

      <div className="mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Meme Caption (optional)"
          value={memeText}
          onChange={(e) => setMemeText(e.target.value)}
        />
      </div>

      <div id="chat-box">
        {memeText && (
          <div className="text-center font-bold text-lg mb-2">{memeText}</div>
        )}
        {platform === "WhatsApp" ? renderWhatsApp() : renderInstagram()}
      </div>

      <button
        className="mt-4 bg-black text-white py-2 px-4 rounded w-full flex items-center justify-center"
        onClick={downloadScreenshot}
      >
        <Download className="mr-2" /> Download Screenshot
      </button>
    </div>
  );
}

export default App;
