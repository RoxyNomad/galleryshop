import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/utils/supabaseClient";
import { NextPage } from "next";
import styles from "@/styles/artists/messages.module.scss";

const Chat: NextPage & { disableHeader?: boolean } = () => {
  const session = useSession();
  const userId = session?.user?.id;

  interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    message: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedReceiver, setSelectedReceiver] = useState<string>("");
  const [chatUser, setChatUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!userId) return;
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();

    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prevMessages) => [payload.new as Message, ...prevMessages]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("id, email, name");
      if (!error && data) {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || !selectedReceiver) return;

    const { error } = await supabase.from("messages").insert([
      { sender_id: userId, receiver_id: selectedReceiver, message },
    ]);

    if (!error) {
      setMessage("");
    }
  };

  const openChat = (user: User) => {
    setChatUser(user);
    const filteredMessages = messages.filter(
      (msg) => (msg.sender_id === userId && msg.receiver_id === user.id) ||
               (msg.sender_id === user.id && msg.receiver_id === userId)
    );
    setChatMessages(filteredMessages);
  };

  return (
    <div>
      <div className={styles.messageContainer}>
        <div className={styles.messageField}>
          <div className={styles.messageFieldHeader}>
            <p className={styles.title}>Empfänger wählen</p>
            <select
              className={styles.select}
              value={selectedReceiver}
              onChange={(e) => setSelectedReceiver(e.target.value)}
            >
              <option value="">-- Wähle einen Empfänger --</option>
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
              placeholder="Nachricht eingeben..."
            ></textarea>
          </div>
          <div className={styles.messageFieldFooter}>
            <button className={styles.sendButton} onClick={sendMessage}>
              Senden
            </button>
          </div>
        </div>
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
        {chatUser && (
          <div className={styles.overlayContainer}>
            <div className={styles.overlay}>
              <div className={styles.overlayContent}>
                <h2>Chat mit {chatUser.name}</h2>
                <div className={styles.chatMessages}>
                  {chatMessages.map((msg) => (
                    <p key={msg.id}>
                      <strong>{msg.sender_id === userId ? "Du" : chatUser.name}:</strong> {msg.message}
                    </p>
                  ))}
                </div>
                <button className={styles.chatButton} onClick={() => {setSelectedReceiver(chatUser.id); setChatUser(null);}}>Antworten</button>
                <button className={styles.chatButton} onClick={() => setChatUser(null)}>Schließen</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Chat.disableHeader = true;

export default Chat;
