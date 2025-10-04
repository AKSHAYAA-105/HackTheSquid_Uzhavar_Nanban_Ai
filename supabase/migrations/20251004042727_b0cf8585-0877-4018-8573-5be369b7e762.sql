-- Create enums for crop status and quality
CREATE TYPE public.crop_status AS ENUM ('fresh', 'ready', 'surplus', 'sold');
CREATE TYPE public.quality_grade AS ENUM ('premium', 'grade_a', 'grade_b', 'standard');
CREATE TYPE public.order_status AS ENUM ('pending', 'negotiating', 'confirmed', 'in_transit', 'delivered', 'cancelled');

-- Create crops table
CREATE TABLE public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  variety TEXT,
  quantity NUMERIC NOT NULL CHECK (quantity >= 0),
  unit TEXT NOT NULL DEFAULT 'kg',
  quality_grade quality_grade NOT NULL DEFAULT 'standard',
  expected_price NUMERIC NOT NULL CHECK (expected_price >= 0),
  minimum_price NUMERIC CHECK (minimum_price >= 0),
  harvest_date DATE,
  status crop_status NOT NULL DEFAULT 'fresh',
  location TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  offered_price NUMERIC NOT NULL CHECK (offered_price >= 0),
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  status order_status NOT NULL DEFAULT 'pending',
  delivery_preference TEXT,
  buyback_guarantee BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crops
CREATE POLICY "Farmers can view their own crops"
  ON public.crops FOR SELECT
  USING (auth.uid() = farmer_id);

CREATE POLICY "Vendors can view all available crops"
  ON public.crops FOR SELECT
  USING (
    status IN ('ready', 'surplus') 
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('vendor', 'buyer')
    )
  );

CREATE POLICY "Farmers can insert their own crops"
  ON public.crops FOR INSERT
  WITH CHECK (
    auth.uid() = farmer_id 
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'farmer'
    )
  );

CREATE POLICY "Farmers can update their own crops"
  ON public.crops FOR UPDATE
  USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own crops"
  ON public.crops FOR DELETE
  USING (auth.uid() = farmer_id);

-- RLS Policies for orders
CREATE POLICY "Farmers can view orders for their crops"
  ON public.orders FOR SELECT
  USING (auth.uid() = farmer_id);

CREATE POLICY "Vendors can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (
    auth.uid() = vendor_id 
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('vendor', 'buyer')
    )
  );

CREATE POLICY "Vendors can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = vendor_id);

CREATE POLICY "Farmers can update orders for their crops"
  ON public.orders FOR UPDATE
  USING (auth.uid() = farmer_id);

-- Triggers for updated_at
CREATE TRIGGER update_crops_updated_at
  BEFORE UPDATE ON public.crops
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for performance
CREATE INDEX idx_crops_farmer_id ON public.crops(farmer_id);
CREATE INDEX idx_crops_status ON public.crops(status);
CREATE INDEX idx_crops_crop_type ON public.crops(crop_type);
CREATE INDEX idx_orders_vendor_id ON public.orders(vendor_id);
CREATE INDEX idx_orders_farmer_id ON public.orders(farmer_id);
CREATE INDEX idx_orders_crop_id ON public.orders(crop_id);
CREATE INDEX idx_orders_status ON public.orders(status);