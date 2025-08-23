--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 17.4 (Ubuntu 17.4-1.pgdg24.04+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrator (
    first_name character varying(50),
    last_name character varying(50),
    email character varying(50),
    password character varying(250),
    role character varying(50),
    id integer NOT NULL,
    company_id integer
);


ALTER TABLE public.administrator OWNER TO postgres;

--
-- Name: administrator_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.administrator ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.administrator_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bicycle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bicycle (
    id integer NOT NULL,
    model character varying(50),
    c_year integer,
    type character varying(50),
    brand character varying(50),
    client_id integer
);


ALTER TABLE public.bicycle OWNER TO postgres;

--
-- Name: bicycle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.bicycle ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bicycle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bicycle_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bicycle_photos (
    id integer NOT NULL,
    file_path character varying(250) NOT NULL,
    bicycle_id integer NOT NULL
);


ALTER TABLE public.bicycle_photos OWNER TO postgres;

--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id integer NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    email character varying(50),
    phone character varying(50),
    address character varying(250),
    created_at date DEFAULT now(),
    password character varying(250),
    company_id integer,
    password_reset_token character varying(255),
    password_reset_token_expires timestamp without time zone
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.client ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.client_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company (
    name character varying(50),
    email character varying(50),
    subdomain character varying(50),
    logo character varying(50),
    theme_color character varying(50),
    phone character varying,
    created_at date DEFAULT now(),
    id integer NOT NULL
);


ALTER TABLE public.company OWNER TO postgres;

--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.company ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: geographical_zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geographical_zone (
    id integer NOT NULL,
    zone_name character varying(50) NOT NULL,
    coordinates public.geometry NOT NULL,
    created_at date DEFAULT now(),
    company_id integer
);


ALTER TABLE public.geographical_zone OWNER TO postgres;

--
-- Name: geographical_zone_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.geographical_zone ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.geographical_zone_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: intervention; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.intervention (
    appointment_start timestamp with time zone,
    type character varying(50),
    description character varying(200),
    status character varying(50),
    technician_id integer,
    client_id integer NOT NULL,
    bicycle_id integer NOT NULL,
    id integer NOT NULL,
    appointment_end timestamp with time zone,
    package character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    comment character varying(250)
);


ALTER TABLE public.intervention OWNER TO postgres;

--
-- Name: intervention_bicycle_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.intervention_bicycle_photos (
    id integer NOT NULL,
    file_path character varying,
    intervention_id integer
);


ALTER TABLE public.intervention_bicycle_photos OWNER TO postgres;

--
-- Name: intervention_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.intervention ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.intervention_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: intervention_technician_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.intervention_technician_photos (
    id integer NOT NULL,
    file_path character varying,
    intervention_id integer
);


ALTER TABLE public.intervention_technician_photos OWNER TO postgres;

--
-- Name: intervention_technician_photos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.intervention_technician_photos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.intervention_technician_photos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: interventionphoto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.interventionphoto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.interventionphoto_id_seq OWNER TO postgres;

--
-- Name: interventionphoto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.interventionphoto_id_seq OWNED BY public.intervention_bicycle_photos.id;


--
-- Name: interventionphoto_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.intervention_bicycle_photos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.interventionphoto_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: interventionproduct; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interventionproduct (
    id integer NOT NULL,
    id_1 character varying(50) NOT NULL,
    quantitiy integer,
    price numeric(15,2)
);


ALTER TABLE public.interventionproduct OWNER TO postgres;

--
-- Name: photo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.photo (
    id integer NOT NULL,
    uri character varying(50)
);


ALTER TABLE public.photo OWNER TO postgres;

--
-- Name: planning_model_zones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planning_model_zones (
    id integer NOT NULL,
    zone_id integer,
    planning_model_id_maintenance integer,
    planning_model_id_repair integer
);


ALTER TABLE public.planning_model_zones OWNER TO postgres;

--
-- Name: planning_model_zones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.planning_model_zones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.planning_model_zones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: planning_models; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planning_models (
    id integer NOT NULL,
    intervention_type character varying NOT NULL,
    slot_duration interval NOT NULL,
    available_days character varying NOT NULL,
    name character varying NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    company_id integer NOT NULL
);


ALTER TABLE public.planning_models OWNER TO postgres;

--
-- Name: planning_models_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.planning_models ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.planning_models_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id integer NOT NULL,
    name character varying(50),
    description integer,
    price numeric(15,2),
    stock_available integer
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_photos (
    id integer NOT NULL,
    id_1 integer NOT NULL
);


ALTER TABLE public.product_photos OWNER TO postgres;

--
-- Name: technician; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.technician (
    id integer NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    email character varying(50),
    phone character varying(50),
    password character varying(250),
    address character varying(255),
    created_at date DEFAULT now(),
    geographical_zone_id integer,
    is_available boolean DEFAULT true,
    company_id integer
);


ALTER TABLE public.technician OWNER TO postgres;

--
-- Name: technician_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.technician ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.technician_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: administrator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrator (first_name, last_name, email, password, role, id, company_id) FROM stdin;
Arsen	Kubatyan	kubatars.en@gmail.com	$2b$10$mgsWlqGcyHzKBKLHAAakZO3JGWKn3NBbaX6fPi/1/QVsWyrwyJQ4q	superadmin	4	10
Arsen	Kubatyan	k.ubatarsen@gmail.com	$2b$10$bsEDd/r7vK1u9LeI9r23nOCA.G1K2btlcfUpQ4A9Z9ETyi04Vtfbq	admin	11	10
ARsen	Kubat	sqdsqd@gmail.com	$2b$10$lRlDP4NjBP21hK3PIzExH.VGQwyNkxmmU69zoixOrMD3L2OZ618WW	admin	13	15
Admin	Test	admin.test@test.com	$2b$10$dYQvM8obpvOyZALPeTGE1u76R78cLaCp/Abd9UGnBtRNQox8Dj0na	superadmin	20	10
Seul	Admin	seul.admin@test.com	$2b$10$tCOtPAQgAIzRjbCxSmpt8.p5k2iPNM/c74mXt.igzXUK1ArhHTYZq	admin	21	10
\.


--
-- Data for Name: bicycle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bicycle (id, model, c_year, type, brand, client_id) FROM stdin;
3	sqs	2024	Vélo classique	BRAND	\N
4	sqs	2024	Vélo classique	BRAND	\N
5	sqs	2024	Vélo classique	BRAND	\N
6	sqs	2024	Vélo classique	BRAND	\N
7	sqs	2024	Vélo classique	BRAND	\N
8	sqs	2024	Vélo classique	BRAND	\N
9	sqs	2024	Vélo classique	BRAND	\N
10	sqs	2024	Vélo classique	BRAND	\N
11	sqs	2024	Vélo classique	BRAND	\N
12	sqs	2024	Vélo classique	BRAND	\N
13	sqs	2024	Vélo classique	BRAND	\N
14	sqs	2024	Vélo classique	BRAND	\N
15	sqs	2024	Vélo classique	BRAND	\N
16	sqs	2024	Vélo classique	BRAND	\N
17	sqs	2024	Vélo classique	BRAND	\N
18	sqs	2024	Vélo classique	BRAND	\N
19	sqs	2024	Vélo classique	BRAND	\N
20	sqs	2024	Vélo classique	BRAND	\N
21	sqs	2024	Vélo classique	BRAND	\N
22	sqs	2024	Vélo classique	BRAND	\N
23	sqs	2024	Vélo classique	BRAND	\N
24	sqs	2024	Vélo classique	BRAND	\N
25	sqs	2024	Vélo classique	BRAND	\N
26	sqs	2024	Vélo classique	BRAND	\N
27	sqs	2024	Vélo classique	BRAND	\N
28	sqs	2024	Vélo électrique (VAE)	BRAND	\N
29	sqs	2024	Vélo classique	BRAND	\N
30	sqs	2024	Vélo classique	BRAND	\N
31	sqs	2024	Vélo classique	BRAND	\N
32	sqs	2024	Vélo classique	BRAND	\N
33	sqs	2024	Vélo classique	BRAND	\N
34	sqs	2024	Vélo classique	BRAND	\N
35	sqs	2024	Vélo électrique (VAE)	BRAND	\N
36	sqs	2024	Vélo électrique (VAE)	BRAND	\N
37	sqs	2024	Vélo électrique (VAE)	BRAND	\N
38	sqs	2024	Vélo électrique (VAE)	BRAND	\N
39	sqs	2024	Vélo électrique (VAE)	BRAND	\N
40	sqs	2024	Vélo électrique (VAE)	BRAND	\N
41	sqs	2024	Vélo électrique (VAE)	BRAND	\N
42	sqs	2024	Vélo électrique (VAE)	BRAND	\N
43	sqs	2024	Vélo électrique (VAE)	BRAND	\N
44	sqs	2024	Vélo électrique (VAE)	BRAND	\N
45	sqs	2024	Vélo électrique (VAE)	BRAND	\N
46	sqs	2024	Vélo électrique (VAE)	BRAND	\N
47	sqs	2024	Vélo électrique (VAE)	BRAND	\N
48	sqs	2024	Vélo électrique (VAE)	BRAND	\N
49	sqs	2024	Vélo électrique (VAE)	BRAND	\N
50	sqs	2024	VTT	BRAND	\N
51	sqs	2024	VTT	BRAND	\N
52	sqs	2024	Vélo électrique (VAE)	BRAND	\N
53	sqs	2024	Vélo électrique (VAE)	BRAND	\N
54	sqs	2024	Vélo électrique (VAE)	BRAND	\N
55	sqs	2024	Vélo électrique (VAE)	BRAND	\N
56	sqs	2024	Vélo électrique (VAE)	BRAND	\N
57	sqs	2024	Vélo électrique (VAE)	BRAND	\N
58	sqs	2024	Vélo électrique (VAE)	BRAND	\N
59	sqs	2024	Vélo électrique (VAE)	BRAND	\N
60	sqs	2024	Vélo électrique (VAE)	BRAND	\N
61	sqs	2024	Vélo électrique (VAE)	BRAND	\N
62	sqs	2024	Vélo classique	BRAND	\N
63	sqs	2024	Vélo électrique (VAE)	BRAND	\N
64	sqs	2024	Vélo électrique (VAE)	BRAND	\N
65	sqs	2024	Vélo électrique (VAE)	BRAND	\N
66	sqs	2024	Vélo électrique (VAE)	BRAND	\N
67	sqs	2024	Vélo électrique (VAE)	BRAND	\N
68	sqs	2024	Vélo classique	BRAND	\N
69	sqs	2024	Vélo électrique (VAE)	BRAND	\N
70	sqs	2024	Vélo électrique (VAE)	BRAND	\N
71	sqs	2024	Vélo électrique (VAE)	BRAND	\N
72	sqs	2024	Vélo électrique (VAE)	BRAND	\N
73	sqs	2024	Vélo électrique (VAE)	BRAND	\N
74	sqs	2024	Vélo électrique (VAE)	BRAND	\N
75	sqs	2024	Vélo électrique (VAE)	BRAND	\N
76	sqs	2024	Vélo électrique (VAE)	BRAND	\N
77	sqs	2024	Vélo électrique (VAE)	BRAND	\N
78	sqs	2024	Vélo électrique (VAE)	BRAND	\N
79	sqs	2024	Vélo électrique (VAE)	BRAND	\N
80	sqs	2024	Vélo électrique (VAE)	BRAND	\N
81	sqs	2024	Vélo électrique (VAE)	BRAND	\N
82	sqs	2024	Vélo électrique (VAE)	BRAND	\N
83	sqs	2024	Vélo électrique (VAE)	BRAND	\N
84	sqs	2024	Vélo électrique (VAE)	BRAND	\N
85	sqs	2024	Vélo électrique (VAE)	BRAND	\N
86	sqs	2024	Vélo électrique (VAE)	BRAND	\N
87	sqs	2024	Vélo électrique (VAE)	BRAND	\N
88	sqs	2024	Vélo électrique (VAE)	BRAND	\N
89	sqs	2024	Vélo électrique (VAE)	BRAND	\N
90	sqs	2024	Vélo électrique (VAE)	BRAND	\N
91	sqs	2024	Vélo électrique (VAE)	BRAND	\N
92	sqs	2024	Vélo électrique (VAE)	BRAND	\N
93	sqs	2024	Vélo électrique (VAE)	BRAND	\N
94	sqs	2024	Vélo électrique (VAE)	BRAND	\N
95	sqs	2024	Vélo électrique (VAE)	BRAND	\N
96	sqs	2024	Vélo électrique (VAE)	BRAND	\N
97	sqs	2024	Vélo électrique (VAE)	BRAND	\N
98	sqs	2024	VTT	BRAND	\N
99	sqs	2024	Vélo électrique (VAE)	BRAND	\N
100	sqs	2024	Vélo classique	BRAND	\N
101	sqs	2024	Vélo électrique (VAE)	BRAND	\N
102	sqs	2024	Vélo électrique (VAE)	BRAND	\N
103	sqs	2024	Vélo classique	BRAND	\N
104	sqs	2024	Vélo électrique (VAE)	BRAND	\N
105	sqs	2024	Vélo électrique (VAE)	BRAND	\N
106	2024	2025	Vélo classique	Test	\N
107	hjhgjhg	2024	Vélo classique	aaaaa	\N
108	asasas	2024	Vélo classique	asas	\N
488	202555	2025	Vélo classique	aaaaa	\N
111	zzzzzzzzzz	2024	Vélo classique	zzzzzzzz	\N
112	aaaaaaaa	2024	Vélo classique	aaaa	\N
110	modele22222	2024	Vélo électrique (VAE)	Marque test	\N
118	2024	2024	Vélo classique	AAA	\N
119	Test	2024	Vélo classique	Test	\N
120	Test	2024	Vélo classique	Test	\N
121	Test	2024	Vélo classique	Test	\N
122	Test	2024	Vélo classique	Test	\N
123	Test	2024	Vélo classique	Test	\N
124	Test	2024	Vélo classique	Test	\N
125	aaa	2024	Vélo classique	aaa	\N
126	aaa	2024	Vélo électrique (VAE)	aaa	\N
127	aaa	2024	Vélo électrique (VAE)	aaa	\N
128	aaa	2024	Vélo classique	aaa	\N
129	aaaa	2020	Vélo classique	aaaa	\N
130	aaaaaaaaaaaaa	2024	VTT	aaaaaaaaaaaa	\N
131	azazazaz	2024	Vélo électrique (VAE)	aazaz	\N
132	aa	2020	Vélo électrique (VAE)	aa	\N
133	aaaa	2024	Vélo électrique (VAE)	aaaa	\N
134	asasas	2020	VTT	sas	\N
135	aaaaaaaaa	2024	Vélo électrique (VAE)	aaaaaa	\N
136	aaaaa	2021	Vélo électrique (VAE)	aaa	\N
137	aaaaaaa	2024	Vélo électrique (VAE)	aaaaaa	\N
138	aaaa	2024	Vélo électrique (VAE)	aaaa	\N
113	aaaaaa	2024	Vélo classique	aaaaaa	\N
117	rrrrrrrrrrr	2024	Vélo électrique (VAE)	rrrrrrrrr	\N
139	DEMO MODELE	2024	Vélo électrique (VAE)	DEMO MARQUE	\N
140	Default Model	2023	Vélo classique	Default Brand	\N
141	Default Model	2023	Vélo classique	Default Brand	\N
143	Default Model	2023	Vélo classique	Default Brand	\N
144	Default Model	2023	Vélo classique	Default Brand	\N
145	Default Model	2023	Vélo classique	Default Brand	\N
146	Default Model	2023	Vélo classique	Default Brand	\N
147	Default Model	2023	Vélo classique	apeeeeeeeeeee	\N
148	Default Model	2023	Vélo classique	engerrr	\N
149	Default Model	2023	Vélo classique	Default Brandaaaaaaaaaaaaaa	\N
150	Default Model	2023	Vélo classique	Default Brandaasasa	\N
151	Default Model	2023	Vélo classique	Default Brand	\N
152	Default Model	2023	Vélo classique	Default Brand	\N
153	Default Model	2023	Vélo classique	Default Brand	\N
154	Default Model	2023	Vélo classique	Default Brand	\N
155	Default Model	2023	Vélo classique	Default Brand	\N
156	Default Model	2023	Vélo classique	Default Brand	\N
157	Default Modelaaaaaaaaaaaaaaaaaaaaaaa	2023	Vélo classique	Default Brandaaaaaaaaaaaaaaaaaaaa	\N
158	Default Modelsasasas	2023	Vélo classique	Default Brandasasa	\N
159	Default Modelssasasasas	2023	Vélo classique	Default Brandasasa	\N
160	Default Model	2023	Vélo classique	Default Brand	\N
161	Default Model	2023	Vélo classique	Default Brand	\N
162	Default Model	2023	Vélo classique	Default Brand	\N
163	Default Model	2023	Vélo classique	Default Brand	\N
164	Default Model	2023	Vélo classique	Default Brand	\N
165	Default Model	2023	Vélo classique	Default Brand	\N
166	a	2024	Vélo électrique (VAE)	A	\N
167	Default Model	2023	Vélo classique	Default Brand	\N
142	a	2024	Vélo électrique (VAE)	A	\N
168	Default Model	2023	Vélo classique	Default Brand	\N
169	Default Model	2023	Vélo classique	Default Brand	\N
170	Default Model	2023	Vélo classique	Default Brand	\N
171	aaa	2020	Vélo classique	aa	\N
172	Default Model	2023	Vélo classique	Default Brand	\N
174	Stumpjumper	2022	Vélo classique	Specialized	\N
175	Default Model	2023	Vélo classique	Default Brand	\N
176	Default Model	2023	Vélo classique	Default Brand	\N
177	Default Model	2023	Vélo classique	Default Brand	\N
178	Default Model	2023	Vélo classique	Default Brand	\N
179	Default Model	2023	Vélo classique	Default Brand	\N
180	Default Model	2023	Vélo classique	Default Brand	\N
181	Default Model	2023	Vélo classique	Default Brand	\N
182	Default Model	2023	Vélo classique	Default Brand	\N
183	Default Model	2023	Vélo classique	Default Brand	\N
184	Default Model	2023	Vélo classique	Default Brand	\N
185	Default Model	2023	Vélo classique	Default Brand	\N
186	Default Model	2023	Vélo classique	Default Brand	\N
187	Default Model	2023	Vélo classique	Default Brand	\N
188	Default Model	2023	Vélo classique	Default Brand	\N
189	Default Model	2023	Vélo classique	Default Brand	\N
190	Default Model	2023	Vélo classique	Default Brand	\N
191	Default Model	2023	Vélo classique	Default Brand	\N
192	Stumpjumper	2022	Vélo classique	Specialized	\N
193	Stumpjumper	2022	Vélo classique	Specialized	\N
194	Default Model	2023	Vélo classique	Default Brand	\N
446	Premier Modèle	2024	Vélo classique	AAA_Brand	485
447	Dernier Modèle	2024	VTT	ZZZ_Brand	486
448	Domane SL	2023	Vélo classique	Trek	487
449	Sleek Gold Pants	2023	Vélo classique	Cannondale	493
450	Ergonomic Metal Salad	2023	VTT	Cannondale	500
451	Ergonomic Ceramic Chips	2022	Vélo électrique (VAE)	Giant	492
452	Licensed Steel Towels	2020	VTT	Giant	490
453	Frozen Silk Towels	2022	VTT	Trek	499
454	Bespoke Rubber Salad	2024	VTT	Trek	488
455	Handmade Bronze Ball	2022	Vélo électrique (VAE)	Giant	500
456	Electronic Aluminum Chair	2021	Vélo classique	Cannondale	486
457	Incredible Silk Bacon	2024	Vélo classique	Trek	504
458	Frozen Wooden Chair	2022	Vélo classique	Giant	495
459	Practical Wooden Bacon	2021	VTT	Cannondale	487
460	Small Silk Soap	2022	Vélo électrique (VAE)	Specialized	501
461	Gorgeous Rubber Computer	2023	Vélo classique	Cannondale	492
462	Tasty Cotton Shoes	2020	VTT	Specialized	500
463	Fantastic Concrete Ball	2021	VTT	Scott	487
464	Generic Plastic Soap	2018	Vélo électrique (VAE)	Specialized	494
465	Fresh Aluminum Mouse	2022	VTT	Cannondale	495
466	Generic Bronze Cheese	2020	VTT	Cannondale	486
467	Intelligent Bamboo Keyboard	2021	Vélo électrique (VAE)	Cannondale	489
468	Luxurious Plastic Gloves	2021	Vélo classique	Scott	486
469	Elegant Concrete Chips	2021	Vélo classique	Cannondale	500
470	Electronic Metal Table	2023	VTT	Giant	487
471	Practical Plastic Chicken	2019	VTT	Specialized	488
472	Rustic Ceramic Bike	2019	Vélo classique	Trek	501
473	Refined Steel Pants	2018	Vélo classique	Specialized	488
474	Bespoke Granite Gloves	2022	VTT	Giant	487
475	Licensed Cotton Chips	2018	VTT	Giant	486
476	Bespoke Metal Shirt	2019	Vélo classique	Cannondale	487
477	Unbranded Cotton Mouse	2023	VTT	Giant	489
478	Frozen Cotton Towels	2020	Vélo électrique (VAE)	Scott	485
479	Handmade Rubber Keyboard	2022	VTT	Specialized	502
480	Recycled Silk Chips	2020	Vélo classique	Trek	489
481	Handmade Metal Bacon	2024	Vélo électrique (VAE)	Giant	499
482	Oriental Silk Shirt	2022	Vélo classique	Specialized	497
483	Awesome Metal Towels	2020	Vélo électrique (VAE)	Trek	490
484	Frozen Rubber Mouse	2020	Vélo classique	Specialized	502
485	Small Ceramic Hat	2024	Vélo classique	Specialized	502
486	aaaaaaaaa	1950	Vélo classique	aaaaaaaa	\N
487	aaaaaaaa	2025	Vélo classique	aaaaaaa	\N
\.


--
-- Data for Name: bicycle_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bicycle_photos (id, file_path, bicycle_id) FROM stdin;
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, first_name, last_name, email, phone, address, created_at, password, company_id, password_reset_token, password_reset_token_expires) FROM stdin;
485	Client	Test	client.test@test.com	0123456789	123 Rue de Test, Paris	2025-07-12	$2b$10$8pyCUK12nAdLVTA9DEP/mOKePR0ugPiLGkXqjKwPdhTH5aU.McDxm	10	\N	\N
486	AAA_Premier	AAAA	premier@test.com	0100000001	1 Première Rue, Paris	2025-07-12	$2b$10$v/RsJbUXJw0YqyAwYI3jHuBSWBguDgF2EdqILw7ge7IH7pFWFqT4a	10	\N	\N
487	ZZZ_Dernier	ZZZZ	dernier@test.com	0100000002	999 Dernière Rue, Paris	2025-07-12	$2b$10$.NFe2jlQr24M.Tmh3k9APurQp3jSxCe4yRjY7rF9cliySn668zhdy	10	\N	\N
488	Martin	Dupont	martin.dupont@test.com	0100000003	10 Rue Martin, Paris	2025-07-12	$2b$10$WaNSWjtRx5GRbWUUz6igwe7izYYE1CRLncQN9m6zLfgual1lMxzSK	10	\N	\N
489	Marie	Martin	marie.martin@test.com	0100000004	20 Avenue Marie, Lyon	2025-07-12	$2b$10$NbVBr3gXWd.DTGijbcu08OdyevNEQm.svVKvxOnI6P6yclPwELr.S	10	\N	\N
490	Très	Ancien	ancien@test.com	0100000006	40 Rue Ancienne, Nice	2020-01-01	$2b$10$Il7LGi.gSePFHD8p9ZOZAu.oxURqazqJGygEd4NWUBgilkkFxxsdK	10	\N	\N
491	Easter	Boyer	client7@test.com	1-936-974-9728 x048	48314 Rolfson Crossing, Jastfort	2023-02-16	$2b$10$.K2QuWDWb5YF3hJpYGpCdup4nIZhYs5JoYxitdBUHYh11CZfBVFVy	\N	\N	\N
492	Dena	Wilkinson	client8@test.com	562-645-0510 x547	765 Clay Lane, Fort Maureen	2024-03-13	$2b$10$BUKlf/bcG9l8ixGvzIJDL.wBrZWAdb6JA2dqQ7vOJYN1oN5y2/0Ka	133	\N	\N
25	ArsencOMPANYa	Kubasss	ku.batarsen@gmail.com	0760114093		2025-01-09	$2a$12$/f2Utm2fwwQJ6eGQ1i56/O8w70x7s4PaSuMrzPqtae8chkC.FY5Im	15	\N	\N
493	Miles	Schmitt	client9@test.com	1-763-926-7406 x8262	187 Lera Ways, Revere	2023-10-08	$2b$10$lRR4qtHaJWvGsyzvmIY2oecsaCFlZ4u.L5e0FOIqRzTSooFrMuF8m	131	\N	\N
494	Chasity	Weber	client10@test.com	662-401-5212 x06543	5876 E 6th Avenue, West Miller	2023-02-19	$2b$10$xXNPOAh/wqayLBzVGh.JRuFQgHtTPCToHSGqnWxFWHrVa8VR89ndW	\N	\N	\N
495	Kole	Boyle	client11@test.com	282-702-5620 x2862	4325 Jacobs Stream, Bernhardworth	2024-05-03	$2b$10$QsAEcjl/547jrpOhdM2xO.zwyeOQSVI/Cn65EnLRsvDl4WNrGqSGm	132	\N	\N
496	Allie	Deckow	client12@test.com	1-291-798-6409 x95629	2335 Aufderhar Rapid, Des Moines	2024-09-28	$2b$10$cqxQUWy9JAJZ28IUgdZJzOTtlOXRiXQQrBGA7waEtyzcMTBAA8XCu	132	\N	\N
497	Delia	McGlynn	client13@test.com	790-680-6646 x717	4064 School Street, Mesquite	2024-05-31	$2b$10$KLsrVSuBt6hbosF5g.rJleJZvOun59aL8kr9HWkNGhHok3n.i6XZK	132	\N	\N
498	Junior	Kuhic-Schiller	client14@test.com	(282) 477-8798 x318	2875 Sandy Lane, New Adela	2024-04-24	$2b$10$ivtO4WlDir8ZCdD6XyF3nOx4tVCCVlSTTvc5j.PCyJE/3Cm5Vroh.	\N	\N	\N
499	Orpha	Oberbrunner	client15@test.com	1-554-541-7117	2533 Melany Drive, Elveraville	2023-12-21	$2b$10$Nc8e/WhPMscGU7jA5FR7muwKZxeWlywbi7bFyKAYhibS7Yg1jvV.q	132	\N	\N
500	Lauretta	Brown	client16@test.com	(518) 784-0435 x3664	911 Vandervort Fields, Vonhaven	2024-07-20	$2b$10$PHPFCn2PkdoQ/tXSn1zuY.FpHUxpqv5qXWHJNWVcPWXKUlw8EqeQW	131	\N	\N
501	Myrtice	Rolfson	client17@test.com	(975) 794-3959 x57126	75016 Marcelina Burgs, Barrowsstead	2024-03-02	$2b$10$i8DZ4rz9fCCyuXqU4Y8g/ezXePvTFYbNPBrn4A6Ffu7LkFtBzQ0ka	132	\N	\N
502	Clarabelle	Mayer	client18@test.com	(247) 593-9125 x5506	1440 Jenifer Terrace, Cedrickchester	2024-09-17	$2b$10$tO6xAIB5JaoiK2LMND0ei.ltlMdCYB68DalSUkPR6xy17Muh4Ganu	132	\N	\N
503	Carlee	Corkery	client19@test.com	(894) 844-5116 x834	14006 Hilll Coves, Alexandria	2023-07-04	$2b$10$HhNjX9kaf6tpgEf/YfEgfuPS1J9pDACQpAMRH0x4lASYvXAagOnxG	\N	\N	\N
504	Walker	O'Reilly	client20@test.com	609-314-0447 x6476	846 Angela Estate, Fort Amparostead	2023-11-04	$2b$10$OJYlFTZtZJInCd.7jYmIy.QJcQacjpOFLopzJjBr2fyUfWUGpsCSK	131	\N	\N
24	Arsen	Kubatyan	kubatarsen@gmail.com	0760114093	20 Rue du Pasteur Alphonse Cadier, 64000 Pau, France	2025-01-09	$2a$12$0nnE2BKFonSerw6lmXz4fOnChvZ0LgFbzTii64NDZtDKNLHV9Gj66	10	\N	\N
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company (name, email, subdomain, logo, theme_color, phone, created_at, id) FROM stdin;
LeCycleLyonnais	lecyclelyonnais@gmail.com	\N	\N	#121212	0760114093	2024-12-10	10
Test Company	contact@test.com	test	\N	#ff0000	0123456789	2025-07-12	131
Alpha Company	contactalpha@test.com	alpha	\N	#00ff00	0123456788	2025-07-12	132
Beta Company	contactbeta@test.com	beta	\N	#0000ff	0123456787	2025-07-12	133
Companybent	companyb@gmail.com	companyb	\N	#000000	0760114093	2025-01-09	16
CompanyA	companya@gmail.com	companya	\N	#000000	0760114093	2025-01-09	15
\.


--
-- Data for Name: geographical_zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.geographical_zone (id, zone_name, coordinates, created_at, company_id) FROM stdin;
29	Université de Pau	0103000020E61000000100000006000000A167C0794C59D8BFCB241522F4A84540B08AB22977B5D6BF166BC86FD5A845407AFB87213123D6BFBF15C1F409A7454068F6D2BB0ECED7BF4DD9324194A64540295DD0BC2690D8BFDCF4A6CBABA64540A167C0794C59D8BFCB241522F4A84540	2025-01-09	10
30	alsace lorraine	0103000020E61000000100000005000000F8ED5DFDEEF2D8BFB6006C076AA8454019E24EC52957D6BFB05D704E4AA84540F168413D57D9D5BF7BFD264EE7A54540D16DA92F381FD9BFA7C85366EBA54540F8ED5DFDEEF2D8BFB6006C076AA84540	2025-01-10	10
31	Billere	0103000020E610000001000000050000001979F9B71C78D9BFAB557206ADA64540B84C52281E58D9BF941F5A8473A7454072D7339E4E8ED8BF28F0B2DE56A74540188C391C64E3D8BFC1D0F38F2AA645401979F9B71C78D9BFAB557206ADA64540	2025-07-09	10
\.


--
-- Data for Name: intervention; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.intervention (appointment_start, type, description, status, technician_id, client_id, bicycle_id, id, appointment_end, package, created_at, comment) FROM stdin;
2025-01-14 09:00:00+01	maintenance			72	24	194	154	2025-01-14 10:00:00+01	basic	2025-01-10 11:39:49.172531+01	\N
2025-01-13 14:00:00+01	maintenance		completed	70	24	177	145	2025-01-13 15:00:00+01	basic	2025-01-09 15:58:52.495928+01	
2025-07-16 12:00:00+02	maintenance		canceled	72	24	486	155	2025-07-16 13:00:00+02	basic	2025-07-12 15:25:50.367796+02	null
2025-07-16 15:00:00+02	maintenance		canceled	72	24	487	156	2025-07-16 16:00:00+02	basic	2025-07-12 15:27:15.425832+02	null
2025-07-22 12:00:00+02	maintenance			72	24	488	157	2025-07-22 13:00:00+02	basic	2025-07-12 15:27:53.613338+02	\N
2025-01-13 09:00:00+01	maintenance		canceled	70	24	174	142	2025-01-13 10:00:00+01	basic	2025-01-09 15:54:53.011766+01	null
2025-01-13 10:00:00+01	maintenance		canceled	70	24	175	143	2025-01-13 11:00:00+01	basic	2025-01-09 15:55:10.460259+01	null
2025-01-13 16:00:00+01	maintenance		canceled	70	24	172	141	2025-01-13 17:00:00+01	basic	2025-01-09 15:51:18.513777+01	
\.


--
-- Data for Name: intervention_bicycle_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.intervention_bicycle_photos (id, file_path, intervention_id) FROM stdin;
45	uploads/bicycles/1736434492985-Capture dâÃ©cran du 2025-01-08 16-58-01.png	142
46	uploads/bicycles/1736434492986-Capture dâÃ©cran du 2025-01-08 17-05-30.png	142
47	uploads/bicycles/1736434492986-Capture dâÃ©cran du 2025-01-08 21-34-22.png	142
52	uploads/bicycles/1736505589137-Capture dâÃ©cran du 2025-01-08 14-42-49.png	154
53	uploads/bicycles/1736505589139-Capture dâÃ©cran du 2025-01-08 16-58-01.png	154
54	uploads/bicycles/1736505589141-Capture dâÃ©cran du 2025-01-08 17-05-30.png	154
55	uploads/bicycles/1736505589142-Capture dâÃ©cran du 2025-01-08 21-34-22.png	154
56	uploads/bicycles/1736505589142-Capture dâÃ©cran du 2025-01-09 11-24-21.png	154
57	uploads/bicycles/1752326835397-questionmark.png	156
58	uploads/bicycles/1752326873571-questionmark.png	157
\.


--
-- Data for Name: intervention_technician_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.intervention_technician_photos (id, file_path, intervention_id) FROM stdin;
\.


--
-- Data for Name: interventionproduct; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interventionproduct (id, id_1, quantitiy, price) FROM stdin;
\.


--
-- Data for Name: photo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.photo (id, uri) FROM stdin;
\.


--
-- Data for Name: planning_model_zones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.planning_model_zones (id, zone_id, planning_model_id_maintenance, planning_model_id_repair) FROM stdin;
17	29	18	19
18	30	20	19
19	31	18	19
\.


--
-- Data for Name: planning_models; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.planning_models (id, intervention_type, slot_duration, available_days, name, start_time, end_time, company_id) FROM stdin;
18	Maintenance	01:00:00	{"monday":true,"tuesday":true,"wednesday":true,"thursday":false,"friday":false,"saturday":false,"sunday":false}	TypeMaintenance	09:00:00	18:00:00	10
19	Réparation	01:36:00	{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,"friday":true,"saturday":null,"sunday":null}	TypeReparation	09:00:00	18:00:00	10
20	Maintenance	01:30:00	{"monday":true,"tuesday":false,"wednesday":false,"thursday":true,"friday":true,"saturday":false,"sunday":false}	MaintenanceTest	09:00:00	18:00:00	10
21	Maintenance	03:00:00	{"monday":true,"tuesday":true,"wednesday":false,"thursday":false,"friday":false,"saturday":false,"sunday":false}	Mode intervention longue	09:00:00	18:00:00	10
22	Réparation	02:00:00	{"monday":false,"tuesday":false,"wednesday":true,"thursday":true,"friday":true,"saturday":true,"sunday":false}	Réparation longue	10:00:00	17:00:00	10
23	Maintenance	01:00:00	{"monday":null,"tuesday":null,"wednesday":null,"thursday":null,"friday":null,"saturday":true,"sunday":true}	Forfait weekend	09:00:00	18:00:00	10
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, name, description, price, stock_available) FROM stdin;
\.


--
-- Data for Name: product_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_photos (id, id_1) FROM stdin;
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: technician; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.technician (id, first_name, last_name, email, phone, password, address, created_at, geographical_zone_id, is_available, company_id) FROM stdin;
72	Kubtyan	Kubtyan	kubatarse.n@gmail.com	06 06 06 06 06	$2b$10$v9MAtFGKeI9Ps9nRxoKS.eWL92vr7Y/hJvZFg16.kCuPQt7tG6iMi	Allée Zéline Reclus, Dufau-Tourasse, Pau, Pyrénées-Atlantiques, Nouvelle-Aquitaine, France métropolitaine, 64000, France	2025-01-09	29	t	10
70	technician123	technician1	kub.atarsen@gmail.com	06 06 06 06 06	$2b$10$YR96Z6i6R9GgLCWTWqDJbOI4KeNt53yz5S22zmKkKqak0SwvpDR2O	20 Rue du Pasteur Alphonse Cadier, 64000 Pau, France	2025-01-09	29	t	10
73	Kubtyan	Kubtyan	kubatarsen@gmail.com	06 06 06 06 06	$2b$10$UiigoQ5IFQIHT.ZDUAJJUuTlwgIJHZjtZLDUDco84Q1n548DFw58a	Rue Léonard Constant, 64000 Pau, France	2025-01-10	29	t	10
74	Kubtyan	Kubtyan	kubatn@gmail.com	06 06 06 06 06	$2b$10$rBEAiVCwsTFua.gLcGI9HeZkEOSITcXztw.Z/LuHPjknJW4PcxcOe	Rue Léonard Constant, 64000 Pau, France	2025-01-10	29	t	10
75	John	Doe	johndoe@gmail.com	06 06 06 06 06	$2b$10$DDygwMYLFP7MVP8HQMZx1uxrlWWgKWzHVrSV9cOPOOuUwhKdDf3i2	Rue Claverie, Lotissement Clos des Lilas, Mont Joly, Billère, Pau, Pyrénées-Atlantiques, Nouvelle-Aquitaine, France métropolitaine, 64140, France	2025-07-09	31	t	10
94	Technicien	Test	tech.test@test.com	0123456787	$2b$10$E9Cc6DRRL1LSLapKJSTaeuwJ8k3wpGKuUDU5o1pBYJNotEcXnZO8O	789 Boulevard Tech, Marseille	2025-07-12	\N	t	10
95	AAA_Premier	Technicien	tech.premier@test.com	0100000010	$2b$10$9VDZ7tQmZT.UpDL4ga5OIeGTyKQnXU8ORnMS6wzDYHN1o25xbZMri	1 Rue Technique, Paris	2025-07-12	\N	t	10
\.


--
-- Name: administrator_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrator_id_seq', 21, true);


--
-- Name: bicycle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bicycle_id_seq', 488, true);


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 504, true);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_id_seq', 133, true);


--
-- Name: geographical_zone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.geographical_zone_id_seq', 32, true);


--
-- Name: intervention_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.intervention_id_seq', 157, true);


--
-- Name: intervention_technician_photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.intervention_technician_photos_id_seq', 24, true);


--
-- Name: interventionphoto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.interventionphoto_id_seq', 1, false);


--
-- Name: interventionphoto_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.interventionphoto_id_seq1', 58, true);


--
-- Name: planning_model_zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.planning_model_zones_id_seq', 20, true);


--
-- Name: planning_models_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.planning_models_id_seq', 23, true);


--
-- Name: technician_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.technician_id_seq', 95, true);


--
-- Name: administrator administrator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrator
    ADD CONSTRAINT administrator_pkey PRIMARY KEY (id);


--
-- Name: bicycle_photos bicyclePhoto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bicycle_photos
    ADD CONSTRAINT "bicyclePhoto_pkey" PRIMARY KEY (id);


--
-- Name: bicycle bicycle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bicycle
    ADD CONSTRAINT bicycle_pkey PRIMARY KEY (id);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: company email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- Name: geographical_zone geographical_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geographical_zone
    ADD CONSTRAINT geographical_zone_pkey PRIMARY KEY (id);


--
-- Name: intervention intervention_id_4_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intervention
    ADD CONSTRAINT intervention_id_4_key UNIQUE (bicycle_id);


--
-- Name: intervention intervention_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intervention
    ADD CONSTRAINT intervention_pkey PRIMARY KEY (id);


--
-- Name: intervention_bicycle_photos interventionphoto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intervention_bicycle_photos
    ADD CONSTRAINT interventionphoto_pkey PRIMARY KEY (id);


--
-- Name: intervention_technician_photos interventionphototech_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intervention_technician_photos
    ADD CONSTRAINT interventionphototech_pkey PRIMARY KEY (id);


--
-- Name: interventionproduct interventionproduct_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interventionproduct
    ADD CONSTRAINT interventionproduct_pkey PRIMARY KEY (id, id_1);


--
-- Name: photo photo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.photo
    ADD CONSTRAINT photo_pkey PRIMARY KEY (id);


--
-- Name: planning_model_zones planning_model_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_model_zones
    ADD CONSTRAINT planning_model_zones_pkey PRIMARY KEY (id);


--
-- Name: planning_models planning_models_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_models
    ADD CONSTRAINT planning_models_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product_photos productphoto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_photos
    ADD CONSTRAINT productphoto_pkey PRIMARY KEY (id, id_1);


--
-- Name: technician technician_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technician
    ADD CONSTRAINT technician_email_key UNIQUE (email);


--
-- Name: technician technician_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technician
    ADD CONSTRAINT technician_pkey PRIMARY KEY (id);


--
-- Name: administrator administrator_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrator
    ADD CONSTRAINT administrator_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: bicycle_photos bicycle_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bicycle_photos
    ADD CONSTRAINT bicycle_id FOREIGN KEY (bicycle_id) REFERENCES public.bicycle(id) NOT VALID;


--
-- Name: bicycle clientId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bicycle
    ADD CONSTRAINT "clientId" FOREIGN KEY (client_id) REFERENCES public.client(id) ON UPDATE SET NULL ON DELETE SET NULL NOT VALID;


--
-- Name: planning_models company_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_models
    ADD CONSTRAINT company_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: client company_fkey_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT company_fkey_id FOREIGN KEY (company_id) REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: geographical_zone company_fkey_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geographical_zone
    ADD CONSTRAINT company_fkey_id FOREIGN KEY (company_id) REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: technician company_pkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technician
    ADD CONSTRAINT company_pkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: technician geographical_zone_pkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technician
    ADD CONSTRAINT geographical_zone_pkey FOREIGN KEY (geographical_zone_id) REFERENCES public.geographical_zone(id) NOT VALID;


--
-- Name: intervention intervention_id_2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intervention
    ADD CONSTRAINT intervention_id_2_fkey FOREIGN KEY (technician_id) REFERENCES public.technician(id);


--
-- Name: intervention intervention_id_3_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intervention
    ADD CONSTRAINT intervention_id_3_fkey FOREIGN KEY (client_id) REFERENCES public.client(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: intervention intervention_id_4_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intervention
    ADD CONSTRAINT intervention_id_4_fkey FOREIGN KEY (bicycle_id) REFERENCES public.bicycle(id) ON UPDATE SET NULL ON DELETE SET NULL NOT VALID;


--
-- Name: intervention_bicycle_photos intervention_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intervention_bicycle_photos
    ADD CONSTRAINT intervention_id_fkey FOREIGN KEY (intervention_id) REFERENCES public.intervention(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: intervention_technician_photos intervention_photos_intervention_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intervention_technician_photos
    ADD CONSTRAINT intervention_photos_intervention_id_fkey FOREIGN KEY (intervention_id) REFERENCES public.intervention(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: interventionproduct interventionproduct_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interventionproduct
    ADD CONSTRAINT interventionproduct_id_fkey FOREIGN KEY (id) REFERENCES public.product(id);


--
-- Name: planning_model_zones planningIdMaintenance; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_model_zones
    ADD CONSTRAINT "planningIdMaintenance" FOREIGN KEY (planning_model_id_maintenance) REFERENCES public.planning_models(id) NOT VALID;


--
-- Name: planning_model_zones planningIdRepair; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_model_zones
    ADD CONSTRAINT "planningIdRepair" FOREIGN KEY (planning_model_id_repair) REFERENCES public.planning_models(id) NOT VALID;


--
-- Name: product_photos productphoto_id_1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_photos
    ADD CONSTRAINT productphoto_id_1_fkey FOREIGN KEY (id_1) REFERENCES public.photo(id);


--
-- Name: product_photos productphoto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_photos
    ADD CONSTRAINT productphoto_id_fkey FOREIGN KEY (id) REFERENCES public.product(id);


--
-- Name: planning_model_zones zoneId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planning_model_zones
    ADD CONSTRAINT "zoneId" FOREIGN KEY (zone_id) REFERENCES public.geographical_zone(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: FUNCTION box2d_in(cstring); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box2d_in(cstring) TO lecycleuser;


--
-- Name: FUNCTION box2d_out(public.box2d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box2d_out(public.box2d) TO lecycleuser;


--
-- Name: FUNCTION box2df_in(cstring); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box2df_in(cstring) TO lecycleuser;


--
-- Name: FUNCTION box2df_out(public.box2df); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box2df_out(public.box2df) TO lecycleuser;


--
-- Name: FUNCTION box3d_in(cstring); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box3d_in(cstring) TO lecycleuser;


--
-- Name: FUNCTION box3d_out(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box3d_out(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION geography_analyze(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_analyze(internal) TO lecycleuser;


--
-- Name: FUNCTION geography_in(cstring, oid, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_in(cstring, oid, integer) TO lecycleuser;


--
-- Name: FUNCTION geography_out(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_out(public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography_recv(internal, oid, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_recv(internal, oid, integer) TO lecycleuser;


--
-- Name: FUNCTION geography_send(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_send(public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography_typmod_in(cstring[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_typmod_in(cstring[]) TO lecycleuser;


--
-- Name: FUNCTION geography_typmod_out(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_typmod_out(integer) TO lecycleuser;


--
-- Name: FUNCTION geometry_analyze(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_analyze(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_in(cstring); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_in(cstring) TO lecycleuser;


--
-- Name: FUNCTION geometry_out(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_out(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_recv(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_recv(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_send(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_send(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_typmod_in(cstring[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_typmod_in(cstring[]) TO lecycleuser;


--
-- Name: FUNCTION geometry_typmod_out(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_typmod_out(integer) TO lecycleuser;


--
-- Name: FUNCTION gidx_in(cstring); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gidx_in(cstring) TO lecycleuser;


--
-- Name: FUNCTION gidx_out(public.gidx); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gidx_out(public.gidx) TO lecycleuser;


--
-- Name: FUNCTION spheroid_in(cstring); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.spheroid_in(cstring) TO lecycleuser;


--
-- Name: FUNCTION spheroid_out(public.spheroid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.spheroid_out(public.spheroid) TO lecycleuser;


--
-- Name: FUNCTION box3d(public.box2d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box3d(public.box2d) TO lecycleuser;


--
-- Name: FUNCTION geometry(public.box2d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry(public.box2d) TO lecycleuser;


--
-- Name: FUNCTION box(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION box2d(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box2d(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION geometry(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION geography(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography(bytea) TO lecycleuser;


--
-- Name: FUNCTION geometry(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry(bytea) TO lecycleuser;


--
-- Name: FUNCTION bytea(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.bytea(public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography(public.geography, integer, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography(public.geography, integer, boolean) TO lecycleuser;


--
-- Name: FUNCTION geometry(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry(public.geography) TO lecycleuser;


--
-- Name: FUNCTION box(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION box2d(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box2d(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION box3d(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box3d(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION bytea(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.bytea(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geography(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry(public.geometry, integer, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry(public.geometry, integer, boolean) TO lecycleuser;


--
-- Name: FUNCTION "json"(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public."json"(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION jsonb(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.jsonb(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION path(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.path(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION point(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.point(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION polygon(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.polygon(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION text(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.text(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry(path); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry(path) TO lecycleuser;


--
-- Name: FUNCTION geometry(point); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry(point) TO lecycleuser;


--
-- Name: FUNCTION geometry(polygon); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry(polygon) TO lecycleuser;


--
-- Name: FUNCTION geometry(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry(text) TO lecycleuser;


--
-- Name: FUNCTION _postgis_deprecate(oldname text, newname text, version text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._postgis_deprecate(oldname text, newname text, version text) TO lecycleuser;


--
-- Name: FUNCTION _postgis_index_extent(tbl regclass, col text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._postgis_index_extent(tbl regclass, col text) TO lecycleuser;


--
-- Name: FUNCTION _postgis_join_selectivity(regclass, text, regclass, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._postgis_join_selectivity(regclass, text, regclass, text, text) TO lecycleuser;


--
-- Name: FUNCTION _postgis_pgsql_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._postgis_pgsql_version() TO lecycleuser;


--
-- Name: FUNCTION _postgis_scripts_pgsql_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._postgis_scripts_pgsql_version() TO lecycleuser;


--
-- Name: FUNCTION _postgis_selectivity(tbl regclass, att_name text, geom public.geometry, mode text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._postgis_selectivity(tbl regclass, att_name text, geom public.geometry, mode text) TO lecycleuser;


--
-- Name: FUNCTION _postgis_stats(tbl regclass, att_name text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._postgis_stats(tbl regclass, att_name text, text) TO lecycleuser;


--
-- Name: FUNCTION _st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION _st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION _st_3dintersects(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_3dintersects(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_asgml(integer, public.geometry, integer, integer, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_asgml(integer, public.geometry, integer, integer, text, text) TO lecycleuser;


--
-- Name: FUNCTION _st_asx3d(integer, public.geometry, integer, integer, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_asx3d(integer, public.geometry, integer, integer, text) TO lecycleuser;


--
-- Name: FUNCTION _st_bestsrid(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_bestsrid(public.geography) TO lecycleuser;


--
-- Name: FUNCTION _st_bestsrid(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_bestsrid(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION _st_contains(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_contains(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_containsproperly(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_containsproperly(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_coveredby(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_coveredby(geog1 public.geography, geog2 public.geography) TO lecycleuser;


--
-- Name: FUNCTION _st_coveredby(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_coveredby(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_covers(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_covers(geog1 public.geography, geog2 public.geography) TO lecycleuser;


--
-- Name: FUNCTION _st_covers(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_covers(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_crosses(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_crosses(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION _st_distancetree(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_distancetree(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION _st_distancetree(public.geography, public.geography, double precision, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_distancetree(public.geography, public.geography, double precision, boolean) TO lecycleuser;


--
-- Name: FUNCTION _st_distanceuncached(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION _st_distanceuncached(public.geography, public.geography, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography, boolean) TO lecycleuser;


--
-- Name: FUNCTION _st_distanceuncached(public.geography, public.geography, double precision, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography, double precision, boolean) TO lecycleuser;


--
-- Name: FUNCTION _st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION _st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION _st_dwithinuncached(public.geography, public.geography, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_dwithinuncached(public.geography, public.geography, double precision) TO lecycleuser;


--
-- Name: FUNCTION _st_dwithinuncached(public.geography, public.geography, double precision, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_dwithinuncached(public.geography, public.geography, double precision, boolean) TO lecycleuser;


--
-- Name: FUNCTION _st_equals(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_equals(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_expand(public.geography, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_expand(public.geography, double precision) TO lecycleuser;


--
-- Name: FUNCTION _st_geomfromgml(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_geomfromgml(text, integer) TO lecycleuser;


--
-- Name: FUNCTION _st_intersects(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_intersects(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_linecrossingdirection(line1 public.geometry, line2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_linecrossingdirection(line1 public.geometry, line2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_longestline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_longestline(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_maxdistance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_maxdistance(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_orderingequals(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_orderingequals(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_overlaps(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_overlaps(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_pointoutside(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_pointoutside(public.geography) TO lecycleuser;


--
-- Name: FUNCTION _st_sortablehash(geom public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_sortablehash(geom public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_touches(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_touches(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION _st_voronoi(g1 public.geometry, clip public.geometry, tolerance double precision, return_polygons boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_voronoi(g1 public.geometry, clip public.geometry, tolerance double precision, return_polygons boolean) TO lecycleuser;


--
-- Name: FUNCTION _st_within(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public._st_within(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION addauth(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.addauth(text) TO lecycleuser;


--
-- Name: FUNCTION addgeometrycolumn(table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.addgeometrycolumn(table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean) TO lecycleuser;


--
-- Name: FUNCTION addgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.addgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean) TO lecycleuser;


--
-- Name: FUNCTION addgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer, new_type character varying, new_dim integer, use_typmod boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.addgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer, new_type character varying, new_dim integer, use_typmod boolean) TO lecycleuser;


--
-- Name: FUNCTION box3dtobox(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.box3dtobox(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION checkauth(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.checkauth(text, text) TO lecycleuser;


--
-- Name: FUNCTION checkauth(text, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.checkauth(text, text, text) TO lecycleuser;


--
-- Name: FUNCTION checkauthtrigger(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.checkauthtrigger() TO lecycleuser;


--
-- Name: FUNCTION contains_2d(public.box2df, public.box2df); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.contains_2d(public.box2df, public.box2df) TO lecycleuser;


--
-- Name: FUNCTION contains_2d(public.box2df, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.contains_2d(public.box2df, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION contains_2d(public.geometry, public.box2df); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.contains_2d(public.geometry, public.box2df) TO lecycleuser;


--
-- Name: FUNCTION disablelongtransactions(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.disablelongtransactions() TO lecycleuser;


--
-- Name: FUNCTION dropgeometrycolumn(table_name character varying, column_name character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dropgeometrycolumn(table_name character varying, column_name character varying) TO lecycleuser;


--
-- Name: FUNCTION dropgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dropgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying) TO lecycleuser;


--
-- Name: FUNCTION dropgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dropgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying) TO lecycleuser;


--
-- Name: FUNCTION dropgeometrytable(table_name character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dropgeometrytable(table_name character varying) TO lecycleuser;


--
-- Name: FUNCTION dropgeometrytable(schema_name character varying, table_name character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dropgeometrytable(schema_name character varying, table_name character varying) TO lecycleuser;


--
-- Name: FUNCTION dropgeometrytable(catalog_name character varying, schema_name character varying, table_name character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dropgeometrytable(catalog_name character varying, schema_name character varying, table_name character varying) TO lecycleuser;


--
-- Name: FUNCTION enablelongtransactions(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.enablelongtransactions() TO lecycleuser;


--
-- Name: FUNCTION equals(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.equals(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION find_srid(character varying, character varying, character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.find_srid(character varying, character varying, character varying) TO lecycleuser;


--
-- Name: FUNCTION geog_brin_inclusion_add_value(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geog_brin_inclusion_add_value(internal, internal, internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geography_cmp(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_cmp(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography_distance_knn(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_distance_knn(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography_eq(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_eq(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography_ge(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_ge(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography_gist_compress(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_gist_compress(internal) TO lecycleuser;


--
-- Name: FUNCTION geography_gist_consistent(internal, public.geography, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_gist_consistent(internal, public.geography, integer) TO lecycleuser;


--
-- Name: FUNCTION geography_gist_decompress(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_gist_decompress(internal) TO lecycleuser;


--
-- Name: FUNCTION geography_gist_distance(internal, public.geography, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_gist_distance(internal, public.geography, integer) TO lecycleuser;


--
-- Name: FUNCTION geography_gist_penalty(internal, internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_gist_penalty(internal, internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geography_gist_picksplit(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_gist_picksplit(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geography_gist_same(public.box2d, public.box2d, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_gist_same(public.box2d, public.box2d, internal) TO lecycleuser;


--
-- Name: FUNCTION geography_gist_union(bytea, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_gist_union(bytea, internal) TO lecycleuser;


--
-- Name: FUNCTION geography_gt(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_gt(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography_le(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_le(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography_lt(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_lt(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography_overlaps(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_overlaps(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION geography_spgist_choose_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_spgist_choose_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geography_spgist_compress_nd(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_spgist_compress_nd(internal) TO lecycleuser;


--
-- Name: FUNCTION geography_spgist_config_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_spgist_config_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geography_spgist_inner_consistent_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_spgist_inner_consistent_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geography_spgist_leaf_consistent_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_spgist_leaf_consistent_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geography_spgist_picksplit_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geography_spgist_picksplit_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geom2d_brin_inclusion_add_value(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geom2d_brin_inclusion_add_value(internal, internal, internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geom3d_brin_inclusion_add_value(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geom3d_brin_inclusion_add_value(internal, internal, internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geom4d_brin_inclusion_add_value(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geom4d_brin_inclusion_add_value(internal, internal, internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_above(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_above(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_below(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_below(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_cmp(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_cmp(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_contained_3d(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_contained_3d(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_contains(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_contains(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_contains_3d(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_contains_3d(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_contains_nd(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_contains_nd(public.geometry, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_distance_box(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_distance_box(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_distance_centroid(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_distance_centroid(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_distance_centroid_nd(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_distance_centroid_nd(public.geometry, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_distance_cpa(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_distance_cpa(public.geometry, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_eq(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_eq(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_ge(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_ge(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_compress_2d(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_compress_2d(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_compress_nd(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_compress_nd(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_consistent_2d(internal, public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_consistent_2d(internal, public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_consistent_nd(internal, public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_consistent_nd(internal, public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_decompress_2d(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_decompress_2d(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_decompress_nd(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_decompress_nd(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_distance_2d(internal, public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_distance_2d(internal, public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_distance_nd(internal, public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_distance_nd(internal, public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_penalty_2d(internal, internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_penalty_2d(internal, internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_penalty_nd(internal, internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_penalty_nd(internal, internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_picksplit_2d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_picksplit_2d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_picksplit_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_picksplit_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_same_2d(geom1 public.geometry, geom2 public.geometry, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_same_2d(geom1 public.geometry, geom2 public.geometry, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_same_nd(public.geometry, public.geometry, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_same_nd(public.geometry, public.geometry, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_sortsupport_2d(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_sortsupport_2d(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_union_2d(bytea, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_union_2d(bytea, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gist_union_nd(bytea, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gist_union_nd(bytea, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_gt(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_gt(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_hash(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_hash(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_le(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_le(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_left(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_left(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_lt(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_lt(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_overabove(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_overabove(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_overbelow(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_overbelow(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_overlaps(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_overlaps(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_overlaps_3d(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_overlaps_3d(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_overlaps_nd(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_overlaps_nd(public.geometry, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_overleft(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_overleft(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_overright(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_overright(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_right(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_right(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_same(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_same(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_same_3d(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_same_3d(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_same_nd(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_same_nd(public.geometry, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_sortsupport(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_sortsupport(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_choose_2d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_choose_2d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_choose_3d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_choose_3d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_choose_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_choose_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_compress_2d(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_compress_2d(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_compress_3d(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_compress_3d(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_compress_nd(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_compress_nd(internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_config_2d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_config_2d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_config_3d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_config_3d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_config_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_config_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_inner_consistent_2d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_2d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_inner_consistent_3d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_3d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_inner_consistent_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_leaf_consistent_2d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_2d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_leaf_consistent_3d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_3d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_leaf_consistent_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_picksplit_2d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_2d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_picksplit_3d(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_3d(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_spgist_picksplit_nd(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_nd(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION geometry_within(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_within(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometry_within_nd(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometry_within_nd(public.geometry, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geometrytype(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometrytype(public.geography) TO lecycleuser;


--
-- Name: FUNCTION geometrytype(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geometrytype(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION geomfromewkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geomfromewkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION geomfromewkt(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.geomfromewkt(text) TO lecycleuser;


--
-- Name: FUNCTION get_proj4_from_srid(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_proj4_from_srid(integer) TO lecycleuser;


--
-- Name: FUNCTION gettransactionid(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gettransactionid() TO lecycleuser;


--
-- Name: FUNCTION gserialized_gist_joinsel_2d(internal, oid, internal, smallint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gserialized_gist_joinsel_2d(internal, oid, internal, smallint) TO lecycleuser;


--
-- Name: FUNCTION gserialized_gist_joinsel_nd(internal, oid, internal, smallint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gserialized_gist_joinsel_nd(internal, oid, internal, smallint) TO lecycleuser;


--
-- Name: FUNCTION gserialized_gist_sel_2d(internal, oid, internal, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gserialized_gist_sel_2d(internal, oid, internal, integer) TO lecycleuser;


--
-- Name: FUNCTION gserialized_gist_sel_nd(internal, oid, internal, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.gserialized_gist_sel_nd(internal, oid, internal, integer) TO lecycleuser;


--
-- Name: FUNCTION is_contained_2d(public.box2df, public.box2df); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_contained_2d(public.box2df, public.box2df) TO lecycleuser;


--
-- Name: FUNCTION is_contained_2d(public.box2df, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_contained_2d(public.box2df, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION is_contained_2d(public.geometry, public.box2df); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_contained_2d(public.geometry, public.box2df) TO lecycleuser;


--
-- Name: FUNCTION lockrow(text, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.lockrow(text, text, text) TO lecycleuser;


--
-- Name: FUNCTION lockrow(text, text, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.lockrow(text, text, text, text) TO lecycleuser;


--
-- Name: FUNCTION lockrow(text, text, text, timestamp without time zone); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.lockrow(text, text, text, timestamp without time zone) TO lecycleuser;


--
-- Name: FUNCTION lockrow(text, text, text, text, timestamp without time zone); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.lockrow(text, text, text, text, timestamp without time zone) TO lecycleuser;


--
-- Name: FUNCTION longtransactionsenabled(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.longtransactionsenabled() TO lecycleuser;


--
-- Name: FUNCTION overlaps_2d(public.box2df, public.box2df); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.overlaps_2d(public.box2df, public.box2df) TO lecycleuser;


--
-- Name: FUNCTION overlaps_2d(public.box2df, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.overlaps_2d(public.box2df, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION overlaps_2d(public.geometry, public.box2df); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.overlaps_2d(public.geometry, public.box2df) TO lecycleuser;


--
-- Name: FUNCTION overlaps_geog(public.geography, public.gidx); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.overlaps_geog(public.geography, public.gidx) TO lecycleuser;


--
-- Name: FUNCTION overlaps_geog(public.gidx, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.overlaps_geog(public.gidx, public.geography) TO lecycleuser;


--
-- Name: FUNCTION overlaps_geog(public.gidx, public.gidx); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.overlaps_geog(public.gidx, public.gidx) TO lecycleuser;


--
-- Name: FUNCTION overlaps_nd(public.geometry, public.gidx); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.overlaps_nd(public.geometry, public.gidx) TO lecycleuser;


--
-- Name: FUNCTION overlaps_nd(public.gidx, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.overlaps_nd(public.gidx, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION overlaps_nd(public.gidx, public.gidx); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.overlaps_nd(public.gidx, public.gidx) TO lecycleuser;


--
-- Name: FUNCTION pgis_asflatgeobuf_finalfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_finalfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_asflatgeobuf_transfn(internal, anyelement); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement) TO lecycleuser;


--
-- Name: FUNCTION pgis_asflatgeobuf_transfn(internal, anyelement, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement, boolean) TO lecycleuser;


--
-- Name: FUNCTION pgis_asflatgeobuf_transfn(internal, anyelement, boolean, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement, boolean, text) TO lecycleuser;


--
-- Name: FUNCTION pgis_asgeobuf_finalfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asgeobuf_finalfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_asgeobuf_transfn(internal, anyelement); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asgeobuf_transfn(internal, anyelement) TO lecycleuser;


--
-- Name: FUNCTION pgis_asgeobuf_transfn(internal, anyelement, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asgeobuf_transfn(internal, anyelement, text) TO lecycleuser;


--
-- Name: FUNCTION pgis_asmvt_combinefn(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asmvt_combinefn(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_asmvt_deserialfn(bytea, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asmvt_deserialfn(bytea, internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_asmvt_finalfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asmvt_finalfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_asmvt_serialfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asmvt_serialfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_asmvt_transfn(internal, anyelement); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement) TO lecycleuser;


--
-- Name: FUNCTION pgis_asmvt_transfn(internal, anyelement, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text) TO lecycleuser;


--
-- Name: FUNCTION pgis_asmvt_transfn(internal, anyelement, text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer) TO lecycleuser;


--
-- Name: FUNCTION pgis_asmvt_transfn(internal, anyelement, text, integer, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer, text) TO lecycleuser;


--
-- Name: FUNCTION pgis_asmvt_transfn(internal, anyelement, text, integer, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer, text, text) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_accum_transfn(internal, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_accum_transfn(internal, public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_accum_transfn(internal, public.geometry, double precision, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry, double precision, integer) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_clusterintersecting_finalfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_clusterintersecting_finalfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_clusterwithin_finalfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_clusterwithin_finalfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_collect_finalfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_collect_finalfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_coverageunion_finalfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_coverageunion_finalfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_makeline_finalfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_makeline_finalfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_polygonize_finalfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_polygonize_finalfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_union_parallel_combinefn(internal, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_combinefn(internal, internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_union_parallel_deserialfn(bytea, internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_deserialfn(bytea, internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_union_parallel_finalfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_finalfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_union_parallel_serialfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_serialfn(internal) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_union_parallel_transfn(internal, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_transfn(internal, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION pgis_geometry_union_parallel_transfn(internal, public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_transfn(internal, public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION populate_geometry_columns(use_typmod boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.populate_geometry_columns(use_typmod boolean) TO lecycleuser;


--
-- Name: FUNCTION populate_geometry_columns(tbl_oid oid, use_typmod boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.populate_geometry_columns(tbl_oid oid, use_typmod boolean) TO lecycleuser;


--
-- Name: FUNCTION postgis_addbbox(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_addbbox(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION postgis_cache_bbox(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_cache_bbox() TO lecycleuser;


--
-- Name: FUNCTION postgis_constraint_dims(geomschema text, geomtable text, geomcolumn text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_constraint_dims(geomschema text, geomtable text, geomcolumn text) TO lecycleuser;


--
-- Name: FUNCTION postgis_constraint_srid(geomschema text, geomtable text, geomcolumn text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_constraint_srid(geomschema text, geomtable text, geomcolumn text) TO lecycleuser;


--
-- Name: FUNCTION postgis_constraint_type(geomschema text, geomtable text, geomcolumn text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_constraint_type(geomschema text, geomtable text, geomcolumn text) TO lecycleuser;


--
-- Name: FUNCTION postgis_dropbbox(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_dropbbox(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION postgis_extensions_upgrade(target_version text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_extensions_upgrade(target_version text) TO lecycleuser;


--
-- Name: FUNCTION postgis_full_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_full_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_geos_compiled_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_geos_compiled_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_geos_noop(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_geos_noop(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION postgis_geos_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_geos_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_getbbox(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_getbbox(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION postgis_hasbbox(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_hasbbox(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION postgis_index_supportfn(internal); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_index_supportfn(internal) TO lecycleuser;


--
-- Name: FUNCTION postgis_lib_build_date(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_lib_build_date() TO lecycleuser;


--
-- Name: FUNCTION postgis_lib_revision(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_lib_revision() TO lecycleuser;


--
-- Name: FUNCTION postgis_lib_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_lib_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_libjson_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_libjson_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_liblwgeom_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_liblwgeom_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_libprotobuf_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_libprotobuf_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_libxml_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_libxml_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_noop(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_noop(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION postgis_proj_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_proj_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_scripts_build_date(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_scripts_build_date() TO lecycleuser;


--
-- Name: FUNCTION postgis_scripts_installed(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_scripts_installed() TO lecycleuser;


--
-- Name: FUNCTION postgis_scripts_released(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_scripts_released() TO lecycleuser;


--
-- Name: FUNCTION postgis_srs(auth_name text, auth_srid text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_srs(auth_name text, auth_srid text) TO lecycleuser;


--
-- Name: FUNCTION postgis_srs_all(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_srs_all() TO lecycleuser;


--
-- Name: FUNCTION postgis_srs_codes(auth_name text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_srs_codes(auth_name text) TO lecycleuser;


--
-- Name: FUNCTION postgis_srs_search(bounds public.geometry, authname text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_srs_search(bounds public.geometry, authname text) TO lecycleuser;


--
-- Name: FUNCTION postgis_svn_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_svn_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_transform_geometry(geom public.geometry, text, text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_transform_geometry(geom public.geometry, text, text, integer) TO lecycleuser;


--
-- Name: FUNCTION postgis_transform_pipeline_geometry(geom public.geometry, pipeline text, forward boolean, to_srid integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_transform_pipeline_geometry(geom public.geometry, pipeline text, forward boolean, to_srid integer) TO lecycleuser;


--
-- Name: FUNCTION postgis_type_name(geomname character varying, coord_dimension integer, use_new_name boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_type_name(geomname character varying, coord_dimension integer, use_new_name boolean) TO lecycleuser;


--
-- Name: FUNCTION postgis_typmod_dims(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_typmod_dims(integer) TO lecycleuser;


--
-- Name: FUNCTION postgis_typmod_srid(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_typmod_srid(integer) TO lecycleuser;


--
-- Name: FUNCTION postgis_typmod_type(integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_typmod_type(integer) TO lecycleuser;


--
-- Name: FUNCTION postgis_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_version() TO lecycleuser;


--
-- Name: FUNCTION postgis_wagyu_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.postgis_wagyu_version() TO lecycleuser;


--
-- Name: FUNCTION st_3dclosestpoint(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3dclosestpoint(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_3ddistance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3ddistance(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_3dintersects(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3dintersects(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_3dlength(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3dlength(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_3dlineinterpolatepoint(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3dlineinterpolatepoint(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_3dlongestline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3dlongestline(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_3dmakebox(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3dmakebox(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_3dmaxdistance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3dmaxdistance(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_3dperimeter(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3dperimeter(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_3dshortestline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3dshortestline(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_addmeasure(public.geometry, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_addmeasure(public.geometry, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_addpoint(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_addpoint(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_addpoint(geom1 public.geometry, geom2 public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_addpoint(geom1 public.geometry, geom2 public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_angle(line1 public.geometry, line2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_angle(line1 public.geometry, line2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_angle(pt1 public.geometry, pt2 public.geometry, pt3 public.geometry, pt4 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_angle(pt1 public.geometry, pt2 public.geometry, pt3 public.geometry, pt4 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_area(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_area(text) TO lecycleuser;


--
-- Name: FUNCTION st_area(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_area(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_area(geog public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_area(geog public.geography, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION st_area2d(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_area2d(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_asbinary(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asbinary(public.geography) TO lecycleuser;


--
-- Name: FUNCTION st_asbinary(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asbinary(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_asbinary(public.geography, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asbinary(public.geography, text) TO lecycleuser;


--
-- Name: FUNCTION st_asbinary(public.geometry, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asbinary(public.geometry, text) TO lecycleuser;


--
-- Name: FUNCTION st_asencodedpolyline(geom public.geometry, nprecision integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asencodedpolyline(geom public.geometry, nprecision integer) TO lecycleuser;


--
-- Name: FUNCTION st_asewkb(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asewkb(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_asewkb(public.geometry, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asewkb(public.geometry, text) TO lecycleuser;


--
-- Name: FUNCTION st_asewkt(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asewkt(text) TO lecycleuser;


--
-- Name: FUNCTION st_asewkt(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asewkt(public.geography) TO lecycleuser;


--
-- Name: FUNCTION st_asewkt(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asewkt(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_asewkt(public.geography, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asewkt(public.geography, integer) TO lecycleuser;


--
-- Name: FUNCTION st_asewkt(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asewkt(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_asgeojson(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgeojson(text) TO lecycleuser;


--
-- Name: FUNCTION st_asgeojson(geog public.geography, maxdecimaldigits integer, options integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgeojson(geog public.geography, maxdecimaldigits integer, options integer) TO lecycleuser;


--
-- Name: FUNCTION st_asgeojson(geom public.geometry, maxdecimaldigits integer, options integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgeojson(geom public.geometry, maxdecimaldigits integer, options integer) TO lecycleuser;


--
-- Name: FUNCTION st_asgeojson(r record, geom_column text, maxdecimaldigits integer, pretty_bool boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgeojson(r record, geom_column text, maxdecimaldigits integer, pretty_bool boolean) TO lecycleuser;


--
-- Name: FUNCTION st_asgml(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgml(text) TO lecycleuser;


--
-- Name: FUNCTION st_asgml(geom public.geometry, maxdecimaldigits integer, options integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgml(geom public.geometry, maxdecimaldigits integer, options integer) TO lecycleuser;


--
-- Name: FUNCTION st_asgml(geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgml(geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text) TO lecycleuser;


--
-- Name: FUNCTION st_asgml(version integer, geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgml(version integer, geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text) TO lecycleuser;


--
-- Name: FUNCTION st_asgml(version integer, geom public.geometry, maxdecimaldigits integer, options integer, nprefix text, id text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgml(version integer, geom public.geometry, maxdecimaldigits integer, options integer, nprefix text, id text) TO lecycleuser;


--
-- Name: FUNCTION st_ashexewkb(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_ashexewkb(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_ashexewkb(public.geometry, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_ashexewkb(public.geometry, text) TO lecycleuser;


--
-- Name: FUNCTION st_askml(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_askml(text) TO lecycleuser;


--
-- Name: FUNCTION st_askml(geog public.geography, maxdecimaldigits integer, nprefix text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_askml(geog public.geography, maxdecimaldigits integer, nprefix text) TO lecycleuser;


--
-- Name: FUNCTION st_askml(geom public.geometry, maxdecimaldigits integer, nprefix text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_askml(geom public.geometry, maxdecimaldigits integer, nprefix text) TO lecycleuser;


--
-- Name: FUNCTION st_aslatlontext(geom public.geometry, tmpl text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_aslatlontext(geom public.geometry, tmpl text) TO lecycleuser;


--
-- Name: FUNCTION st_asmarc21(geom public.geometry, format text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asmarc21(geom public.geometry, format text) TO lecycleuser;


--
-- Name: FUNCTION st_asmvtgeom(geom public.geometry, bounds public.box2d, extent integer, buffer integer, clip_geom boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asmvtgeom(geom public.geometry, bounds public.box2d, extent integer, buffer integer, clip_geom boolean) TO lecycleuser;


--
-- Name: FUNCTION st_assvg(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_assvg(text) TO lecycleuser;


--
-- Name: FUNCTION st_assvg(geog public.geography, rel integer, maxdecimaldigits integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_assvg(geog public.geography, rel integer, maxdecimaldigits integer) TO lecycleuser;


--
-- Name: FUNCTION st_assvg(geom public.geometry, rel integer, maxdecimaldigits integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_assvg(geom public.geometry, rel integer, maxdecimaldigits integer) TO lecycleuser;


--
-- Name: FUNCTION st_astext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_astext(text) TO lecycleuser;


--
-- Name: FUNCTION st_astext(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_astext(public.geography) TO lecycleuser;


--
-- Name: FUNCTION st_astext(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_astext(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_astext(public.geography, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_astext(public.geography, integer) TO lecycleuser;


--
-- Name: FUNCTION st_astext(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_astext(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_astwkb(geom public.geometry, prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_astwkb(geom public.geometry, prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean) TO lecycleuser;


--
-- Name: FUNCTION st_astwkb(geom public.geometry[], ids bigint[], prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_astwkb(geom public.geometry[], ids bigint[], prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean) TO lecycleuser;


--
-- Name: FUNCTION st_asx3d(geom public.geometry, maxdecimaldigits integer, options integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asx3d(geom public.geometry, maxdecimaldigits integer, options integer) TO lecycleuser;


--
-- Name: FUNCTION st_azimuth(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_azimuth(geog1 public.geography, geog2 public.geography) TO lecycleuser;


--
-- Name: FUNCTION st_azimuth(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_azimuth(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_bdmpolyfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_bdmpolyfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_bdpolyfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_bdpolyfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_boundary(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_boundary(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_boundingdiagonal(geom public.geometry, fits boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_boundingdiagonal(geom public.geometry, fits boolean) TO lecycleuser;


--
-- Name: FUNCTION st_box2dfromgeohash(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_box2dfromgeohash(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_buffer(text, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_buffer(text, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_buffer(public.geography, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_buffer(text, double precision, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_buffer(text, double precision, integer) TO lecycleuser;


--
-- Name: FUNCTION st_buffer(text, double precision, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_buffer(text, double precision, text) TO lecycleuser;


--
-- Name: FUNCTION st_buffer(public.geography, double precision, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision, integer) TO lecycleuser;


--
-- Name: FUNCTION st_buffer(public.geography, double precision, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision, text) TO lecycleuser;


--
-- Name: FUNCTION st_buffer(geom public.geometry, radius double precision, quadsegs integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_buffer(geom public.geometry, radius double precision, quadsegs integer) TO lecycleuser;


--
-- Name: FUNCTION st_buffer(geom public.geometry, radius double precision, options text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_buffer(geom public.geometry, radius double precision, options text) TO lecycleuser;


--
-- Name: FUNCTION st_buildarea(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_buildarea(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_centroid(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_centroid(text) TO lecycleuser;


--
-- Name: FUNCTION st_centroid(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_centroid(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_centroid(public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_centroid(public.geography, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION st_chaikinsmoothing(public.geometry, integer, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_chaikinsmoothing(public.geometry, integer, boolean) TO lecycleuser;


--
-- Name: FUNCTION st_cleangeometry(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_cleangeometry(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_clipbybox2d(geom public.geometry, box public.box2d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_clipbybox2d(geom public.geometry, box public.box2d) TO lecycleuser;


--
-- Name: FUNCTION st_closestpoint(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_closestpoint(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_closestpoint(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_closestpoint(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_closestpoint(public.geography, public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_closestpoint(public.geography, public.geography, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION st_closestpointofapproach(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_closestpointofapproach(public.geometry, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_clusterdbscan(public.geometry, eps double precision, minpoints integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_clusterdbscan(public.geometry, eps double precision, minpoints integer) TO lecycleuser;


--
-- Name: FUNCTION st_clusterintersecting(public.geometry[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_clusterintersecting(public.geometry[]) TO lecycleuser;


--
-- Name: FUNCTION st_clusterintersectingwin(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_clusterintersectingwin(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_clusterkmeans(geom public.geometry, k integer, max_radius double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_clusterkmeans(geom public.geometry, k integer, max_radius double precision) TO lecycleuser;


--
-- Name: FUNCTION st_clusterwithin(public.geometry[], double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_clusterwithin(public.geometry[], double precision) TO lecycleuser;


--
-- Name: FUNCTION st_clusterwithinwin(public.geometry, distance double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_clusterwithinwin(public.geometry, distance double precision) TO lecycleuser;


--
-- Name: FUNCTION st_collect(public.geometry[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_collect(public.geometry[]) TO lecycleuser;


--
-- Name: FUNCTION st_collect(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_collect(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_collectionextract(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_collectionextract(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_collectionextract(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_collectionextract(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_collectionhomogenize(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_collectionhomogenize(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_combinebbox(public.box2d, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_combinebbox(public.box2d, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_combinebbox(public.box3d, public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_combinebbox(public.box3d, public.box3d) TO lecycleuser;


--
-- Name: FUNCTION st_combinebbox(public.box3d, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_combinebbox(public.box3d, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_concavehull(param_geom public.geometry, param_pctconvex double precision, param_allow_holes boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_concavehull(param_geom public.geometry, param_pctconvex double precision, param_allow_holes boolean) TO lecycleuser;


--
-- Name: FUNCTION st_contains(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_contains(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_containsproperly(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_containsproperly(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_convexhull(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_convexhull(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_coorddim(geometry public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_coorddim(geometry public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_coverageinvalidedges(geom public.geometry, tolerance double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_coverageinvalidedges(geom public.geometry, tolerance double precision) TO lecycleuser;


--
-- Name: FUNCTION st_coveragesimplify(geom public.geometry, tolerance double precision, simplifyboundary boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_coveragesimplify(geom public.geometry, tolerance double precision, simplifyboundary boolean) TO lecycleuser;


--
-- Name: FUNCTION st_coverageunion(public.geometry[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_coverageunion(public.geometry[]) TO lecycleuser;


--
-- Name: FUNCTION st_coveredby(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_coveredby(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_coveredby(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_coveredby(geog1 public.geography, geog2 public.geography) TO lecycleuser;


--
-- Name: FUNCTION st_coveredby(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_coveredby(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_covers(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_covers(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_covers(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_covers(geog1 public.geography, geog2 public.geography) TO lecycleuser;


--
-- Name: FUNCTION st_covers(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_covers(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_cpawithin(public.geometry, public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_cpawithin(public.geometry, public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_crosses(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_crosses(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_curvetoline(geom public.geometry, tol double precision, toltype integer, flags integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_curvetoline(geom public.geometry, tol double precision, toltype integer, flags integer) TO lecycleuser;


--
-- Name: FUNCTION st_delaunaytriangles(g1 public.geometry, tolerance double precision, flags integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_delaunaytriangles(g1 public.geometry, tolerance double precision, flags integer) TO lecycleuser;


--
-- Name: FUNCTION st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_difference(geom1 public.geometry, geom2 public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_difference(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO lecycleuser;


--
-- Name: FUNCTION st_dimension(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_dimension(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_disjoint(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_disjoint(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_distance(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_distance(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_distance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_distance(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_distance(geog1 public.geography, geog2 public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_distance(geog1 public.geography, geog2 public.geography, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION st_distancecpa(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_distancecpa(public.geometry, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_distancesphere(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_distancesphere(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_distancesphere(geom1 public.geometry, geom2 public.geometry, radius double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_distancesphere(geom1 public.geometry, geom2 public.geometry, radius double precision) TO lecycleuser;


--
-- Name: FUNCTION st_distancespheroid(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_distancespheroid(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_distancespheroid(geom1 public.geometry, geom2 public.geometry, public.spheroid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_distancespheroid(geom1 public.geometry, geom2 public.geometry, public.spheroid) TO lecycleuser;


--
-- Name: FUNCTION st_dump(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_dump(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_dumppoints(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_dumppoints(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_dumprings(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_dumprings(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_dumpsegments(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_dumpsegments(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_dwithin(text, text, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_dwithin(text, text, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION st_endpoint(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_endpoint(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_envelope(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_envelope(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_equals(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_equals(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_estimatedextent(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_estimatedextent(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_estimatedextent(text, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_estimatedextent(text, text, text) TO lecycleuser;


--
-- Name: FUNCTION st_estimatedextent(text, text, text, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_estimatedextent(text, text, text, boolean) TO lecycleuser;


--
-- Name: FUNCTION st_expand(public.box2d, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_expand(public.box2d, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_expand(public.box3d, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_expand(public.box3d, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_expand(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_expand(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_expand(box public.box2d, dx double precision, dy double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_expand(box public.box2d, dx double precision, dy double precision) TO lecycleuser;


--
-- Name: FUNCTION st_expand(box public.box3d, dx double precision, dy double precision, dz double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_expand(box public.box3d, dx double precision, dy double precision, dz double precision) TO lecycleuser;


--
-- Name: FUNCTION st_expand(geom public.geometry, dx double precision, dy double precision, dz double precision, dm double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_expand(geom public.geometry, dx double precision, dy double precision, dz double precision, dm double precision) TO lecycleuser;


--
-- Name: FUNCTION st_exteriorring(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_exteriorring(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_filterbym(public.geometry, double precision, double precision, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_filterbym(public.geometry, double precision, double precision, boolean) TO lecycleuser;


--
-- Name: FUNCTION st_findextent(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_findextent(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_findextent(text, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_findextent(text, text, text) TO lecycleuser;


--
-- Name: FUNCTION st_flipcoordinates(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_flipcoordinates(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_force2d(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_force2d(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_force3d(geom public.geometry, zvalue double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_force3d(geom public.geometry, zvalue double precision) TO lecycleuser;


--
-- Name: FUNCTION st_force3dm(geom public.geometry, mvalue double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_force3dm(geom public.geometry, mvalue double precision) TO lecycleuser;


--
-- Name: FUNCTION st_force3dz(geom public.geometry, zvalue double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_force3dz(geom public.geometry, zvalue double precision) TO lecycleuser;


--
-- Name: FUNCTION st_force4d(geom public.geometry, zvalue double precision, mvalue double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_force4d(geom public.geometry, zvalue double precision, mvalue double precision) TO lecycleuser;


--
-- Name: FUNCTION st_forcecollection(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_forcecollection(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_forcecurve(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_forcecurve(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_forcepolygonccw(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_forcepolygonccw(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_forcepolygoncw(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_forcepolygoncw(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_forcerhr(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_forcerhr(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_forcesfs(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_forcesfs(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_forcesfs(public.geometry, version text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_forcesfs(public.geometry, version text) TO lecycleuser;


--
-- Name: FUNCTION st_frechetdistance(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_frechetdistance(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_fromflatgeobuf(anyelement, bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_fromflatgeobuf(anyelement, bytea) TO lecycleuser;


--
-- Name: FUNCTION st_fromflatgeobuftotable(text, text, bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_fromflatgeobuftotable(text, text, bytea) TO lecycleuser;


--
-- Name: FUNCTION st_generatepoints(area public.geometry, npoints integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_generatepoints(area public.geometry, npoints integer) TO lecycleuser;


--
-- Name: FUNCTION st_generatepoints(area public.geometry, npoints integer, seed integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_generatepoints(area public.geometry, npoints integer, seed integer) TO lecycleuser;


--
-- Name: FUNCTION st_geogfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geogfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_geogfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geogfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_geographyfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geographyfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_geohash(geog public.geography, maxchars integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geohash(geog public.geography, maxchars integer) TO lecycleuser;


--
-- Name: FUNCTION st_geohash(geom public.geometry, maxchars integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geohash(geom public.geometry, maxchars integer) TO lecycleuser;


--
-- Name: FUNCTION st_geomcollfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomcollfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_geomcollfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomcollfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_geomcollfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomcollfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_geomcollfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomcollfromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_geometricmedian(g public.geometry, tolerance double precision, max_iter integer, fail_if_not_converged boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geometricmedian(g public.geometry, tolerance double precision, max_iter integer, fail_if_not_converged boolean) TO lecycleuser;


--
-- Name: FUNCTION st_geometryfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geometryfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_geometryfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geometryfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_geometryn(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geometryn(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_geometrytype(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geometrytype(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromewkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromewkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromewkt(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromewkt(text) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromgeohash(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromgeohash(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromgeojson(json); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromgeojson(json) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromgeojson(jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromgeojson(jsonb) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromgeojson(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromgeojson(text) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromgml(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromgml(text) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromgml(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromgml(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromkml(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromkml(text) TO lecycleuser;


--
-- Name: FUNCTION st_geomfrommarc21(marc21xml text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfrommarc21(marc21xml text) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromtwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromtwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_geomfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_geomfromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_gmltosql(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_gmltosql(text) TO lecycleuser;


--
-- Name: FUNCTION st_gmltosql(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_gmltosql(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_hasarc(geometry public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_hasarc(geometry public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_hexagon(size double precision, cell_i integer, cell_j integer, origin public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_hexagon(size double precision, cell_i integer, cell_j integer, origin public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_hexagongrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_hexagongrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer) TO lecycleuser;


--
-- Name: FUNCTION st_interiorringn(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_interiorringn(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_interpolatepoint(line public.geometry, point public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_interpolatepoint(line public.geometry, point public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_intersection(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_intersection(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_intersection(public.geography, public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_intersection(public.geography, public.geography) TO lecycleuser;


--
-- Name: FUNCTION st_intersection(geom1 public.geometry, geom2 public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_intersection(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO lecycleuser;


--
-- Name: FUNCTION st_intersects(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_intersects(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_intersects(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_intersects(geog1 public.geography, geog2 public.geography) TO lecycleuser;


--
-- Name: FUNCTION st_intersects(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_intersects(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_inversetransformpipeline(geom public.geometry, pipeline text, to_srid integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_inversetransformpipeline(geom public.geometry, pipeline text, to_srid integer) TO lecycleuser;


--
-- Name: FUNCTION st_isclosed(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_isclosed(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_iscollection(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_iscollection(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_isempty(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_isempty(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_ispolygonccw(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_ispolygonccw(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_ispolygoncw(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_ispolygoncw(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_isring(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_isring(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_issimple(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_issimple(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_isvalid(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_isvalid(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_isvalid(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_isvalid(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_isvaliddetail(geom public.geometry, flags integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_isvaliddetail(geom public.geometry, flags integer) TO lecycleuser;


--
-- Name: FUNCTION st_isvalidreason(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_isvalidreason(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_isvalidreason(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_isvalidreason(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_isvalidtrajectory(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_isvalidtrajectory(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_largestemptycircle(geom public.geometry, tolerance double precision, boundary public.geometry, OUT center public.geometry, OUT nearest public.geometry, OUT radius double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_largestemptycircle(geom public.geometry, tolerance double precision, boundary public.geometry, OUT center public.geometry, OUT nearest public.geometry, OUT radius double precision) TO lecycleuser;


--
-- Name: FUNCTION st_length(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_length(text) TO lecycleuser;


--
-- Name: FUNCTION st_length(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_length(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_length(geog public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_length(geog public.geography, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION st_length2d(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_length2d(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_length2dspheroid(public.geometry, public.spheroid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_length2dspheroid(public.geometry, public.spheroid) TO lecycleuser;


--
-- Name: FUNCTION st_lengthspheroid(public.geometry, public.spheroid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_lengthspheroid(public.geometry, public.spheroid) TO lecycleuser;


--
-- Name: FUNCTION st_letters(letters text, font json); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_letters(letters text, font json) TO lecycleuser;


--
-- Name: FUNCTION st_linecrossingdirection(line1 public.geometry, line2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linecrossingdirection(line1 public.geometry, line2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_lineextend(geom public.geometry, distance_forward double precision, distance_backward double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_lineextend(geom public.geometry, distance_forward double precision, distance_backward double precision) TO lecycleuser;


--
-- Name: FUNCTION st_linefromencodedpolyline(txtin text, nprecision integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linefromencodedpolyline(txtin text, nprecision integer) TO lecycleuser;


--
-- Name: FUNCTION st_linefrommultipoint(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linefrommultipoint(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_linefromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linefromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_linefromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linefromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_linefromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linefromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_linefromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linefromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_lineinterpolatepoint(text, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_lineinterpolatepoint(text, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_lineinterpolatepoint(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_lineinterpolatepoint(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_lineinterpolatepoint(public.geography, double precision, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_lineinterpolatepoint(public.geography, double precision, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION st_lineinterpolatepoints(text, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_lineinterpolatepoints(text, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_lineinterpolatepoints(public.geometry, double precision, repeat boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_lineinterpolatepoints(public.geometry, double precision, repeat boolean) TO lecycleuser;


--
-- Name: FUNCTION st_lineinterpolatepoints(public.geography, double precision, use_spheroid boolean, repeat boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_lineinterpolatepoints(public.geography, double precision, use_spheroid boolean, repeat boolean) TO lecycleuser;


--
-- Name: FUNCTION st_linelocatepoint(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linelocatepoint(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_linelocatepoint(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linelocatepoint(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_linelocatepoint(public.geography, public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linelocatepoint(public.geography, public.geography, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION st_linemerge(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linemerge(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_linemerge(public.geometry, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linemerge(public.geometry, boolean) TO lecycleuser;


--
-- Name: FUNCTION st_linestringfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linestringfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_linestringfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linestringfromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_linesubstring(text, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linesubstring(text, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_linesubstring(public.geography, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linesubstring(public.geography, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_linesubstring(public.geometry, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linesubstring(public.geometry, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_linetocurve(geometry public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_linetocurve(geometry public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_locatealong(geometry public.geometry, measure double precision, leftrightoffset double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_locatealong(geometry public.geometry, measure double precision, leftrightoffset double precision) TO lecycleuser;


--
-- Name: FUNCTION st_locatebetween(geometry public.geometry, frommeasure double precision, tomeasure double precision, leftrightoffset double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_locatebetween(geometry public.geometry, frommeasure double precision, tomeasure double precision, leftrightoffset double precision) TO lecycleuser;


--
-- Name: FUNCTION st_locatebetweenelevations(geometry public.geometry, fromelevation double precision, toelevation double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_locatebetweenelevations(geometry public.geometry, fromelevation double precision, toelevation double precision) TO lecycleuser;


--
-- Name: FUNCTION st_longestline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_longestline(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_m(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_m(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_makebox2d(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makebox2d(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_makeenvelope(double precision, double precision, double precision, double precision, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makeenvelope(double precision, double precision, double precision, double precision, integer) TO lecycleuser;


--
-- Name: FUNCTION st_makeline(public.geometry[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makeline(public.geometry[]) TO lecycleuser;


--
-- Name: FUNCTION st_makeline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makeline(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_makepoint(double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_makepoint(double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_makepoint(double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_makepointm(double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makepointm(double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_makepolygon(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makepolygon(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_makepolygon(public.geometry, public.geometry[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makepolygon(public.geometry, public.geometry[]) TO lecycleuser;


--
-- Name: FUNCTION st_makevalid(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makevalid(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_makevalid(geom public.geometry, params text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makevalid(geom public.geometry, params text) TO lecycleuser;


--
-- Name: FUNCTION st_maxdistance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_maxdistance(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_maximuminscribedcircle(public.geometry, OUT center public.geometry, OUT nearest public.geometry, OUT radius double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_maximuminscribedcircle(public.geometry, OUT center public.geometry, OUT nearest public.geometry, OUT radius double precision) TO lecycleuser;


--
-- Name: FUNCTION st_memsize(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_memsize(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_minimumboundingcircle(inputgeom public.geometry, segs_per_quarter integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_minimumboundingcircle(inputgeom public.geometry, segs_per_quarter integer) TO lecycleuser;


--
-- Name: FUNCTION st_minimumboundingradius(public.geometry, OUT center public.geometry, OUT radius double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_minimumboundingradius(public.geometry, OUT center public.geometry, OUT radius double precision) TO lecycleuser;


--
-- Name: FUNCTION st_minimumclearance(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_minimumclearance(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_minimumclearanceline(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_minimumclearanceline(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_mlinefromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mlinefromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_mlinefromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mlinefromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_mlinefromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mlinefromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_mlinefromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mlinefromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_mpointfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mpointfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_mpointfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mpointfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_mpointfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mpointfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_mpointfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mpointfromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_mpolyfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mpolyfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_mpolyfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mpolyfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_mpolyfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mpolyfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_mpolyfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_mpolyfromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_multi(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multi(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_multilinefromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multilinefromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_multilinestringfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multilinestringfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_multilinestringfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multilinestringfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_multipointfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multipointfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_multipointfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multipointfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_multipointfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multipointfromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_multipolyfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multipolyfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_multipolyfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multipolyfromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_multipolygonfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multipolygonfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_multipolygonfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_multipolygonfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_ndims(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_ndims(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_node(g public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_node(g public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_normalize(geom public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_normalize(geom public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_npoints(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_npoints(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_nrings(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_nrings(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_numgeometries(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_numgeometries(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_numinteriorring(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_numinteriorring(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_numinteriorrings(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_numinteriorrings(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_numpatches(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_numpatches(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_numpoints(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_numpoints(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_offsetcurve(line public.geometry, distance double precision, params text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_offsetcurve(line public.geometry, distance double precision, params text) TO lecycleuser;


--
-- Name: FUNCTION st_orderingequals(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_orderingequals(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_orientedenvelope(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_orientedenvelope(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_overlaps(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_overlaps(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_patchn(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_patchn(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_perimeter(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_perimeter(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_perimeter(geog public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_perimeter(geog public.geography, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION st_perimeter2d(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_perimeter2d(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_point(double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_point(double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_point(double precision, double precision, srid integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_point(double precision, double precision, srid integer) TO lecycleuser;


--
-- Name: FUNCTION st_pointfromgeohash(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointfromgeohash(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_pointfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_pointfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_pointfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_pointfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointfromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_pointinsidecircle(public.geometry, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointinsidecircle(public.geometry, double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_pointm(xcoordinate double precision, ycoordinate double precision, mcoordinate double precision, srid integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointm(xcoordinate double precision, ycoordinate double precision, mcoordinate double precision, srid integer) TO lecycleuser;


--
-- Name: FUNCTION st_pointn(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointn(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_pointonsurface(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointonsurface(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_points(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_points(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_pointz(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, srid integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointz(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, srid integer) TO lecycleuser;


--
-- Name: FUNCTION st_pointzm(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, mcoordinate double precision, srid integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_pointzm(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, mcoordinate double precision, srid integer) TO lecycleuser;


--
-- Name: FUNCTION st_polyfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polyfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_polyfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polyfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_polyfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polyfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_polyfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polyfromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_polygon(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polygon(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_polygonfromtext(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polygonfromtext(text) TO lecycleuser;


--
-- Name: FUNCTION st_polygonfromtext(text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polygonfromtext(text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_polygonfromwkb(bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polygonfromwkb(bytea) TO lecycleuser;


--
-- Name: FUNCTION st_polygonfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polygonfromwkb(bytea, integer) TO lecycleuser;


--
-- Name: FUNCTION st_polygonize(public.geometry[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polygonize(public.geometry[]) TO lecycleuser;


--
-- Name: FUNCTION st_project(geog public.geography, distance double precision, azimuth double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_project(geog public.geography, distance double precision, azimuth double precision) TO lecycleuser;


--
-- Name: FUNCTION st_project(geog_from public.geography, geog_to public.geography, distance double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_project(geog_from public.geography, geog_to public.geography, distance double precision) TO lecycleuser;


--
-- Name: FUNCTION st_project(geom1 public.geometry, distance double precision, azimuth double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_project(geom1 public.geometry, distance double precision, azimuth double precision) TO lecycleuser;


--
-- Name: FUNCTION st_project(geom1 public.geometry, geom2 public.geometry, distance double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_project(geom1 public.geometry, geom2 public.geometry, distance double precision) TO lecycleuser;


--
-- Name: FUNCTION st_quantizecoordinates(g public.geometry, prec_x integer, prec_y integer, prec_z integer, prec_m integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_quantizecoordinates(g public.geometry, prec_x integer, prec_y integer, prec_z integer, prec_m integer) TO lecycleuser;


--
-- Name: FUNCTION st_reduceprecision(geom public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_reduceprecision(geom public.geometry, gridsize double precision) TO lecycleuser;


--
-- Name: FUNCTION st_relate(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_relate(geom1 public.geometry, geom2 public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_relate(geom1 public.geometry, geom2 public.geometry, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry, text) TO lecycleuser;


--
-- Name: FUNCTION st_relatematch(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_relatematch(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_removepoint(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_removepoint(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_removerepeatedpoints(geom public.geometry, tolerance double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_removerepeatedpoints(geom public.geometry, tolerance double precision) TO lecycleuser;


--
-- Name: FUNCTION st_reverse(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_reverse(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_rotate(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_rotate(public.geometry, double precision, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_rotate(public.geometry, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_rotatex(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_rotatex(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_rotatey(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_rotatey(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_rotatez(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_rotatez(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_scale(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_scale(public.geometry, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_scale(public.geometry, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_scale(public.geometry, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_scale(public.geometry, public.geometry, origin public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_scale(public.geometry, public.geometry, origin public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_scale(public.geometry, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_scale(public.geometry, double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_scroll(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_scroll(public.geometry, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_segmentize(geog public.geography, max_segment_length double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_segmentize(geog public.geography, max_segment_length double precision) TO lecycleuser;


--
-- Name: FUNCTION st_segmentize(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_segmentize(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_seteffectivearea(public.geometry, double precision, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_seteffectivearea(public.geometry, double precision, integer) TO lecycleuser;


--
-- Name: FUNCTION st_setpoint(public.geometry, integer, public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_setpoint(public.geometry, integer, public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_setsrid(geog public.geography, srid integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_setsrid(geog public.geography, srid integer) TO lecycleuser;


--
-- Name: FUNCTION st_setsrid(geom public.geometry, srid integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_setsrid(geom public.geometry, srid integer) TO lecycleuser;


--
-- Name: FUNCTION st_sharedpaths(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_sharedpaths(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_shiftlongitude(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_shiftlongitude(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_shortestline(text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_shortestline(text, text) TO lecycleuser;


--
-- Name: FUNCTION st_shortestline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_shortestline(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_shortestline(public.geography, public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_shortestline(public.geography, public.geography, use_spheroid boolean) TO lecycleuser;


--
-- Name: FUNCTION st_simplify(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_simplify(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_simplify(public.geometry, double precision, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_simplify(public.geometry, double precision, boolean) TO lecycleuser;


--
-- Name: FUNCTION st_simplifypolygonhull(geom public.geometry, vertex_fraction double precision, is_outer boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_simplifypolygonhull(geom public.geometry, vertex_fraction double precision, is_outer boolean) TO lecycleuser;


--
-- Name: FUNCTION st_simplifypreservetopology(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_simplifypreservetopology(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_simplifyvw(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_simplifyvw(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_snap(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_snap(geom1 public.geometry, geom2 public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_snaptogrid(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_snaptogrid(public.geometry, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_snaptogrid(public.geometry, double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision, double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_snaptogrid(geom1 public.geometry, geom2 public.geometry, double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_snaptogrid(geom1 public.geometry, geom2 public.geometry, double precision, double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_split(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_split(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_square(size double precision, cell_i integer, cell_j integer, origin public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_square(size double precision, cell_i integer, cell_j integer, origin public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_squaregrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_squaregrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer) TO lecycleuser;


--
-- Name: FUNCTION st_srid(geog public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_srid(geog public.geography) TO lecycleuser;


--
-- Name: FUNCTION st_srid(geom public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_srid(geom public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_startpoint(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_startpoint(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_subdivide(geom public.geometry, maxvertices integer, gridsize double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_subdivide(geom public.geometry, maxvertices integer, gridsize double precision) TO lecycleuser;


--
-- Name: FUNCTION st_summary(public.geography); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_summary(public.geography) TO lecycleuser;


--
-- Name: FUNCTION st_summary(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_summary(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_swapordinates(geom public.geometry, ords cstring); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_swapordinates(geom public.geometry, ords cstring) TO lecycleuser;


--
-- Name: FUNCTION st_symdifference(geom1 public.geometry, geom2 public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_symdifference(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO lecycleuser;


--
-- Name: FUNCTION st_symmetricdifference(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_symmetricdifference(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_tileenvelope(zoom integer, x integer, y integer, bounds public.geometry, margin double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_tileenvelope(zoom integer, x integer, y integer, bounds public.geometry, margin double precision) TO lecycleuser;


--
-- Name: FUNCTION st_touches(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_touches(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_transform(public.geometry, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_transform(public.geometry, integer) TO lecycleuser;


--
-- Name: FUNCTION st_transform(geom public.geometry, to_proj text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, to_proj text) TO lecycleuser;


--
-- Name: FUNCTION st_transform(geom public.geometry, from_proj text, to_srid integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, from_proj text, to_srid integer) TO lecycleuser;


--
-- Name: FUNCTION st_transform(geom public.geometry, from_proj text, to_proj text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, from_proj text, to_proj text) TO lecycleuser;


--
-- Name: FUNCTION st_transformpipeline(geom public.geometry, pipeline text, to_srid integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_transformpipeline(geom public.geometry, pipeline text, to_srid integer) TO lecycleuser;


--
-- Name: FUNCTION st_translate(public.geometry, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_translate(public.geometry, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_translate(public.geometry, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_translate(public.geometry, double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_transscale(public.geometry, double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_transscale(public.geometry, double precision, double precision, double precision, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_triangulatepolygon(g1 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_triangulatepolygon(g1 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_unaryunion(public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_unaryunion(public.geometry, gridsize double precision) TO lecycleuser;


--
-- Name: FUNCTION st_union(public.geometry[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_union(public.geometry[]) TO lecycleuser;


--
-- Name: FUNCTION st_union(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_union(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_union(geom1 public.geometry, geom2 public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_union(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO lecycleuser;


--
-- Name: FUNCTION st_voronoilines(g1 public.geometry, tolerance double precision, extend_to public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_voronoilines(g1 public.geometry, tolerance double precision, extend_to public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_voronoipolygons(g1 public.geometry, tolerance double precision, extend_to public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_voronoipolygons(g1 public.geometry, tolerance double precision, extend_to public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_within(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_within(geom1 public.geometry, geom2 public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_wkbtosql(wkb bytea); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_wkbtosql(wkb bytea) TO lecycleuser;


--
-- Name: FUNCTION st_wkttosql(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_wkttosql(text) TO lecycleuser;


--
-- Name: FUNCTION st_wrapx(geom public.geometry, wrap double precision, move double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_wrapx(geom public.geometry, wrap double precision, move double precision) TO lecycleuser;


--
-- Name: FUNCTION st_x(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_x(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_xmax(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_xmax(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION st_xmin(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_xmin(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION st_y(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_y(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_ymax(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_ymax(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION st_ymin(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_ymin(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION st_z(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_z(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_zmax(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_zmax(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION st_zmflag(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_zmflag(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_zmin(public.box3d); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_zmin(public.box3d) TO lecycleuser;


--
-- Name: FUNCTION unlockrows(text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.unlockrows(text) TO lecycleuser;


--
-- Name: FUNCTION updategeometrysrid(character varying, character varying, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.updategeometrysrid(character varying, character varying, integer) TO lecycleuser;


--
-- Name: FUNCTION updategeometrysrid(character varying, character varying, character varying, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.updategeometrysrid(character varying, character varying, character varying, integer) TO lecycleuser;


--
-- Name: FUNCTION updategeometrysrid(catalogn_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.updategeometrysrid(catalogn_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer) TO lecycleuser;


--
-- Name: FUNCTION st_3dextent(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_3dextent(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_asflatgeobuf(anyelement); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement) TO lecycleuser;


--
-- Name: FUNCTION st_asflatgeobuf(anyelement, boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement, boolean) TO lecycleuser;


--
-- Name: FUNCTION st_asflatgeobuf(anyelement, boolean, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement, boolean, text) TO lecycleuser;


--
-- Name: FUNCTION st_asgeobuf(anyelement); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgeobuf(anyelement) TO lecycleuser;


--
-- Name: FUNCTION st_asgeobuf(anyelement, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asgeobuf(anyelement, text) TO lecycleuser;


--
-- Name: FUNCTION st_asmvt(anyelement); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asmvt(anyelement) TO lecycleuser;


--
-- Name: FUNCTION st_asmvt(anyelement, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text) TO lecycleuser;


--
-- Name: FUNCTION st_asmvt(anyelement, text, integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer) TO lecycleuser;


--
-- Name: FUNCTION st_asmvt(anyelement, text, integer, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer, text) TO lecycleuser;


--
-- Name: FUNCTION st_asmvt(anyelement, text, integer, text, text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer, text, text) TO lecycleuser;


--
-- Name: FUNCTION st_clusterintersecting(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_clusterintersecting(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_clusterwithin(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_clusterwithin(public.geometry, double precision) TO lecycleuser;


--
-- Name: FUNCTION st_collect(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_collect(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_coverageunion(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_coverageunion(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_extent(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_extent(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_makeline(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_makeline(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_memcollect(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_memcollect(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_memunion(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_memunion(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_polygonize(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_polygonize(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_union(public.geometry); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_union(public.geometry) TO lecycleuser;


--
-- Name: FUNCTION st_union(public.geometry, double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.st_union(public.geometry, double precision) TO lecycleuser;


--
-- Name: TABLE administrator; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.administrator TO lecycleuser;


--
-- Name: SEQUENCE administrator_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.administrator_id_seq TO lecycleuser;


--
-- Name: TABLE bicycle; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.bicycle TO lecycleuser;


--
-- Name: SEQUENCE bicycle_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.bicycle_id_seq TO lecycleuser;


--
-- Name: TABLE bicycle_photos; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.bicycle_photos TO lecycleuser;


--
-- Name: TABLE client; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.client TO lecycleuser;


--
-- Name: SEQUENCE client_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.client_id_seq TO lecycleuser;


--
-- Name: TABLE company; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.company TO lecycleuser;


--
-- Name: SEQUENCE company_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.company_id_seq TO lecycleuser;


--
-- Name: TABLE geographical_zone; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.geographical_zone TO lecycleuser;


--
-- Name: SEQUENCE geographical_zone_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.geographical_zone_id_seq TO lecycleuser;


--
-- Name: TABLE geography_columns; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.geography_columns TO lecycleuser;


--
-- Name: TABLE geometry_columns; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.geometry_columns TO lecycleuser;


--
-- Name: TABLE intervention; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.intervention TO lecycleuser;


--
-- Name: TABLE intervention_bicycle_photos; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.intervention_bicycle_photos TO lecycleuser;


--
-- Name: SEQUENCE intervention_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.intervention_id_seq TO lecycleuser;


--
-- Name: TABLE intervention_technician_photos; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.intervention_technician_photos TO lecycleuser;


--
-- Name: SEQUENCE intervention_technician_photos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.intervention_technician_photos_id_seq TO lecycleuser;


--
-- Name: SEQUENCE interventionphoto_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.interventionphoto_id_seq TO lecycleuser;


--
-- Name: SEQUENCE interventionphoto_id_seq1; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.interventionphoto_id_seq1 TO lecycleuser;


--
-- Name: TABLE interventionproduct; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.interventionproduct TO lecycleuser;


--
-- Name: TABLE photo; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.photo TO lecycleuser;


--
-- Name: TABLE planning_model_zones; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.planning_model_zones TO lecycleuser;


--
-- Name: SEQUENCE planning_model_zones_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.planning_model_zones_id_seq TO lecycleuser;


--
-- Name: TABLE planning_models; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.planning_models TO lecycleuser;


--
-- Name: SEQUENCE planning_models_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.planning_models_id_seq TO lecycleuser;


--
-- Name: TABLE product; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.product TO lecycleuser;


--
-- Name: TABLE product_photos; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.product_photos TO lecycleuser;


--
-- Name: TABLE spatial_ref_sys; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.spatial_ref_sys TO lecycleuser;


--
-- Name: TABLE technician; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.technician TO lecycleuser;


--
-- Name: SEQUENCE technician_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.technician_id_seq TO lecycleuser;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO lecycleuser;


--
-- PostgreSQL database dump complete
--

