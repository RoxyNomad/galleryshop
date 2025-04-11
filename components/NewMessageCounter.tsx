import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Message } from '@/services/types';
import styles from '@/styles/components/counter.module.scss';

const NewMessageCounter: NextPage & { disableHeader?: boolean } = () => {
  // State to store unread message counts per sender name
  const [newMessages, setNewMessages] = useState<Map<string, number>>(new Map());
  // State to store the current user's ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  // Ref to cache sender ID -> name mapping
  const idToNameMap = useRef<Map<string, string>>(new Map());

  // Get the currently logged-in user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    };

    fetchCurrentUser();
  }, []);

  // Retrieve the sender's name from cache or fetch from DB
  const getSenderName = async (senderId: string): Promise<string> => {
    const cachedName = idToNameMap.current.get(senderId);
    if (cachedName) return cachedName;

    const { data } = await supabase
      .from('users')
      .select('name')
      .eq('id', senderId)
      .single();

    const name = data?.name || `Unbekannt (${senderId})`;
    idToNameMap.current.set(senderId, name);
    return name;
  };

  // Fetch unread messages for the current user
  const fetchUnreadMessages = async (userId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('sender_id, users!messages_sender_id_fkey(name)')
      .eq('is_read', false)
      .eq('receiver_id', userId);

    if (error) {
      console.error('Fehler beim Abrufen der Nachrichten:', error.message);
      return;
    }

    const countMap = new Map<string, number>();

    data?.forEach((entry) => {
      const senderId = entry.sender_id;
      const senderName = entry.users?.name || `Unbekannt (${senderId})`;
      idToNameMap.current.set(senderId, senderName);

      const currentCount = countMap.get(senderName) || 0;
      countMap.set(senderName, currentCount + 1);
    });

    setNewMessages(countMap);
  };

  // Initial fetch and subscribe to new incoming messages
  useEffect(() => {
    if (!currentUserId) return;

    fetchUnreadMessages(currentUserId);

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMessage = payload.new as Message;

          if (
            newMessage.receiver_id !== currentUserId ||
            newMessage.is_read
          ) {
            return;
          }

          const senderName = await getSenderName(newMessage.sender_id);

          setNewMessages((prev) => {
            const updated = new Map(prev);
            const count = updated.get(senderName) || 0;
            updated.set(senderName, count + 1);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Mark all unread messages from a specific sender as read
  const markAsRead = async (senderName: string) => {
    const senderId = [...idToNameMap.current.entries()]
      .find(([, name]) => name === senderName)?.[0];

    if (!senderId || !currentUserId) return;

    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', currentUserId)
      .eq('is_read', false);

    // Update local state to reflect changes
    setNewMessages((prev) => {
      const updated = new Map(prev);
      updated.delete(senderName);
      return updated;
    });
  };

  return (
    <div className={styles.messageCounterContainer}>
      <h1 className={styles.counterTitle}>Nachrichten</h1>
      <div className={styles.counterContainer}>
        {newMessages.size === 0 ? (
          <p className={styles.counterMessage}>Keine neuen Nachrichten.</p>
        ) : (
          <ul>
            {Array.from(newMessages.entries()).map(([senderName, count]) => (
              <li className={styles.counterMessage} key={senderName}>
                {senderName}: {count} neue Nachricht {count !== 1 ? 'en' : ''}
                <button className={styles.markAsReadButton} onClick={() => markAsRead(senderName)}>
                  Als gelesen markieren
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

NewMessageCounter.disableHeader = true;
export default NewMessageCounter;
