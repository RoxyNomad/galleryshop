import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Message } from "@/services/types";

const MessagesList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        setMessages(data as Message[]);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Eingegangene Nachrichten</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <li key={msg.id} className="border-b py-2">
                <p className="font-semibold">{msg.sender}:</p>
                <p>{msg.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <p>Keine Nachrichten gefunden</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default MessagesList;
