import { NextPage } from 'next'; // Importing the NextPage type from Next.js
import Sidebar from '@/components/CustomerSidebar'; // Importing the Sidebar component for the customer page
import { useState, useEffect } from 'react'; // Importing React hooks for state and side effects
import { Order } from '@/services/types'; // Ensure that this type is properly defined
import { supabase } from '@/utils/supabaseClient'; // Importing the Supabase client to interact with the database
import styles from '@/styles/customer/myOrders.module.scss'; // Importing the styles for the MyOrders page

// The main MyOrders component
const MyOrders: NextPage & { disableHeader?: boolean } = () => {
  const [orders, setOrders] = useState<Order[]>([]); // State to hold the orders
  const [loading, setLoading] = useState<boolean>(true); // State to track the loading status

  // Fetching orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Set loading to true before fetching
      const { data, error } = await supabase.from('orders').select('*'); // Fetching all columns from the 'orders' table

      if (error) {
        console.error('Error fetching orders:', error); // Logging error if any
      } else {
        setOrders(data || []); // Setting the fetched orders in state
      }

      setLoading(false); // Set loading to false once the fetching is done
    };

    fetchOrders(); // Call the fetchOrders function to get the data
  }, []); // Empty dependency array to run the effect once on component mount

  return (
    <div className={styles.myOrdersPage}>
      <Sidebar /> {/* Rendering the Sidebar component */}
      <div className={styles.myOrdersContainer}>
        <div className={styles.myOrdersField}>
          <h1 className={styles.myOrdersTitle}>Meine Bestellungen</h1> {/* Displaying the page title */}
          {loading ? (
            <p>Lade Bestellungen...</p> // Showing loading text while fetching data
          ) : (
            // Displaying orders in a table once they are loaded
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Bestellnummer</th>
                  <th className="border p-2">Artikel</th>
                  <th className="border p-2">Bestellstatus</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  // Rendering each order row dynamically from the fetched orders
                  <tr key={order.id} className="text-center">
                    <td className="border p-2">{order.id}</td>
                    <td className="border p-2">{order.name}</td>
                    <td className={`border p-2 ${getStatusColor(order.status)}`}>{order.status}</td> {/* Applying dynamic class for status color */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to determine the status color based on order status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Bestellt': return 'text-blue-500'; // Blue color for 'Bestellt'
    case 'Verschickt': return 'text-yellow-500'; // Yellow color for 'Verschickt'
    case 'Zugestellt': return 'text-green-500'; // Green color for 'Zugestellt'
    default: return ''; // Default: no color
  }
};

MyOrders.disableHeader = true; // Disabling the header for this page

export default MyOrders; // Exporting the MyOrders component for use in other parts of the app
