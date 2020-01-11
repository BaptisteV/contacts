# Contacts

Small web app to save and delete contacts

### Techs

NodeJS with express

PostgreSQL DB

Vanilla JS


### Install

~~~
npm install
~~~

~~~sql
-- Database: contacts

-- DROP DATABASE contacts;

CREATE DATABASE contacts
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'French_France.1252'
    LC_CTYPE = 'French_France.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

CREATE TABLE public.contacts
(
    "ID" integer NOT NULL DEFAULT nextval('"contacts_ID_seq"'::regclass),
    "firstName" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT contacts_pkey PRIMARY KEY ("ID")
)

TABLESPACE pg_default;

ALTER TABLE public.contacts
    OWNER to postgres;

ALTER TABLE public.contacts
    ADD COLUMN price money DEFAULT 0;
~~~

### Run 

~~~
node index.js
~~~