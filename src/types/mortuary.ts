export type AvailabilityStatus = "available" | "limited" | "full";
export type PriceRange = "budget" | "mid-range" | "premium";

export interface City {
  id: string;
  name: string;
  slug: string;
  province: string;
}

export interface Mortuary {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  city_id: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  availability: AvailabilityStatus;
  price_range: PriceRange | null;
  is_active: boolean;
  is_approved: boolean;
  view_count: number;
  contact_clicks: number;
  created_at: string;
  updated_at: string;
}

export interface MortuaryService {
  id: string;
  mortuary_id: string;
  service_name: string;
}

export interface MortuaryHours {
  id: string;
  mortuary_id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export interface MortuaryWithDetails extends Mortuary {
  city: City;
  services: MortuaryService[];
  hours: MortuaryHours[];
}
