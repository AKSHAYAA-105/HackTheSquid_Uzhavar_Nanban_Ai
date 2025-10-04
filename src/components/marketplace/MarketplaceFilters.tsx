import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

interface MarketplaceFiltersProps {
  filters: {
    search: string;
    status: string;
    quality: string;
    minPrice: string;
    maxPrice: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function MarketplaceFilters({ filters, onFiltersChange }: MarketplaceFiltersProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search Crops</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="Search by crop type or variety"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ready">Ready to Sell</SelectItem>
              <SelectItem value="surplus">Surplus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quality">Quality</Label>
          <Select value={filters.quality} onValueChange={(value) => onFiltersChange({ ...filters, quality: value })}>
            <SelectTrigger id="quality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="grade_a">Grade A</SelectItem>
              <SelectItem value="grade_b">Grade B</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minPrice">Min Price (₹)</Label>
          <Input
            id="minPrice"
            type="number"
            step="0.01"
            value={filters.minPrice}
            onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price (₹)</Label>
          <Input
            id="maxPrice"
            type="number"
            step="0.01"
            value={filters.maxPrice}
            onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
            placeholder="Any"
          />
        </div>
      </div>
    </Card>
  );
}
