

SELECT pg_catalog.set_config('search_path', '', false);

ALTER TABLE IF EXISTS ONLY public.product_photos DROP CONSTRAINT IF EXISTS productphoto_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_photos DROP CONSTRAINT IF EXISTS productphoto_id_1_fkey;
ALTER TABLE IF EXISTS ONLY public.planning_model_zones DROP CONSTRAINT IF EXISTS "planningIdRepair";
ALTER TABLE IF EXISTS ONLY public.planning_model_zones DROP CONSTRAINT IF EXISTS "planningIdMaintenance";
ALTER TABLE IF EXISTS ONLY public.interventionproduct DROP CONSTRAINT IF EXISTS interventionproduct_id_fkey;
ALTER TABLE IF EXISTS ONLY public.intervention_technician_photos DROP CONSTRAINT IF EXISTS intervention_photos_intervention_id_fkey;
ALTER TABLE IF EXISTS ONLY public.intervention_bicycle_photos DROP CONSTRAINT IF EXISTS intervention_id_fkey;
ALTER TABLE IF EXISTS ONLY public.intervention DROP CONSTRAINT IF EXISTS intervention_id_4_fkey;
ALTER TABLE IF EXISTS ONLY public.intervention DROP CONSTRAINT IF EXISTS intervention_id_3_fkey;
ALTER TABLE IF EXISTS ONLY public.intervention DROP CONSTRAINT IF EXISTS intervention_id_2_fkey;
ALTER TABLE IF EXISTS ONLY public.geographical_zone DROP CONSTRAINT IF EXISTS geographical_zone_company_id_fkey;
ALTER TABLE IF EXISTS ONLY public.technician DROP CONSTRAINT IF EXISTS company_pkey;
ALTER TABLE IF EXISTS ONLY public.client DROP CONSTRAINT IF EXISTS company_fkey_id;
ALTER TABLE IF EXISTS ONLY public.planning_models DROP CONSTRAINT IF EXISTS company_fkey;
ALTER TABLE IF EXISTS ONLY public.bicycle DROP CONSTRAINT IF EXISTS "clientId";
ALTER TABLE IF EXISTS ONLY public.bicycle_photos DROP CONSTRAINT IF EXISTS bicycle_id;
ALTER TABLE IF EXISTS ONLY public.administrator DROP CONSTRAINT IF EXISTS administrator_company_id_fkey;
ALTER TABLE IF EXISTS ONLY public.technician DROP CONSTRAINT IF EXISTS technician_pkey;
ALTER TABLE IF EXISTS ONLY public.technician DROP CONSTRAINT IF EXISTS technician_email_key;
ALTER TABLE IF EXISTS ONLY public.product_photos DROP CONSTRAINT IF EXISTS productphoto_pkey;
ALTER TABLE IF EXISTS ONLY public.product DROP CONSTRAINT IF EXISTS product_pkey;
ALTER TABLE IF EXISTS ONLY public.planning_models DROP CONSTRAINT IF EXISTS planning_models_pkey;
ALTER TABLE IF EXISTS ONLY public.planning_model_zones DROP CONSTRAINT IF EXISTS planning_model_zones_pkey;
ALTER TABLE IF EXISTS ONLY public.photo DROP CONSTRAINT IF EXISTS photo_pkey;
ALTER TABLE IF EXISTS ONLY public.interventionproduct DROP CONSTRAINT IF EXISTS interventionproduct_pkey;
ALTER TABLE IF EXISTS ONLY public.intervention_technician_photos DROP CONSTRAINT IF EXISTS interventionphototech_pkey;
ALTER TABLE IF EXISTS ONLY public.intervention_bicycle_photos DROP CONSTRAINT IF EXISTS interventionphoto_pkey;
ALTER TABLE IF EXISTS ONLY public.intervention DROP CONSTRAINT IF EXISTS intervention_pkey;
ALTER TABLE IF EXISTS ONLY public.intervention DROP CONSTRAINT IF EXISTS intervention_id_4_key;
ALTER TABLE IF EXISTS ONLY public.geographical_zone DROP CONSTRAINT IF EXISTS geographical_zone_pkey;
ALTER TABLE IF EXISTS ONLY public.company DROP CONSTRAINT IF EXISTS email_unique;
ALTER TABLE IF EXISTS ONLY public.company DROP CONSTRAINT IF EXISTS company_pkey;
ALTER TABLE IF EXISTS ONLY public.client DROP CONSTRAINT IF EXISTS client_pkey;
ALTER TABLE IF EXISTS ONLY public.bicycle DROP CONSTRAINT IF EXISTS bicycle_pkey;
ALTER TABLE IF EXISTS ONLY public.bicycle_photos DROP CONSTRAINT IF EXISTS "bicyclePhoto_pkey";
ALTER TABLE IF EXISTS ONLY public.administrator DROP CONSTRAINT IF EXISTS administrator_pkey;
ALTER TABLE IF EXISTS public.geographical_zone ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.technician;
DROP TABLE IF EXISTS public.product_photos;
DROP TABLE IF EXISTS public.product;
DROP TABLE IF EXISTS public.planning_models;
DROP TABLE IF EXISTS public.planning_model_zones;
DROP TABLE IF EXISTS public.photo;
DROP TABLE IF EXISTS public.interventionproduct;
DROP SEQUENCE IF EXISTS public.interventionphoto_id_seq;
DROP TABLE IF EXISTS public.intervention_technician_photos;
DROP TABLE IF EXISTS public.intervention_bicycle_photos;
DROP TABLE IF EXISTS public.intervention;
DROP SEQUENCE IF EXISTS public.geographical_zone_id_seq;
DROP TABLE IF EXISTS public.geographical_zone;
DROP TABLE IF EXISTS public.company;
DROP TABLE IF EXISTS public.client;
DROP TABLE IF EXISTS public.bicycle_photos;
DROP TABLE IF EXISTS public.bicycle;
DROP TABLE IF EXISTS public.administrator;
DROP EXTENSION IF EXISTS postgis_topology;
DROP EXTENSION IF EXISTS postgis;
DROP SCHEMA IF EXISTS topology;

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO lecycle_user;


COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';



CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;



COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';



CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;



COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';





CREATE TABLE public.administrator (
    first_name character varying(50),
    last_name character varying(50),
    email character varying(50),
    password character varying(250),
    role character varying(50),
    id integer NOT NULL,
    company_id integer
);


ALTER TABLE public.administrator OWNER TO lecycle_user;


ALTER TABLE public.administrator ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.administrator_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE public.bicycle (
    id integer NOT NULL,
    model character varying(50),
    c_year integer,
    type character varying(50),
    brand character varying(50),
    client_id integer
);


ALTER TABLE public.bicycle OWNER TO lecycle_user;


ALTER TABLE public.bicycle ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bicycle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE public.bicycle_photos (
    id integer NOT NULL,
    file_path character varying(250) NOT NULL,
    bicycle_id integer NOT NULL
);


ALTER TABLE public.bicycle_photos OWNER TO lecycle_user;


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


ALTER TABLE public.client OWNER TO lecycle_user;


ALTER TABLE public.client ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.client_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



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


ALTER TABLE public.company OWNER TO lecycle_user;


ALTER TABLE public.company ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE public.geographical_zone (
    id integer NOT NULL,
    zone_name character varying(100) NOT NULL,
    coordinates public.geometry(Polygon,4326),
    company_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.geographical_zone OWNER TO lecycle_user;


CREATE SEQUENCE public.geographical_zone_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.geographical_zone_id_seq OWNER TO lecycle_user;


ALTER SEQUENCE public.geographical_zone_id_seq OWNED BY public.geographical_zone.id;



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


ALTER TABLE public.intervention OWNER TO lecycle_user;


CREATE TABLE public.intervention_bicycle_photos (
    id integer NOT NULL,
    file_path character varying,
    intervention_id integer
);


ALTER TABLE public.intervention_bicycle_photos OWNER TO lecycle_user;


ALTER TABLE public.intervention ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.intervention_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE public.intervention_technician_photos (
    id integer NOT NULL,
    file_path character varying,
    intervention_id integer
);


ALTER TABLE public.intervention_technician_photos OWNER TO lecycle_user;


ALTER TABLE public.intervention_technician_photos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.intervention_technician_photos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE SEQUENCE public.interventionphoto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.interventionphoto_id_seq OWNER TO lecycle_user;


ALTER SEQUENCE public.interventionphoto_id_seq OWNED BY public.intervention_bicycle_photos.id;



ALTER TABLE public.intervention_bicycle_photos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.interventionphoto_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE public.interventionproduct (
    id integer NOT NULL,
    id_1 character varying(50) NOT NULL,
    quantitiy integer,
    price numeric(15,2)
);


ALTER TABLE public.interventionproduct OWNER TO lecycle_user;


CREATE TABLE public.photo (
    id integer NOT NULL,
    uri character varying(50)
);


ALTER TABLE public.photo OWNER TO lecycle_user;


CREATE TABLE public.planning_model_zones (
    id integer NOT NULL,
    zone_id integer,
    planning_model_id_maintenance integer,
    planning_model_id_repair integer
);


ALTER TABLE public.planning_model_zones OWNER TO lecycle_user;


ALTER TABLE public.planning_model_zones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.planning_model_zones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



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


ALTER TABLE public.planning_models OWNER TO lecycle_user;


ALTER TABLE public.planning_models ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.planning_models_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE public.product (
    id integer NOT NULL,
    name character varying(50),
    description integer,
    price numeric(15,2),
    stock_available integer
);


ALTER TABLE public.product OWNER TO lecycle_user;


CREATE TABLE public.product_photos (
    id integer NOT NULL,
    id_1 integer NOT NULL
);


ALTER TABLE public.product_photos OWNER TO lecycle_user;


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


ALTER TABLE public.technician OWNER TO lecycle_user;


ALTER TABLE public.technician ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.technician_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY public.geographical_zone ALTER COLUMN id SET DEFAULT nextval('public.geographical_zone_id_seq'::regclass);



ALTER TABLE ONLY public.administrator
    ADD CONSTRAINT administrator_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.bicycle_photos
    ADD CONSTRAINT "bicyclePhoto_pkey" PRIMARY KEY (id);



ALTER TABLE ONLY public.bicycle
    ADD CONSTRAINT bicycle_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.company
    ADD CONSTRAINT email_unique UNIQUE (email);



ALTER TABLE ONLY public.geographical_zone
    ADD CONSTRAINT geographical_zone_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.intervention
    ADD CONSTRAINT intervention_id_4_key UNIQUE (bicycle_id);



ALTER TABLE ONLY public.intervention
    ADD CONSTRAINT intervention_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.intervention_bicycle_photos
    ADD CONSTRAINT interventionphoto_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.intervention_technician_photos
    ADD CONSTRAINT interventionphototech_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.interventionproduct
    ADD CONSTRAINT interventionproduct_pkey PRIMARY KEY (id, id_1);



ALTER TABLE ONLY public.photo
    ADD CONSTRAINT photo_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.planning_model_zones
    ADD CONSTRAINT planning_model_zones_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.planning_models
    ADD CONSTRAINT planning_models_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.product_photos
    ADD CONSTRAINT productphoto_pkey PRIMARY KEY (id, id_1);



ALTER TABLE ONLY public.technician
    ADD CONSTRAINT technician_email_key UNIQUE (email);



ALTER TABLE ONLY public.technician
    ADD CONSTRAINT technician_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.administrator
    ADD CONSTRAINT administrator_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;



ALTER TABLE ONLY public.bicycle_photos
    ADD CONSTRAINT bicycle_id FOREIGN KEY (bicycle_id) REFERENCES public.bicycle(id) NOT VALID;



ALTER TABLE ONLY public.bicycle
    ADD CONSTRAINT "clientId" FOREIGN KEY (client_id) REFERENCES public.client(id) ON UPDATE SET NULL ON DELETE SET NULL NOT VALID;



ALTER TABLE ONLY public.planning_models
    ADD CONSTRAINT company_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;



ALTER TABLE ONLY public.client
    ADD CONSTRAINT company_fkey_id FOREIGN KEY (company_id) REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;



ALTER TABLE ONLY public.technician
    ADD CONSTRAINT company_pkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;



ALTER TABLE ONLY public.geographical_zone
    ADD CONSTRAINT geographical_zone_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.intervention
    ADD CONSTRAINT intervention_id_2_fkey FOREIGN KEY (technician_id) REFERENCES public.technician(id);



ALTER TABLE ONLY public.intervention
    ADD CONSTRAINT intervention_id_3_fkey FOREIGN KEY (client_id) REFERENCES public.client(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;



ALTER TABLE ONLY public.intervention
    ADD CONSTRAINT intervention_id_4_fkey FOREIGN KEY (bicycle_id) REFERENCES public.bicycle(id) ON UPDATE SET NULL ON DELETE SET NULL NOT VALID;



ALTER TABLE ONLY public.intervention_bicycle_photos
    ADD CONSTRAINT intervention_id_fkey FOREIGN KEY (intervention_id) REFERENCES public.intervention(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;



ALTER TABLE ONLY public.intervention_technician_photos
    ADD CONSTRAINT intervention_photos_intervention_id_fkey FOREIGN KEY (intervention_id) REFERENCES public.intervention(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;



ALTER TABLE ONLY public.interventionproduct
    ADD CONSTRAINT interventionproduct_id_fkey FOREIGN KEY (id) REFERENCES public.product(id);



ALTER TABLE ONLY public.planning_model_zones
    ADD CONSTRAINT "planningIdMaintenance" FOREIGN KEY (planning_model_id_maintenance) REFERENCES public.planning_models(id) NOT VALID;



ALTER TABLE ONLY public.planning_model_zones
    ADD CONSTRAINT "planningIdRepair" FOREIGN KEY (planning_model_id_repair) REFERENCES public.planning_models(id) NOT VALID;



ALTER TABLE ONLY public.product_photos
    ADD CONSTRAINT productphoto_id_1_fkey FOREIGN KEY (id_1) REFERENCES public.photo(id);



ALTER TABLE ONLY public.product_photos
    ADD CONSTRAINT productphoto_id_fkey FOREIGN KEY (id) REFERENCES public.product(id);



GRANT USAGE ON SCHEMA public TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.administrator TO lecycle_app;



GRANT ALL ON SEQUENCE public.administrator_id_seq TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.bicycle TO lecycle_app;



GRANT ALL ON SEQUENCE public.bicycle_id_seq TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.bicycle_photos TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.client TO lecycle_app;



GRANT ALL ON SEQUENCE public.client_id_seq TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.company TO lecycle_app;



GRANT ALL ON SEQUENCE public.company_id_seq TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.geographical_zone TO lecycle_app;



GRANT ALL ON SEQUENCE public.geographical_zone_id_seq TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.geography_columns TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.geometry_columns TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.intervention TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.intervention_bicycle_photos TO lecycle_app;



GRANT ALL ON SEQUENCE public.intervention_id_seq TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.intervention_technician_photos TO lecycle_app;



GRANT ALL ON SEQUENCE public.intervention_technician_photos_id_seq TO lecycle_app;



GRANT ALL ON SEQUENCE public.interventionphoto_id_seq TO lecycle_app;



GRANT ALL ON SEQUENCE public.interventionphoto_id_seq1 TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.interventionproduct TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.photo TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.planning_model_zones TO lecycle_app;



GRANT ALL ON SEQUENCE public.planning_model_zones_id_seq TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.planning_models TO lecycle_app;



GRANT ALL ON SEQUENCE public.planning_models_id_seq TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.product TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.product_photos TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.spatial_ref_sys TO lecycle_app;



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.technician TO lecycle_app;



GRANT ALL ON SEQUENCE public.technician_id_seq TO lecycle_app;



ALTER DEFAULT PRIVILEGES FOR ROLE lecycle_user IN SCHEMA public GRANT ALL ON SEQUENCES  TO lecycle_app;



ALTER DEFAULT PRIVILEGES FOR ROLE lecycle_user IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES  TO lecycle_app;



