import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  crop_id: string;
  quantity: number;
  offered_price: number;
  total_amount: number;
  status: string;
  created_at: string;
  notes?: string;
  delivery_preference?: string;
  crops?: {
    crop_type: string;
    variety?: string;
    location?: string;
  };
}

export default function Orders() {
  const { userRole, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // Subscribe to order updates
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: userRole === 'farmer' ? `farmer_id=eq.${user?.id}` : `vendor_id=eq.${user?.id}`
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userRole]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const query = supabase
        .from('orders')
        .select(`
          *,
          crops (
            crop_type,
            variety,
            location
          )
        `)
        .order('created_at', { ascending: false });

      if (userRole === 'farmer') {
        query.eq('farmer_id', user.id);
      } else {
        query.eq('vendor_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
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

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'negotiating' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Order ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      negotiating: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      confirmed: 'bg-green-500/10 text-green-500 border-green-500/20',
      in_transit: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'delivered') return <CheckCircle2 className="h-4 w-4" />;
    if (status === 'cancelled') return <XCircle className="h-4 w-4" />;
    if (status === 'in_transit') return <MapPin className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto py-4 px-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-sm text-muted-foreground">
              {userRole === 'farmer' ? 'Orders for your crops' : 'Your purchase orders'}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {order.crops?.crop_type} {order.crops?.variety && `(${order.crops.variety})`}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={`border ${getStatusColor(order.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.replace('_', ' ')}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-semibold">{order.quantity} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price per kg</p>
                    <p className="font-semibold">₹{order.offered_price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-semibold text-lg">₹{order.total_amount}</p>
                  </div>
                  {order.crops?.location && (
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-semibold">{order.crops.location}</p>
                    </div>
                  )}
                </div>

                {order.notes && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}

                {/* Action buttons for farmers */}
                {userRole === 'farmer' && order.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      className="flex-1"
                    >
                      Accept Order
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="flex-1"
                    >
                      Decline
                    </Button>
                  </div>
                )}

                {/* Status update for confirmed orders */}
                {userRole === 'farmer' && order.status === 'confirmed' && (
                  <Button 
                    onClick={() => updateOrderStatus(order.id, 'in_transit')}
                    className="w-full"
                  >
                    Mark as In Transit
                  </Button>
                )}

                {/* Delivery tracking */}
                {order.status === 'in_transit' && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/delivery/${order.id}`)}
                    className="w-full"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Track Delivery
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
