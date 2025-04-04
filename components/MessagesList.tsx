import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Message } from "@/services/types";

const MessagesList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]); // State to store the list of messages
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status

  useEffect(() => {
    // Fetch messages from the Supabase database
    const fetchMessages = async () => {
      try {
        // Query the "messages" table, order by creation date, and limit the result to 5 messages
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        // If there's an error, throw it
        if (error) throw error;

        // Update the state with the fetched messages
        setMessages(data as Message[]);
      } catch (err) {
        // Log the error if fetching fails
        console.error("Error fetching messages:", err);
      } finally {
        // Set loading to false once the fetch is complete
        setLoading(false);
      }
    };

    fetchMessages(); // Call the fetchMessages function when the component mounts
  }, []); // Empty dependency array ensures this runs only once after the initial render

  return (
    <div>
      <h2>Eingegangene Nachrichten</h2>

      {loading ? (
        <p>Loading...</p> // Show loading text while messages are being fetched
      ) : (
        <ul>
          {messages.length > 0 ? (
            // If there are messages, map over them and display each message
            messages.map((msg) => (
              <li key={msg.id}>
                <p>{msg.sender}:</p> {/* Display sender */}
                <p>{msg.message}</p> {/* Display message content */}
                <p>
                  {/* Format and display message creation date */}
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <p>Keine Nachrichten gefunden</p> // Display message if no messages are found
          )}
        </ul>
      )}
    </div>
  );
};

export default MessagesList;
