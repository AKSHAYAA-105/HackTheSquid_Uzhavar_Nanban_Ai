import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CropCard } from "@/components/inventory/CropCard";
import { AddCropDialog } from "@/components/inventory/AddCropDialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Leaf } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Inventory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const fetchCrops = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crops")
        .select("*")
        .eq("farmer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCrops(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("crops-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crops",
          filter: `farmer_id=eq.${user?.id}`,
        },
        () => {
          fetchCrops();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleMarkReady = async (cropId: string) => {
    try {
      const { error } = await supabase
        .from("crops")
        .update({ status: "ready" })
        .eq("id", cropId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Crop marked as ready to sell",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (cropId: string) => {
    if (!confirm("Are you sure you want to delete this crop?")) return;

    try {
      const { error } = await supabase
        .from("crops")
        .delete()
        .eq("id", cropId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Crop deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredCrops = crops.filter((crop) => {
    if (activeTab === "all") return true;
    return crop.status === activeTab;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            My Inventory
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your crops and inventory
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Add Crop
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({crops.length})</TabsTrigger>
          <TabsTrigger value="fresh">Fresh ({crops.filter((c) => c.status === "fresh").length})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({crops.filter((c) => c.status === "ready").length})</TabsTrigger>
          <TabsTrigger value="surplus">Surplus ({crops.filter((c) => c.status === "surplus").length})</TabsTrigger>
          <TabsTrigger value="sold">Sold ({crops.filter((c) => c.status === "sold").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading crops...
            </div>
          ) : filteredCrops.length === 0 ? (
            <div className="text-center py-12">
              <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No crops found</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "all"
                  ? "Start by adding your first crop to the inventory"
                  : `No crops with status "${activeTab}"`}
              </p>
              {activeTab === "all" && (
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Crop
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCrops.map((crop) => (
                <CropCard
                  key={crop.id}
                  crop={crop}
                  isFarmer
                  onMarkReady={() => handleMarkReady(crop.id)}
                  onDelete={() => handleDelete(crop.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddCropDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchCrops}
      />
    </div>
  );
}
