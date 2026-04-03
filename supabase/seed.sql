-- Western Cape Mortuary Finder - Seed Data
-- Idempotent: uses ON CONFLICT to prevent duplicates

-- Seed 10 Western Cape cities
INSERT INTO cities (id, name, slug, province) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Beaufort West', 'beaufort-west', 'Western Cape'),
  ('a1000000-0000-0000-0000-000000000002', 'Cape Town', 'cape-town', 'Western Cape'),
  ('a1000000-0000-0000-0000-000000000003', 'George', 'george', 'Western Cape'),
  ('a1000000-0000-0000-0000-000000000004', 'Hermanus', 'hermanus', 'Western Cape'),
  ('a1000000-0000-0000-0000-000000000005', 'Knysna', 'knysna', 'Western Cape'),
  ('a1000000-0000-0000-0000-000000000006', 'Malmesbury', 'malmesbury', 'Western Cape'),
  ('a1000000-0000-0000-0000-000000000007', 'Mossel Bay', 'mossel-bay', 'Western Cape'),
  ('a1000000-0000-0000-0000-000000000008', 'Paarl', 'paarl', 'Western Cape'),
  ('a1000000-0000-0000-0000-000000000009', 'Stellenbosch', 'stellenbosch', 'Western Cape'),
  ('a1000000-0000-0000-0000-000000000010', 'Worcester', 'worcester', 'Western Cape')
ON CONFLICT (slug) DO NOTHING;

-- NOTE: Sample mortuaries below require an owner_id from auth.users.
-- When setting up Supabase, first create a test user, then replace the
-- owner_id below with that user's UUID.
--
-- For development, you can create a test user via Supabase dashboard:
-- Authentication > Users > Add User > test@example.com / Test1234

-- Sample mortuaries (owner_id must be replaced with a real auth.users UUID)
-- Uncomment and update after creating a test user:

/*
-- Replace 'YOUR_TEST_USER_UUID' with the actual UUID from auth.users
DO $$
DECLARE
  test_owner UUID := 'YOUR_TEST_USER_UUID';
  m1_id UUID := gen_random_uuid();
  m2_id UUID := gen_random_uuid();
  m3_id UUID := gen_random_uuid();
  m4_id UUID := gen_random_uuid();
  m5_id UUID := gen_random_uuid();
BEGIN

-- Mortuary 1: Cape Town - Available
INSERT INTO mortuaries (id, owner_id, name, slug, description, address, city_id, phone, whatsapp, availability, price_range, is_active, is_approved)
VALUES (m1_id, test_owner, 'Sunrise Mortuary', 'sunrise-mortuary',
  'A compassionate mortuary serving the Cape Town community since 1998.',
  '45 Main Road, Observatory, Cape Town, 7925',
  'a1000000-0000-0000-0000-000000000002', '+27214481234', '+27214481234',
  'available', 'mid-range', true, true);

INSERT INTO mortuary_services (mortuary_id, service_name) VALUES
  (m1_id, 'Cold Storage'), (m1_id, 'Embalming'), (m1_id, 'Viewing Room'), (m1_id, 'Chapel');

INSERT INTO mortuary_hours (mortuary_id, day_of_week, open_time, close_time, is_closed) VALUES
  (m1_id, 0, '09:00', '13:00', false), (m1_id, 1, '08:00', '17:00', false),
  (m1_id, 2, '08:00', '17:00', false), (m1_id, 3, '08:00', '17:00', false),
  (m1_id, 4, '08:00', '17:00', false), (m1_id, 5, '08:00', '17:00', false),
  (m1_id, 6, '08:00', '13:00', false);

-- Mortuary 2: Cape Town - Limited
INSERT INTO mortuaries (id, owner_id, name, slug, description, address, city_id, phone, availability, price_range, is_active, is_approved)
VALUES (m2_id, test_owner, 'Peninsula Memorial Services', 'peninsula-memorial-services',
  'Professional mortuary services in the heart of the Cape Peninsula.',
  '12 Kloof Street, Gardens, Cape Town, 8001',
  'a1000000-0000-0000-0000-000000000002', '+27213456789',
  'limited', 'premium', true, true);

INSERT INTO mortuary_services (mortuary_id, service_name) VALUES
  (m2_id, 'Cold Storage'), (m2_id, 'Embalming'), (m2_id, 'Viewing Room'),
  (m2_id, 'Chapel'), (m2_id, 'Cremation');

INSERT INTO mortuary_hours (mortuary_id, day_of_week, open_time, close_time, is_closed) VALUES
  (m2_id, 0, '00:00', '00:00', true), (m2_id, 1, '07:00', '18:00', false),
  (m2_id, 2, '07:00', '18:00', false), (m2_id, 3, '07:00', '18:00', false),
  (m2_id, 4, '07:00', '18:00', false), (m2_id, 5, '07:00', '18:00', false),
  (m2_id, 6, '08:00', '14:00', false);

-- Mortuary 3: Stellenbosch - Available
INSERT INTO mortuaries (id, owner_id, name, slug, description, address, city_id, phone, whatsapp, availability, price_range, is_active, is_approved)
VALUES (m3_id, test_owner, 'Stellenbosch Rest Haven', 'stellenbosch-rest-haven',
  'Serving Stellenbosch and surrounding winelands communities.',
  '78 Dorp Street, Stellenbosch, 7600',
  'a1000000-0000-0000-0000-000000000009', '+27218871234', '+27218871234',
  'available', 'budget', true, true);

INSERT INTO mortuary_services (mortuary_id, service_name) VALUES
  (m3_id, 'Cold Storage'), (m3_id, 'Body Collection'), (m3_id, 'Refrigeration');

INSERT INTO mortuary_hours (mortuary_id, day_of_week, open_time, close_time, is_closed) VALUES
  (m3_id, 0, '00:00', '00:00', true), (m3_id, 1, '08:00', '16:30', false),
  (m3_id, 2, '08:00', '16:30', false), (m3_id, 3, '08:00', '16:30', false),
  (m3_id, 4, '08:00', '16:30', false), (m3_id, 5, '08:00', '16:30', false),
  (m3_id, 6, '08:00', '12:00', false);

-- Mortuary 4: George - Full
INSERT INTO mortuaries (id, owner_id, name, slug, description, address, city_id, phone, availability, price_range, is_active, is_approved)
VALUES (m4_id, test_owner, 'Garden Route Mortuary', 'garden-route-mortuary',
  'The Garden Route trusted mortuary since 2005.',
  '34 York Street, George, 6529',
  'a1000000-0000-0000-0000-000000000003', '+27448741234',
  'full', 'mid-range', true, true);

INSERT INTO mortuary_services (mortuary_id, service_name) VALUES
  (m4_id, 'Cold Storage'), (m4_id, 'Embalming'), (m4_id, 'Body Collection');

INSERT INTO mortuary_hours (mortuary_id, day_of_week, open_time, close_time, is_closed) VALUES
  (m4_id, 0, '00:00', '00:00', true), (m4_id, 1, '08:00', '17:00', false),
  (m4_id, 2, '08:00', '17:00', false), (m4_id, 3, '08:00', '17:00', false),
  (m4_id, 4, '08:00', '17:00', false), (m4_id, 5, '08:00', '17:00', false),
  (m4_id, 6, '00:00', '00:00', true);

-- Mortuary 5: Paarl - Available
INSERT INTO mortuaries (id, owner_id, name, slug, description, address, city_id, phone, whatsapp, availability, price_range, is_active, is_approved)
VALUES (m5_id, test_owner, 'Paarl Valley Mortuary', 'paarl-valley-mortuary',
  'Compassionate care for the Paarl and Drakenstein community.',
  '56 Lady Grey Street, Paarl, 7646',
  'a1000000-0000-0000-0000-000000000008', '+27218631234', '+27218631234',
  'available', 'budget', true, true);

INSERT INTO mortuary_services (mortuary_id, service_name) VALUES
  (m5_id, 'Cold Storage'), (m5_id, 'Refrigeration'), (m5_id, 'Viewing Room'), (m5_id, 'Body Collection');

INSERT INTO mortuary_hours (mortuary_id, day_of_week, open_time, close_time, is_closed) VALUES
  (m5_id, 0, '09:00', '12:00', false), (m5_id, 1, '07:30', '17:00', false),
  (m5_id, 2, '07:30', '17:00', false), (m5_id, 3, '07:30', '17:00', false),
  (m5_id, 4, '07:30', '17:00', false), (m5_id, 5, '07:30', '17:00', false),
  (m5_id, 6, '08:00', '13:00', false);

END $$;
*/
