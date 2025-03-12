export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "offen" | "versendet" | "storniert"; // Beispiel-Status
  created_at: string;
}

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  created_at: string;
}
