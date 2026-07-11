import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Cloud, Users, TrendingUp, Linkedin, Twitter } from "lucide-react";
import clisenseLogo from "@/assets/clisense-logo.jpg";
import teamPhoto from "@/assets/team-photo.jpg";

const teamMembers = [
  {
    name: "Ayomide Agbaje",
    role: "Co-Founder & CEO • Project Lead, Chief Researcher",
    description: "Leads research and strategy for Africa's first WEF nexus data engine"
  },
  {
    name: "Olaniyi Olufemi",
    role: "Co-Founder & CTO • Field Operations Lead (Nigeria)",
    description: "Drives technology and field operations across Nigerian pilot communities"
  },
  {
    name: "Souvede Inshuti",
    role: "Co-Founder & COO • Rwanda Expansion Lead",
    description: "Leads agronomic methodology and East Africa expansion from Rwanda"
  }
];

export const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 pb-20">
        {/* Header */}
        <div className="bg-primary text-white p-6 flex flex-col items-center">
          <img 
            src={clisenseLogo} 
            alt="Clisense Logo" 
            className="h-16 w-auto object-contain mb-3"
          />
          <p className="text-center opacity-90">Africa's First Data Engine for the Water-Energy-Food Nexus</p>
        </div>

        <div className="p-4 space-y-6">
          {/* Mission Statement */}
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Leaf className="w-6 h-6" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Clisense is pioneering Africa's first data engine for the Water-Energy-Food (WEF) nexus — innovating at the intersection of technology, 
                agriculture, and climate risk. By combining solar-powered IoT sensors built from recycled e-waste, geospatial intelligence, AI analytics, 
                remote sensing, and predictive analytics, we deliver real-time, actionable insights to smallholder farmers, businesses, and policymakers 
                across Sub-Saharan Africa — including those in climate-affected refugee and displacement-affected communities.
              </p>
            </CardContent>
          </Card>

          {/* What We Deliver */}
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Cloud className="w-6 h-6" />
                What We Deliver
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="bg-emerald-500 text-white shrink-0">✓</Badge>
                <span className="text-muted-foreground">Solar-powered IoT sensors built from recycled e-waste — our flagship hardware product</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-emerald-500 text-white shrink-0">✓</Badge>
                <span className="text-muted-foreground">72-hour, 1km hyperlocal forecasts powered by CHIRPS satellite data and MODIS land surface temperature</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-emerald-500 text-white shrink-0">✓</Badge>
                <span className="text-muted-foreground">Early warnings via IVR, SMS, WhatsApp, and dashboard in Yoruba, Igbo, Kinyarwanda, and English</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge className="bg-emerald-500 text-white shrink-0">✓</Badge>
                <span className="text-muted-foreground">Farmer training to interpret data and combine community knowledge with accessible technology</span>
              </div>
            </CardContent>
          </Card>

          {/* Meet The Team */}
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Users className="w-6 h-6" />
                Meet The Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team Photo */}
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={teamPhoto} 
                  alt="Clisense Team" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Team Members Grid */}
              <div className="grid gap-4">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                    <p className="text-sm font-medium text-emerald-600 mb-1">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Our Story */}
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <Leaf className="w-6 h-6" />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                It started with Baba Okankiri — a lifelong farmer in Ado-Ekiti, Nigeria, whose crops and harvests were repeatedly washed away by 
                unpredictable floods despite a lifetime of hard work. His story is the story of millions of smallholder farmers across Sub-Saharan 
                Africa whose livelihoods are threatened by climate change with each passing season.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Co-founded in December 2023 at the ALU Social Innovation Hackathon (Top Solution award), Clisense was born to give farmers a fighting 
                chance. In Ikire, farmers traditionally read the height of weaver bird nests to predict serious rainfall — because birds have been 
                accumulating climate data far longer than any human instrument. Clisense asks the same question algorithmically.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we combine solar-powered IoT sensors, geospatial data, and AI analytics to democratize affordable food in fragile, arid, 
                and displacement-affected regions — strengthening local food systems through community-centered ownership models.
              </p>
            </CardContent>
          </Card>

          {/* Impact & Progress */}
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Our Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600">87%</div>
                  <div className="text-sm text-muted-foreground">Flood Prediction Accuracy</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600">30%</div>
                  <div className="text-sm text-muted-foreground">Crop Loss Reduction</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600">450T</div>
                  <div className="text-sm text-muted-foreground">Crops Protected</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600">47</div>
                  <div className="text-sm text-muted-foreground">Families Impacted</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600">100</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600">20</div>
                  <div className="text-sm text-muted-foreground">Paying Subscribers</div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pilot ran January–August 2024 in Osogbo and Ikire (Osun River flood corridor), validated against a non-enrolled control 
                group. Featured by TechCabal in January 2026. We're targeting 100,000 farmers by end of 2025 and 1M by Year 3, expanding 
                to Rwanda (Bugesera & Kayonza) and Kenya.
              </p>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-xl border border-primary/10">
                <p className="text-sm font-medium text-primary">Affordable Global Access — $1.37/month</p>
                <p className="text-xs text-muted-foreground mt-1">
                  A B2C micro-subscription that puts climate-smart insights within reach of every smallholder farmer, with B2B and B2G 
                  tiers for cooperatives, agri-insurers, and extension agencies.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};