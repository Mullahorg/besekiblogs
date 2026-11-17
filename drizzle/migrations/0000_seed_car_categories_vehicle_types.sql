INSERT INTO public.categories (name, slug, description, color_token, sort_order) VALUES
('Car Buying Tips','success-stories','Checklists for comparing cars, inspecting condition and buying with confidence.','primary',1),
('Vehicle Guides','safety-escrow','Vehicle types, engines and features that work on Kenyan roads.','primary',2),
('Car Ownership','skills-business-tips','Financing, running costs, paperwork and getting the most from your car.','primary',3),
('Maintenance','product-updates','Simple maintenance advice for Kenya''s coastal climate.','primary',4),
('BESEKI News','community-news','New arrivals and showroom news from BESEKI.','primary',5),
('Buying FAQs','help-center','Straight answers to common car questions.','primary',6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.tags (name, slug) VALUES
('SUV','suv'),('Sedan','sedan'),('Hatchback','hatchback'),('Pickup','pickup'),('Van and Minibus','van'),
('Station Wagon','station-wagon'),('Coupe','coupe'),('Hybrid','hybrid'),('Electric','electric'),
('Diesel','diesel'),('Petrol','petrol'),('4x4','4x4'),('Locally Used','locally-used'),('Brand New','brand-new'),
('Toyota','toyota'),('Nissan','nissan'),('Mazda','mazda'),('Subaru','subaru'),('Honda','honda'),('Mercedes-Benz','mercedes-benz'),('Land Rover','land-rover')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.topics (name, slug, description, sort_order) VALUES
('Family cars','family-cars','Safe, roomy cars for school runs and road trips.',1),
('First car','first-car','Affordable, reliable picks for first-time buyers.',2),
('Business and fleet','business-fleet','Pickups and vans that earn their keep.',3),
('Car financing','car-financing','Loans, deposits and monthly payments explained.',4),
('Import and paperwork','import-paperwork','Logbooks, KRA duty and NTSA transfers.',5),
('Fuel economy','fuel-economy','Getting more kilometres from every litre.',6)
ON CONFLICT (slug) DO NOTHING;