import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

await load({ export: true });

const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
const fromNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

if (!accountSid || !authToken || !fromNumber) {
  throw new Error("Missing Twilio environment variables");
}

const TWILIO_API_URL = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "").slice(-9);
  if (!cleaned) throw new Error("Invalid phone number");
  return `+250${cleaned}`;
};

export const sendSMS = async (to: string, body: string) => {
  try {
    const credentials = btoa(`${accountSid}:${authToken}`);
    const formData = new URLSearchParams();
    const formattedTo = formatPhoneNumber(to);
    formData.append("To", formattedTo);
    formData.append("From", fromNumber);
    formData.append("Body", body);

    const response = await fetch(TWILIO_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log({ data });
    console.log("SMS sent successfully");
    return data;
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw error;
  }
};
