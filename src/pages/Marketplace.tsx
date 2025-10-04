import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CropCard } from "@/components/inventory/CropCard";
import { PlaceOrderDialog } from "@/components/inventory/PlaceOrderDialog";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

export default function Marketplace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    quality: "all",
    minPrice: "",
    maxPrice: "",
  });

  const fetchCrops = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("crops")
        .select("*")
        .in("status", ["ready", "surplus"])
        .order("created_at", { ascending: false });

      const { data, error } = await query;

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
      .channel("marketplace-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crops",
        },
        () => {
          fetchCrops();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePlaceOrder = (crop: any) => {
    setSelectedCrop(crop);
    setOrderDialogOpen(true);
  };

  const filteredCrops = crops.filter((crop) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        crop.crop_type.toLowerCase().includes(searchLower) ||
        crop.variety?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== "all" && crop.status !== filters.status) {
      return false;
    }

    // Quality filter
    if (filters.quality !== "all" && crop.quality_grade !== filters.quality) {
      return false;
    }

    // Price filters
    if (filters.minPrice && crop.expected_price < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && crop.expected_price > parseFloat(filters.maxPrice)) {
      return false;
    }

    return true;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Marketplace
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse and order crops from farmers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <MarketplaceFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading marketplace...
            </div>
          ) : filteredCrops.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No crops available</h3>
              <p className="text-muted-foreground">
                {filters.search || filters.status !== "all" || filters.quality !== "all"
                  ? "Try adjusting your filters"
                  : "Check back later for new listings"}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredCrops.length} {filteredCrops.length === 1 ? "crop" : "crops"}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCrops.map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    isFarmer={false}
                    onPlaceOrder={() => handlePlaceOrder(crop)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <PlaceOrderDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        crop={selectedCrop}
        onSuccess={fetchCrops}
      />
    </div>
  );
}
