
INSERT INTO hotels (id, name, city, address, stars, description, total_rooms, photo_url, created_at) VALUES 
('9f5eb8d0-b211-496c-88a2-02258ae41fe7', 'Juma Amazon Lodge', 'Autazes ', 'Rio Juma, Autazes - AM', 5, 'Um hotel de selva totalmente sustentável construído sobre palafitas na copa das árvores.', 21, 'https://www.carpemundi.com.br/wp-content/uploads/2024/05/rio-juma-amazonas.jpg.webp', '2026-01-17 20:34:18'),
('9180782e-21b9-49c0-b6bb-e0cfadfc2aae', 'Wood Hotel', 'Gramado', 'Rua Mário Bertoluci, 48', 4, 'Com conceito slow travel e design focado em madeira e arte local.', 31, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/705879453.jpg?k=6d809d62cd563743a0cf34171f17f65e9320f79524ec5893f3172c05c2382442&o=', '2026-01-17 20:32:06'),
('0e61915f-49a3-4dd1-ad90-92ae5e00f708', 'Hotel Colline de France', 'Gramado', 'Rua Vigilante, 400', 5, 'Inspirado no Segundo Império Francês, este hotel é frequentemente eleito um dos melhores do mundo.', 34, NULL, '2026-01-17 17:32:35'),
('265bf870-0c70-4323-913d-f4a7f96a5991', 'Fuso Concept Hotel', 'Florianópolis', 'Rua Praia do Forte, 540, Jurerê Internacional', 5, 'Hotel boutique de ultra-luxo localizado entre a Praia do Forte e Jurerê Internacional.', 13, 'https://viagem.cnnbrasil.com.br/wp-content/uploads/sites/5/2025/03/Fuso-Concept-Hotel-Florianopolis.jpg?w=1200&h=675&crop=1', '2026-01-17 17:31:31'),
('0db3907b-67aa-4b54-ab54-2e5d70bad0fa', 'Majestic Palace Hotel', 'Florianópolis', 'Avenida Jornalista Rubens de Arruda Ramos, 2746', 5, 'Localizado na icônica Avenida Beira-Mar Norte, referência para turismo de alto padrão.', 259, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/97962589.jpg?k=505fafce1a3b595b04e599382f0e0d69c4c325ac140fc89c36ac314b28c6fd18&o=', '2026-01-17 17:27:23'),
('6b3a3523-f9a8-4a22-8d8a-112c63a83f21', 'Copacaba Palace', 'Avenida Atlântica, 1702', 'Rio de Janeiro', 5, 'Inaugurado em 1923, o Copacabana Palace é um ícone da hotelaria mundial.', 239, 'https://www.kayak.com.br/rimg/himg/9e/40/39/ice-173128076-70754024_3XL-377444.jpg?width=836&height=607&crop=true', '2026-01-17 17:25:01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (id, hotel_id, responsible_name, start_date, end_date, created_at) VALUES 
('5146bc94-9f60-40d0-9f0a-714488487e79', '9f5eb8d0-b211-496c-88a2-02258ae41fe7', 'Carlos Almeida', '2026-06-01', '2026-06-08', '2026-01-17 20:34:59'),
('1fe94b74-285e-4d9f-bfc7-c891b08683a2', '0db3907b-67aa-4b54-ab54-2e5d70bad0fa', 'Sebastian Faro', '2026-03-20', '2026-03-24', '2026-01-19 09:13:01'),
('8d057d55-22e2-467d-8271-3e29685bc74a', '0e61915f-49a3-4dd1-ad90-92ae5e00f708', 'Jonatas Fidel', '2026-02-20', '2026-02-22', '2026-01-17 17:35:23'),
('006b6428-b322-4244-9bdf-45d8aa62f836', '265bf870-0c70-4323-913d-f4a7f96a5991', 'Carlos Almeida', '2026-02-15', '2026-02-20', '2026-01-17 18:43:49'),
('021d0f51-7918-4dc0-9454-b0829b5055f0', '6b3a3523-f9a8-4a22-8d8a-112c63a83f21', 'Fátima Lobo', '2026-01-30', '2026-02-06', '2026-01-17 19:00:21'),
('f1f812eb-1d43-4fbd-9206-98bb76abd493', '0e61915f-49a3-4dd1-ad90-92ae5e00f708', 'João Paulo da Silva', '2026-01-17', '2026-02-17', '2026-01-17 17:34:36')
ON CONFLICT (id) DO NOTHING;

INSERT INTO guests (id, booking_id, name, document, created_at) VALUES 
('a7e847c6-00fe-475d-befc-19f29df25d7a', '5146bc94-9f60-40d0-9f0a-714488487e79', 'Gloria Lima', '152528181', '2026-01-17 20:35:16'),
('0cadcf81-5e3d-43ca-a307-58927c0d69e9', '5146bc94-9f60-40d0-9f0a-714488487e79', 'Juca Paulo', '412035244', '2026-01-19 12:32:37'),
('7c8ad1a7-fe9d-4cad-bf31-cfbdcf191ebd', '1fe94b74-285e-4d9f-bfc7-c891b08683a2', 'Rogério Abreu', '10254331111', '2026-01-19 09:13:30'),
('657ffccd-ec3a-4072-afc7-83697ede8cb7', '8d057d55-22e2-467d-8271-3e29685bc74a', 'Sara Jorge', '15528282848', '2026-01-17 19:11:47'),
('09639ef2-e8ad-42be-96ab-da3d1907acce', '006b6428-b322-4244-9bdf-45d8aa62f836', 'Cassandra Amaro', '123.456.789-00', '2026-01-17 18:58:58'),
('6c26d401-fbe6-45b4-9737-222e15346dd8', '021d0f51-7918-4dc0-9454-b0829b5055f0', 'Maria Souza', '123.456.789-00', '2026-01-19 12:21:28'),
('9c374d20-85c5-4535-b3e3-eb1c425de0ea', 'f1f812eb-1d43-4fbd-9206-98bb76abd493', 'Felipe Ricci', '111111111', '2026-01-17 17:37:11'),
('07e17076-fa79-41b9-b771-dee131d52a8b', 'f1f812eb-1d43-4fbd-9206-98bb76abd493', 'Otávio Ricci', '111111111', '2026-01-17 17:37:20'),
('ff7b1ef8-d3e2-4028-ab4c-4ea2ddd48359', 'f1f812eb-1d43-4fbd-9206-98bb76abd493', 'Paula Fernandez', '153298001', '2026-01-17 17:36:13'),
('75b98969-9f3f-4385-a364-90946bb5b2f8', 'f1f812eb-1d43-4fbd-9206-98bb76abd493', 'Ruan Fernandez', '558245245', '2026-01-17 17:36:29')
ON CONFLICT (id) DO NOTHING;