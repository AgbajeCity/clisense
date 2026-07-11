-- Create WEF Nexus Data Engine Tables

-- Water Resources Table
CREATE TABLE public.water_resources (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    location_name TEXT NOT NULL,
    water_availability_m3 DECIMAL(15,2),
    water_quality_index INTEGER CHECK (water_quality_index >= 0 AND water_quality_index <= 100),
    groundwater_level_m DECIMAL(10,2),
    precipitation_mm DECIMAL(10,2),
    evapotranspiration_mm DECIMAL(10,2),
    water_stress_level TEXT CHECK (water_stress_level IN ('low', 'medium', 'high', 'extremely_high')),
    irrigation_efficiency_percent DECIMAL(5,2),
    measurement_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Energy Resources Table  
CREATE TABLE public.energy_resources (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    location_name TEXT NOT NULL,
    solar_irradiance_kwh_m2 DECIMAL(10,2),
    wind_speed_ms DECIMAL(6,2),
    energy_consumption_kwh DECIMAL(15,2),
    renewable_energy_potential_kwh DECIMAL(15,2),
    grid_reliability_score INTEGER CHECK (grid_reliability_score >= 0 AND grid_reliability_score <= 100),
    energy_access_rate_percent DECIMAL(5,2),
    fuel_consumption_liters DECIMAL(12,2),
    carbon_footprint_kg_co2 DECIMAL(15,2),
    measurement_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Food Security Table
CREATE TABLE public.food_security (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    location_name TEXT NOT NULL,
    crop_type TEXT NOT NULL,
    crop_yield_kg_ha DECIMAL(10,2),
    food_production_tons DECIMAL(12,2),
    soil_health_index INTEGER CHECK (soil_health_index >= 0 AND soil_health_index <= 100),
    nutritional_diversity_score INTEGER CHECK (nutritional_diversity_score >= 0 AND nutritional_diversity_score <= 100),
    food_access_index INTEGER CHECK (food_access_index >= 0 AND food_access_index <= 100),
    post_harvest_loss_percent DECIMAL(5,2),
    market_price_per_kg DECIMAL(10,2),
    storage_capacity_tons DECIMAL(12,2),
    measurement_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Climate Risk Assessment Table
CREATE TABLE public.climate_risks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    location_name TEXT NOT NULL,
    risk_type TEXT NOT NULL CHECK (risk_type IN ('drought', 'flood', 'temperature_extreme', 'pest_outbreak', 'disease', 'market_volatility')),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    likelihood_percent DECIMAL(5,2),
    impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 10),
    vulnerable_population INTEGER,
    economic_impact_usd DECIMAL(15,2),
    mitigation_strategies TEXT[],
    early_warning_threshold DECIMAL(10,2),
    assessment_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Stakeholder Profiles Table
CREATE TABLE public.stakeholder_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    stakeholder_type TEXT NOT NULL CHECK (stakeholder_type IN ('farmer', 'business', 'policymaker', 'researcher', 'ngo')),
    organization_name TEXT,
    primary_interest TEXT[],
    location_focus TEXT[],
    decision_authority TEXT,
    resource_capacity TEXT CHECK (resource_capacity IN ('low', 'medium', 'high')),
    data_access_level TEXT CHECK (data_access_level IN ('basic', 'advanced', 'premium')),
    notification_preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- WEF Nexus Analytics Table (for computed insights)
CREATE TABLE public.wef_nexus_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    location_name TEXT NOT NULL,
    water_energy_correlation DECIMAL(5,4),
    water_food_correlation DECIMAL(5,4),
    energy_food_correlation DECIMAL(5,4),
    nexus_efficiency_score INTEGER CHECK (nexus_efficiency_score >= 0 AND nexus_efficiency_score <= 100),
    sustainability_index INTEGER CHECK (sustainability_index >= 0 AND sustainability_index <= 100),
    resilience_score INTEGER CHECK (resilience_score >= 0 AND resilience_score <= 100),
    recommended_interventions TEXT[],
    predicted_trends JSONB,
    computation_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.water_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.climate_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wef_nexus_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for user-specific data
CREATE POLICY "Users can view their own water resources data" 
ON public.water_resources FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own water resources data" 
ON public.water_resources FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water resources data" 
ON public.water_resources FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water resources data" 
ON public.water_resources FOR DELETE 
USING (auth.uid() = user_id);

-- Similar policies for energy resources
CREATE POLICY "Users can view their own energy resources data" 
ON public.energy_resources FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own energy resources data" 
ON public.energy_resources FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own energy resources data" 
ON public.energy_resources FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own energy resources data" 
ON public.energy_resources FOR DELETE 
USING (auth.uid() = user_id);

-- Similar policies for food security
CREATE POLICY "Users can view their own food security data" 
ON public.food_security FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own food security data" 
ON public.food_security FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food security data" 
ON public.food_security FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food security data" 
ON public.food_security FOR DELETE 
USING (auth.uid() = user_id);

-- Similar policies for climate risks
CREATE POLICY "Users can view their own climate risks data" 
ON public.climate_risks FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own climate risks data" 
ON public.climate_risks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own climate risks data" 
ON public.climate_risks FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own climate risks data" 
ON public.climate_risks FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for stakeholder profiles
CREATE POLICY "Users can view their own stakeholder profile" 
ON public.stakeholder_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stakeholder profile" 
ON public.stakeholder_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stakeholder profile" 
ON public.stakeholder_profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stakeholder profile" 
ON public.stakeholder_profiles FOR DELETE 
USING (auth.uid() = user_id);

-- WEF Nexus Analytics - make public readable for insights
CREATE POLICY "WEF nexus analytics are publicly readable" 
ON public.wef_nexus_analytics FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_water_resources_location ON public.water_resources (location_lat, location_lng);
CREATE INDEX idx_water_resources_date ON public.water_resources (measurement_date);
CREATE INDEX idx_energy_resources_location ON public.energy_resources (location_lat, location_lng);
CREATE INDEX idx_energy_resources_date ON public.energy_resources (measurement_date);
CREATE INDEX idx_food_security_location ON public.food_security (location_lat, location_lng);
CREATE INDEX idx_food_security_date ON public.food_security (measurement_date);
CREATE INDEX idx_climate_risks_location ON public.climate_risks (location_lat, location_lng);
CREATE INDEX idx_climate_risks_type_level ON public.climate_risks (risk_type, risk_level);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_water_resources_updated_at
    BEFORE UPDATE ON public.water_resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_energy_resources_updated_at
    BEFORE UPDATE ON public.energy_resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_security_updated_at
    BEFORE UPDATE ON public.food_security
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_climate_risks_updated_at
    BEFORE UPDATE ON public.climate_risks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stakeholder_profiles_updated_at
    BEFORE UPDATE ON public.stakeholder_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wef_nexus_analytics_updated_at
    BEFORE UPDATE ON public.wef_nexus_analytics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();