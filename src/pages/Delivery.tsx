import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Thermometer, Truck, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  status: string;
  quantity: number;
  total_amount: number;
  created_at: string;
  crops?: {
    crop_type: string;
    variety?: string;
    location?: string;
  };
}

export default function Delivery() {
  const { orderId } = useParams();
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock delivery tracking data
  const trackingSteps = [
    { label: 'Order Confirmed', status: 'completed', time: '2 hours ago' },
    { label: 'Picked Up', status: 'completed', time: '1 hour ago' },
    { label: 'In Transit', status: 'current', time: 'Now' },
    { label: 'Delivered', status: 'pending', time: 'Est. 2 hours' },
  ];

  const coldStorageData = {
    temperature: '4°C',
    humidity: '85%',
    status: 'Optimal',
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          crops (
            crop_type,
            variety,
            location
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async () => {
    if (!orderId) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order marked as delivered',
      });

      navigate('/orders');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading delivery details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto py-4 px-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Delivery Tracking</h1>
            <p className="text-sm text-muted-foreground">
              {order.crops?.crop_type} {order.crops?.variety && `(${order.crops.variety})`}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 space-y-6">
        {/* Map placeholder */}
        <Card className="overflow-hidden">
          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Live GPS Tracking</p>
              <p className="text-xs text-muted-foreground">Real-time map integration</p>
            </div>
          </div>
        </Card>

        {/* Tracking Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <CardTitle>Delivery Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed'
                          ? 'bg-green-500'
                          : step.status === 'current'
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          step.status === 'completed' ? 'bg-green-500' : 'bg-muted'
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold">{step.label}</p>
                    <p className="text-sm text-muted-foreground">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cold Storage Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              <CardTitle>Cold Storage Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-2xl font-bold">{coldStorageData.temperature}</p>
                <p className="text-sm text-muted-foreground">Temperature</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-2xl font-bold">{coldStorageData.humidity}</p>
                <p className="text-sm text-muted-foreground">Humidity</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <Badge className="bg-green-500 text-white border-0 text-base px-3 py-1">
                  {coldStorageData.status}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-semibold">{order.quantity} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-semibold">₹{order.total_amount}</span>
            </div>
            {order.crops?.location && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup Location:</span>
                <span className="font-semibold">{order.crops.location}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action button for farmers */}
        {userRole === 'farmer' && order.status === 'in_transit' && (
          <Button onClick={markAsDelivered} className="w-full" size="lg">
            Confirm Delivery
          </Button>
        )}
      </main>
    </div>
  );
}
