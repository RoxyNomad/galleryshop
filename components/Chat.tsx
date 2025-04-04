import { useState, useEffect } from "react"; // Import React hooks
import { useSession } from "@supabase/auth-helpers-react"; // Import authentication hook from Supabase
import { supabase } from "@/utils/supabaseClient"; // Import Supabase client instance
import { NextPage } from "next"; // Import Next.js type for pages
import styles from "@/styles/artists/messages.module.scss"; // Import styles for the chat component

// Define the Chat component with Next.js page type and optional disableHeader property
const Chat: NextPage & { disableHeader?: boolean } = () => {
  const session = useSession(); // Retrieve the user's session data
  const userId = session?.user?.id; // Extract the user ID from the session

  // Define the message structure
  interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    message: string;
  }

  // Define the user structure
  interface User {
    id: string;
    name: string;
    email: string;
  }

  // State variables for messages, users, and chat functionality
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedReceiver, setSelectedReceiver] = useState<string>("");
  const [chatUser, setChatUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Fetch messages when user ID is available
  useEffect(() => {
    if (!userId) return;
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages?userId=${userId}`); // Fetch messages from API
      const data = await res.json();
      setMessages(data); // Store messages in state
    };
    fetchMessages();

    // Subscribe to new messages using Supabase Realtime
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prevMessages) => [payload.new as Message, ...prevMessages]); // Add new message to the list
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Cleanup subscription on unmount
    };
  }, [userId]);

  // Fetch user list from the database
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("id, email, name");
      if (!error && data) {
        setUsers(data); // Store user data in state
      }
    };
    fetchUsers();
  }, []);

  // Function to send a new message
  const sendMessage = async () => {
    if (!message.trim() || !selectedReceiver) return; // Ensure message and receiver are set

    const { error } = await supabase.from("messages").insert([
      { sender_id: userId, receiver_id: selectedReceiver, message },
    ]);

    if (!error) {
      setMessage(""); // Clear the input field after sending
    }
  };

  // Function to open a chat with a selected user
  const openChat = (user: User) => {
    setChatUser(user);
    // Filter messages between current user and selected user
    const filteredMessages = messages.filter(
      (msg) => (msg.sender_id === userId && msg.receiver_id === user.id) ||
               (msg.sender_id === user.id && msg.receiver_id === userId)
    );
    setChatMessages(filteredMessages); // Store chat messages in state
  };

  return (
    <div>
      <div className={styles.messageContainer}>
        {/* Message input field */}
        <div className={styles.messageField}>
          <div className={styles.messageFieldHeader}>
            <p className={styles.title}>Empfänger wählen</p>
            <select
              className={styles.select}
              value={selectedReceiver}
              onChange={(e) => setSelectedReceiver(e.target.value)}
            >
              <option value="">-- Empfänger wählen --</option>
              {users
                .filter((user) => user.id !== userId)
                .map((user) => (
                  <option className={styles.option} key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.messageFieldBody}>
            <textarea
              className={styles.textarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ihre Nachricht..."
            ></textarea>
          </div>
          <div className={styles.messageFieldFooter}>
            <button className={styles.sendButton} onClick={sendMessage}>
              Senden
            </button>
          </div>
        </div>

        {/* List of available chat users */}
        <div className={styles.messageList}>
          {users.filter((user) => user.id !== userId).map((user) => (
            <div 
              key={user.id} 
              className={styles.messageItem} 
              onClick={() => openChat(user)}
            >
              <p>{user.name}</p>
            </div>
          ))}
        </div>

        {/* Chat overlay window */}
        {chatUser && (
          <div className={styles.overlayContainer}>
            <div className={styles.overlay}>
              <div className={styles.overlayContent}>
                <h2>Unterhaltung mit {chatUser.name}</h2>
                <div className={styles.chatMessages}>
                  {chatMessages.map((msg) => (
                    <p key={msg.id}>
                      <strong>{msg.sender_id === userId ? "You" : chatUser.name}:</strong> {msg.message}
                    </p>
                  ))}
                </div>
                <button className={styles.chatButton} onClick={() => {setSelectedReceiver(chatUser.id); setChatUser(null);}}>Antworten</button>
                <button className={styles.chatButton} onClick={() => setChatUser(null)}>X</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Chat.disableHeader = true; // Disable the header for this page

export default Chat; // Export the Chat component for use in the application
