import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TooltipItem } from "chart.js";
import styles from '@/styles/ordersTable.module.scss'
import { Order } from '@/services/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrdersChart: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Daten für das Balkendiagramm vorbereiten
  const chartData = {
    labels: orders.map((order) => `Order ${order.id}`),  // Labels für jedes Order (kannst du anpassen)
    datasets: [
      {
        label: 'Betrag (CHF)',
        data: orders.map((order) => order.amount), // Betrag der Bestellung
        backgroundColor: '#000000',  // Balkenfarbe
        borderColor: '#000000',  // Randfarbe
        borderWidth: 1,
        fontColor: '#000000'
      },
    ],
  };

  // Optionen für das Diagramm
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Bestellungen Betrag (CHF)',
        color: '#000000',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: TooltipItem<'bar'>) {
            return `${tooltipItem.raw} CHF`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.ordersChartContainer}>
      <h2 className={styles.mainTitle}>Bestellungen</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.chartContainer}>
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default OrdersChart;

