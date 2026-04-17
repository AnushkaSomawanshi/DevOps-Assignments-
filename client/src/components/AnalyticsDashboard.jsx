import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Users, Activity, PlayCircle } from "lucide-react";

const COLORS = ['#FF69B4', '#8A2BE2', '#20B2AA', '#FF8C00', '#FF1493'];

export default function AnalyticsDashboard() {
  const [patientsData, setPatientsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [patientsRes, revenueRes, doctorsRes] = await Promise.all([
          fetch("/api/analytics/patients"),
          fetch("/api/analytics/revenue"),
          fetch("/api/analytics/doctors")
        ]);

        if (patientsRes.ok) setPatientsData(await patientsRes.json());
        if (revenueRes.ok) setRevenueData(await revenueRes.json());
        if (doctorsRes.ok) setDoctorsData(await doctorsRes.json());
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <Layout hideFooter>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Badge className="bg-primary/10 text-primary mb-2">Admin View</Badge>
            <h1 className="text-3xl font-bold font-display text-foreground">Hospital Analytics</h1>
            <p className="text-muted-foreground mt-1">Real-time insights and performance metrics</p>
          </div>
        </div>

        {/* Video Embed Section */}
        <Card className="mb-8 border border-border shadow-hospital-lg overflow-hidden card-elevated">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 md:p-8 flex flex-col justify-center bg-muted/30">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <PlayCircle className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold font-display mb-2">Hospital Data Analytics Explained</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Learn how data analytics helps hospitals manage resources, improve patient care, and maximize revenue efficiently.
              </p>
              <Button asChild variant="outline" className="w-fit">
                <a href="https://www.youtube.com/watch?v=2zEJ6dKp2qQ" target="_blank" rel="noreferrer">
                  Watch on YouTube
                </a>
              </Button>
            </div>
            <div className="bg-black relative aspect-video md:aspect-auto">
              <iframe
                className="w-full h-full absolute inset-0"
                src="https://www.youtube.com/embed/2zEJ6dKp2qQ"
                title="Hospital Data Analytics Explained"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">Loading Analytics...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patients Line Chart */}
            <Card className="card-elevated shadow-sm lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-bold font-display text-lg">Daily Patient Flow</h3>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patientsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" strokeOpacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dx={-10} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="patients" stroke="#FF69B4" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Bar Chart */}
            <Card className="card-elevated shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <h3 className="font-bold font-display text-lg">Monthly Revenue</h3>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" strokeOpacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dx={-10} />
                      <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="revenue" fill="#8A2BE2" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Performance Pie Chart */}
            <Card className="card-elevated shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="h-5 w-5 text-green-500" />
                  <h3 className="font-bold font-display text-lg">Doctor Workload</h3>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={doctorsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="appointments"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {doctorsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
