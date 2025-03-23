import { NextApiRequest, NextApiResponse } from "next";
import { createCheckoutSession } from "@/services/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await createCheckoutSession();
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
