import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PlaceOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crop: {
    id: string;
    crop_type: string;
    variety?: string;
    quantity: number;
    unit: string;
    expected_price: number;
    minimum_price?: number;
    farmer_id: string;
  } | null;
  onSuccess: () => void;
}

export function PlaceOrderDialog({ open, onOpenChange, crop, onSuccess }: PlaceOrderDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    offered_price: "",
    delivery_preference: "",
    buyback_guarantee: false,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !crop) return;

    const quantity = parseFloat(formData.quantity);
    const offeredPrice = parseFloat(formData.offered_price);

    if (quantity > crop.quantity) {
      toast({
        title: "Error",
        description: "Order quantity cannot exceed available quantity",
        variant: "destructive",
      });
      return;
    }

    if (crop.minimum_price && offeredPrice < crop.minimum_price) {
      toast({
        title: "Error",
        description: `Offered price cannot be below minimum price of ₹${crop.minimum_price}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("orders").insert({
        crop_id: crop.id,
        vendor_id: user.id,
        farmer_id: crop.farmer_id,
        quantity,
        offered_price: offeredPrice,
        total_amount: quantity * offeredPrice,
        delivery_preference: formData.delivery_preference || null,
        buyback_guarantee: formData.buyback_guarantee,
        notes: formData.notes || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order placed successfully. Waiting for farmer confirmation.",
      });
      
      setFormData({
        quantity: "",
        offered_price: "",
        delivery_preference: "",
        buyback_guarantee: false,
        notes: "",
      });
      
      onSuccess();
      onOpenChange(false);
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

  if (!crop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
          <DialogDescription>
            {crop.crop_type} {crop.variety && `(${crop.variety})`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available:</span>
              <span className="font-medium">{crop.quantity} {crop.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected Price:</span>
              <span className="font-medium">₹{crop.expected_price}/{crop.unit}</span>
            </div>
            {crop.minimum_price && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Minimum Price:</span>
                <span className="font-medium">₹{crop.minimum_price}/{crop.unit}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity ({crop.unit}) *</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              max={crop.quantity}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offered_price">Offered Price (per {crop.unit}) *</Label>
            <Input
              id="offered_price"
              type="number"
              step="0.01"
              min={crop.minimum_price || 0}
              value={formData.offered_price}
              onChange={(e) => setFormData({ ...formData, offered_price: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          {formData.quantity && formData.offered_price && (
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-xl font-bold">
                  ₹{(parseFloat(formData.quantity) * parseFloat(formData.offered_price)).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="delivery_preference">Delivery Preference</Label>
            <Input
              id="delivery_preference"
              value={formData.delivery_preference}
              onChange={(e) => setFormData({ ...formData, delivery_preference: e.target.value })}
              placeholder="e.g., Express delivery, Standard delivery"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="buyback_guarantee"
              checked={formData.buyback_guarantee}
              onCheckedChange={(checked) => setFormData({ ...formData, buyback_guarantee: checked as boolean })}
            />
            <Label htmlFor="buyback_guarantee" className="cursor-pointer">
              Request buyback guarantee
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes or requirements"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Place Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
