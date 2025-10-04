import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Calendar, MapPin, Coins } from "lucide-react";
import { format } from "date-fns";

interface CropCardProps {
  crop: {
    id: string;
    crop_type: string;
    variety?: string;
    quantity: number;
    unit: string;
    quality_grade: string;
    expected_price: number;
    minimum_price?: number;
    harvest_date?: string;
    status: 'fresh' | 'ready' | 'surplus' | 'sold';
    location?: string;
    description?: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkReady?: () => void;
  onPlaceOrder?: () => void;
  showActions?: boolean;
  isFarmer?: boolean;
}

const statusColors = {
  fresh: 'bg-green-500/10 text-green-700 border-green-500/20',
  ready: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  surplus: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  sold: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
};

const qualityLabels = {
  premium: 'Premium',
  grade_a: 'Grade A',
  grade_b: 'Grade B',
  standard: 'Standard',
};

export function CropCard({ crop, onEdit, onDelete, onMarkReady, onPlaceOrder, showActions = true, isFarmer = false }: CropCardProps) {
  const statusColor = statusColors[crop.status];

  return (
    <Card className={`hover-scale transition-all duration-200 border-l-4 ${
      crop.status === 'fresh' ? 'border-l-green-500' :
      crop.status === 'ready' ? 'border-l-blue-500' :
      crop.status === 'surplus' ? 'border-l-yellow-500' :
      'border-l-gray-500'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              {crop.crop_type}
              {crop.variety && <span className="text-sm text-muted-foreground">({crop.variety})</span>}
            </CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className={statusColor}>
                {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
              </Badge>
              <Badge variant="secondary" className="ml-2">
                {qualityLabels[crop.quality_grade as keyof typeof qualityLabels]}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Quantity:</span>
            <span>{crop.quantity} {crop.unit}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            <span className="font-semibold">₹{crop.expected_price}/{crop.unit}</span>
          </div>
        </div>

        {crop.minimum_price && (
          <div className="text-sm">
            <span className="text-muted-foreground">Min. Price:</span>
            <span className="ml-2 font-medium">₹{crop.minimum_price}/{crop.unit}</span>
          </div>
        )}

        {crop.harvest_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Harvest: {format(new Date(crop.harvest_date), 'MMM dd, yyyy')}</span>
          </div>
        )}

        {crop.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{crop.location}</span>
          </div>
        )}

        {crop.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{crop.description}</p>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2">
            {isFarmer ? (
              <>
                {crop.status === 'fresh' && onMarkReady && (
                  <Button onClick={onMarkReady} size="sm" variant="default" className="flex-1">
                    Mark Ready
                  </Button>
                )}
                {onEdit && (
                  <Button onClick={onEdit} size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button onClick={onDelete} size="sm" variant="destructive" className="flex-1">
                    Delete
                  </Button>
                )}
              </>
            ) : (
              onPlaceOrder && crop.status !== 'sold' && (
                <Button onClick={onPlaceOrder} size="sm" className="w-full">
                  Place Order
                </Button>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
