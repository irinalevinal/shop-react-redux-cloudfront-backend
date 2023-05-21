create table cart_items (
	CONSTRAINT cart_id FOREIGN KEY (id) REFERENCES carts(id),
	product_id uuid,
	count integer,
);

create type status_enum AS ENUM ('OPEN', 'ORDERED');


create table IF NOT EXISTS carts (
	id uuid not null primary key,
	user_id uuid not null,
	created_at date not null,
	updated_at date not null,
	status status_enum
);

create table IF NOT EXISTS cart_items (
	product_id uuid,
	count integer
);


alter table cart_items 
	add column cart_id uuid 
	REFERENCES carts(id);
	



INSERT INTO carts (id, user_id, created_at, updated_at, status)
values (
    '2a9aeaec-a688-4199-8afc-174f64304292',
	'64f28774-8d01-48d1-b33a-5018ae27ec59',
	'2022-04-01',
	'2023-04-01',
	'OPEN'
),
(
    '8220bfc1-8ca6-45f3-98b3-83b121875e77',
	'000bcfbe-1e48-4413-8d9a-853901ad6492',
	'2022-04-01',
	'2023-04-01',
	'OPEN'
),
(
    '5a930fba-c21e-48fd-ae6a-b94e3bf3385f',
	'30bd72e3-3844-4027-b65c-1054efe574c6',
	'2022-04-01',
	'2023-04-01',
	'ORDERED'
),
(
    '96240883-9351-48b7-a260-42e7c6b4e6f0',
	'17bc1472-cc39-401b-af5d-c2c1a201cd3a',
	'2022-04-01',
	'2023-04-01',
	'OPEN'
);

INSERT INTO cart_items (cart_id, product_id, count)
values (
    '2a9aeaec-a688-4199-8afc-174f64304292',
	'64f28774-8d01-48d1-b33a-5018ae27ec59',
	1
),
(
    '5a930fba-c21e-48fd-ae6a-b94e3bf3385f',
	'30bd72e3-3844-4027-b65c-1054efe574c6',
	2
),
(
    '96240883-9351-48b7-a260-42e7c6b4e6f0',
	'17bc1472-cc39-401b-af5d-c2c1a201cd3a',
	3
);




create table IF NOT EXISTS orders (
	user_id uuid not null,
	created_at date not null,
	updated_at date not null,
	status status_enum
);

CREATE TABLE orders (
	user_id uuid not null,
	id uuid not null,
	payment json NULL,
	delivery json NULL,
	comments text NULL,
	status status_enum not null,
	total numeric NULL
);

alter table orders 
	add column cart_id uuid 
	REFERENCES carts(id);

INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total)
values (
    'fc2ec71d-3cf5-414f-ae08-f973b55a4a2c',
	'64f28774-8d01-48d1-b33a-5018ae27ec59',
	'2a9aeaec-a688-4199-8afc-174f64304292',
	'{}',
	'{}',
	'',
	'OPEN',
	200
),
(
    '8230118c-4c0c-4f51-82df-0b517c1619b2',
	'000bcfbe-1e48-4413-8d9a-853901ad6492',
	'8220bfc1-8ca6-45f3-98b3-83b121875e77',
	'{}',
	'{}',
	'',
	'OPEN',
	200
),
(
    '82cd6295-790b-4d1f-bb90-9ae9add185e7',
	'30bd72e3-3844-4027-b65c-1054efe574c6',
	'5a930fba-c21e-48fd-ae6a-b94e3bf3385f',
	'{}',
	'{}',
	'',
	'OPEN',
	200
),
(
    '2b913214-8712-4c2f-9e4f-fb8865223e44',
	'17bc1472-cc39-401b-af5d-c2c1a201cd3a',
	'96240883-9351-48b7-a260-42e7c6b4e6f0',
	'{}',
	'{}',
	'',
	'OPEN',
	200
);