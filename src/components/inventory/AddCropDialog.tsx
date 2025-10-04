import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddCropDialog({ open, onOpenChange, onSuccess }: AddCropDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    crop_type: "",
    variety: "",
    quantity: "",
    unit: "kg",
    quality_grade: "standard",
    expected_price: "",
    minimum_price: "",
    harvest_date: "",
    location: "",
    description: "",
    status: "fresh",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("crops").insert([{
        farmer_id: user.id,
        crop_type: formData.crop_type,
        variety: formData.variety || null,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        quality_grade: formData.quality_grade,
        expected_price: parseFloat(formData.expected_price),
        minimum_price: formData.minimum_price ? parseFloat(formData.minimum_price) : null,
        harvest_date: formData.harvest_date || null,
        location: formData.location || null,
        description: formData.description || null,
        status: formData.status,
      }] as any);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Crop added successfully",
      });
      
      setFormData({
        crop_type: "",
        variety: "",
        quantity: "",
        unit: "kg",
        quality_grade: "standard",
        expected_price: "",
        minimum_price: "",
        harvest_date: "",
        location: "",
        description: "",
        status: "fresh",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Crop</DialogTitle>
          <DialogDescription>
            Add your crop details to the inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crop_type">Crop Type *</Label>
              <Input
                id="crop_type"
                value={formData.crop_type}
                onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                placeholder="e.g., Rice, Wheat, Tomato"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variety">Variety</Label>
              <Input
                id="variety"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                placeholder="e.g., Basmati, Organic"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="quintal">Quintals</SelectItem>
                  <SelectItem value="ton">Tons</SelectItem>
                  <SelectItem value="bag">Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quality_grade">Quality Grade</Label>
              <Select value={formData.quality_grade} onValueChange={(value) => setFormData({ ...formData, quality_grade: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="grade_a">Grade A</SelectItem>
                  <SelectItem value="grade_b">Grade B</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresh">Fresh</SelectItem>
                  <SelectItem value="ready">Ready to Sell</SelectItem>
                  <SelectItem value="surplus">Surplus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expected_price">Expected Price (per unit) *</Label>
              <Input
                id="expected_price"
                type="number"
                step="0.01"
                value={formData.expected_price}
                onChange={(e) => setFormData({ ...formData, expected_price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimum_price">Minimum Price (per unit)</Label>
              <Input
                id="minimum_price"
                type="number"
                step="0.01"
                value={formData.minimum_price}
                onChange={(e) => setFormData({ ...formData, minimum_price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harvest_date">Harvest Date</Label>
              <Input
                id="harvest_date"
                type="date"
                value={formData.harvest_date}
                onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, District"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about the crop"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Crop
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
