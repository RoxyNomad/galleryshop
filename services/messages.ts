import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase-Client initialisieren
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 📌 GET: Alle Nachrichten für einen Nutzer abrufen
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId ist erforderlich" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 📌 POST: Neue Nachricht speichern
export async function POST(req: NextRequest) {
  const { sender_id, receiver_id, message } = await req.json();

  if (!sender_id || !receiver_id || !message) {
    return NextResponse.json({ error: "Alle Felder sind erforderlich" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([{ sender_id, receiver_id, message }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
