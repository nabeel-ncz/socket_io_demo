import { useState, useEffect } from "react"
import io from "socket.io-client";

interface Message {
  room: string;
  message: string;
}

const socket = io('http://localhost:3000');

function App(): JSX.Element {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);

  useEffect(() => {
    setJoined(false);
  }, []);

  useEffect(() => {
    socket.on('recieve_message', (data: Message) => {
      setMessages((state) => {
        if (!state.includes(data.message)) {
          return [...state, data.message];
        }
        return state;
      });
    });
  }, []);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit('join_room', { room });
      setJoined(true);
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (room !== "" && inputValue !== "") {
      socket.emit('send_message', { room, message: inputValue });
      setInputValue("");
    }
  };

  return (
    <>
      <div className="chat-container">
        <h2>Chat</h2>
        <input type="text" value={room} onChange={(event) => {
          setRoom(event.target.value);
        }} />
        <button onClick={joinRoom}>Join</button>
        {joined && (
          <>
            <h6>Joined in to room {room}</h6>
            <input type="text" value={inputValue} onChange={(event) => {
              setInputValue(event.target.value);
            }} />
            <button onClick={sendMessage}>Send</button>
            <br /><br />
            <h2>Messages</h2><br />
            {messages?.map((item: string) => (
              <h4>{item}</h4>
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default App
