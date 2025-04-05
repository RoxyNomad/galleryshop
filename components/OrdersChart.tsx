import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TooltipItem } from "chart.js";
import { Order } from '@/services/types';
import { supabase } from "@/utils/supabaseClient";
import styles from '@/styles/components/ordersTable.module.scss'

// Register necessary ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrdersChart: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);  // State to store fetched orders
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status

  // Fetch orders from Supabase when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders from the "orders" table, ordered by created_at in descending order
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error; // If there's an error, throw it
        setOrders(data); // Store the fetched orders in the state
      } catch (err) {
        console.error("Error fetching orders:", err); // Log the error if fetching fails
      } finally {
        setLoading(false); // Set loading to false after the fetch completes
      }
    };

    fetchOrders(); // Call the fetchOrders function on component mount
  }, []); // Empty dependency array ensures this runs only once

  // Prepare the data for the bar chart
  const chartData = {
    labels: orders.map((order) => `Order ${order.id}`),  // Labels for each order (you can customize this)
    datasets: [
      {
        label: 'Betrag (CHF)',  // Label for the dataset
        data: orders.map((order) => order.amount), // Amount of each order to plot
        backgroundColor: '#000000',  // Bar color
        borderColor: '#000000',  // Border color for the bars
        borderWidth: 1,
        fontColor: '#000000',  // Font color for the labels
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,  // Make the chart responsive to screen size
    plugins: {
      title: {
        display: true,
        text: 'Bestellungen Betrag (CHF)',  // Title of the chart
        color: '#000000',  // Title color
      },
      tooltip: {
        callbacks: {
          // Customize tooltip display for each bar
          label: function(tooltipItem: TooltipItem<'bar'>) {
            return `${tooltipItem.raw} CHF`;  // Display the amount in CHF
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,  // Start the y-axis at zero
      },
    },
  };

  return (
    <div className={styles.ordersChartContainer}>
      <h2 className={styles.mainTitle}>Bestellungen</h2>
      {loading ? (
        <p>Loading...</p>  // Show loading message while data is being fetched
      ) : (
        <div className={styles.chartContainer}>
          <Bar data={chartData} options={options} />  {/* Render the bar chart */} 
        </div>
      )}
    </div>
  );
};

export default OrdersChart;
