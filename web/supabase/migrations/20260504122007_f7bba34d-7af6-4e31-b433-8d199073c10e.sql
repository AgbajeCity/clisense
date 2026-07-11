CREATE TABLE public.sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  moisture numeric NOT NULL,
  temperature numeric NOT NULL,
  solar numeric NOT NULL,
  battery numeric NOT NULL,
  rssi numeric,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sensor_readings_device_time ON public.sensor_readings (device_id, recorded_at DESC);

ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read sensor readings"
  ON public.sensor_readings FOR SELECT
  USING (true);

ALTER TABLE public.sensor_readings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;