import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      device_id,
      moisture,
      temperature,
      solar,
      battery,
      rssi,
      recorded_at,
    } = body ?? {};

    if (
      typeof device_id !== "string" ||
      typeof moisture !== "number" ||
      typeof temperature !== "number" ||
      typeof solar !== "number" ||
      typeof battery !== "number"
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid payload. Required: device_id (string), moisture, temperature, solar, battery (numbers)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("sensor_readings")
      .insert({
        device_id,
        moisture,
        temperature,
        solar,
        battery,
        rssi: typeof rssi === "number" ? rssi : null,
        recorded_at: recorded_at ?? new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, reading: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
