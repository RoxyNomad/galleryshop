"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

export default function Chat({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Nachrichten abrufen
  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
    }

    fetchMessages();
  }, [userId]);

  // Echtzeit-Updates abonnieren
  useEffect(() => {
    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Nachricht senden
  async function sendMessage() {
    if (!newMessage.trim()) return;
    await supabase.from("messages").insert([
      { sender_id: userId, receiver_id: "some-recipient-id", message: newMessage },
    ]);
    setNewMessage("");
  }

  return (
    <div className="p-4 border rounded-lg max-w-md">
      <div className="h-64 overflow-y-auto border-b mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2">
            <strong>{msg.sender_id === userId ? "You" : "Them"}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        className="border p-2 w-full"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="mt-2 p-2 bg-blue-500 text-white w-full" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}
