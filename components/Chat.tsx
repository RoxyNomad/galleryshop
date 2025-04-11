import { useState, useEffect } from "react"; // Import React hooks
import { Message, User } from "@/services/types"; // Import types for messages and users
import { useSession } from "@supabase/auth-helpers-react"; // Import authentication hook from Supabase
import { supabase } from "@/utils/supabaseClient"; // Import Supabase client instance
import { NextPage } from "next"; // Import Next.js type for pages
import styles from "@/styles/artists/messages.module.scss"; // Import styles for the chat component

// Define the Chat component with Next.js page type and optional disableHeader property
const Chat: NextPage & { disableHeader?: boolean } = () => {
  const session = useSession(); // Retrieve the user's session data
  const userId = session?.user?.id; // Extract the user ID from the session

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
  const openChat = async (user: User) => {
    setChatUser(user);

    // Filter messages between current user and selected user
    const filteredMessages = messages.filter(
      (msg) =>
        (msg.sender_id === userId && msg.receiver_id === user.id) ||
        (msg.sender_id === user.id && msg.receiver_id === userId)
    );

    setChatMessages(filteredMessages);

    // Mark unread messages from this user as read
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", user.id)
      .eq("receiver_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Fehler beim Markieren als gelesen:", error.message);
    }
  };

  // Filter users who have exchanged messages with the current user
  const activeChatUsers = users.filter((user) => {
    return messages.some(
      (msg) =>
        (msg.sender_id === userId && msg.receiver_id === user.id) ||
        (msg.sender_id === user.id && msg.receiver_id === userId)
    );
  });

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
              {users.map((user) => (
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

        {/* List of users you have chatted with */}
        <div className={styles.messageList}>
          {activeChatUsers.map((user) => (
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
                      <strong>{msg.sender_id === userId ? "Du" : chatUser.name}:</strong> {msg.message}
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
