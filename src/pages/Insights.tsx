import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Cloud, AlertTriangle, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for insights
const priceData = [
  { month: 'Jan', rice: 45, wheat: 38, tomato: 25 },
  { month: 'Feb', rice: 48, wheat: 40, tomato: 28 },
  { month: 'Mar', rice: 52, wheat: 42, tomato: 30 },
  { month: 'Apr', rice: 50, wheat: 45, tomato: 35 },
  { month: 'May', rice: 55, wheat: 48, tomato: 32 },
  { month: 'Jun', rice: 58, wheat: 50, tomato: 38 },
];

const demandData = [
  { crop: 'Rice', demand: 85 },
  { crop: 'Wheat', demand: 72 },
  { crop: 'Tomato', demand: 68 },
  { crop: 'Onion', demand: 55 },
  { crop: 'Potato', demand: 65 },
];

export default function Insights() {
  const { userRole, profile } = useAuth();
  const navigate = useNavigate();

  const isFarmer = userRole === 'farmer';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto py-4 px-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">AI Insights & Analytics</h1>
            <p className="text-sm text-muted-foreground">{profile?.full_name}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 space-y-6">
        {/* Weather Alert */}
        <Card className="border-2 border-yellow-500/50 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Weather Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Heavy rainfall expected in next 48 hours. Consider harvesting ready crops and protecting fields.</p>
          </CardContent>
        </Card>

        {/* Price Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Crop Price Trends (Last 6 Months)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rice" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="wheat" stroke="hsl(var(--secondary))" strokeWidth={2} />
                <Line type="monotone" dataKey="tomato" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Rice</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span>Wheat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span>Tomato</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Demand */}
        <Card>
          <CardHeader>
            <CardTitle>Market Demand Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>AI Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="font-semibold text-sm">Best time to sell Rice</p>
              <p className="text-sm text-muted-foreground">Prices expected to peak in next 2 weeks</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="font-semibold text-sm">High demand for Tomatoes</p>
              <p className="text-sm text-muted-foreground">Consider planting next season</p>
            </div>
            {isFarmer && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="font-semibold text-sm">Crop Rotation Suggested</p>
                <p className="text-sm text-muted-foreground">Add legumes to improve soil quality</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
