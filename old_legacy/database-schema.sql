--
-- PostgreSQL database dump
--

\restrict qWOxZtHHhqT8t1CS8N4BkUH5ZaAOqEvjp2R4fexnb32Cpo3bLW4khYUsDRi0Uy5

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: tfiverse
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO tfiverse;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.account (
    "userId" uuid NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.account OWNER TO tfiverse;

--
-- Name: hero_follow_counts; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.hero_follow_counts (
    hero_slug text NOT NULL,
    count integer DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hero_follow_counts OWNER TO tfiverse;

--
-- Name: hero_follows; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.hero_follows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    hero_slug text NOT NULL,
    hero_name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hero_follows OWNER TO tfiverse;

--
-- Name: hero_movies; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.hero_movies (
    id integer NOT NULL,
    hero_id integer NOT NULL,
    movie_id integer NOT NULL,
    role text,
    created_at timestamp without time zone DEFAULT now(),
    movie_type text
);


ALTER TABLE public.hero_movies OWNER TO tfiverse;

--
-- Name: hero_movies_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.hero_movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hero_movies_id_seq OWNER TO tfiverse;

--
-- Name: hero_movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.hero_movies_id_seq OWNED BY public.hero_movies.id;


--
-- Name: heroes; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.heroes (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    hero_id text NOT NULL,
    data jsonb NOT NULL,
    title text,
    category text,
    tmdb_person_id text
);


ALTER TABLE public.heroes OWNER TO tfiverse;

--
-- Name: heroes_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.heroes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.heroes_id_seq OWNER TO tfiverse;

--
-- Name: heroes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.heroes_id_seq OWNED BY public.heroes.id;


--
-- Name: meme_bookmarks; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.meme_bookmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meme_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.meme_bookmarks OWNER TO tfiverse;

--
-- Name: meme_comments; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.meme_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meme_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    comment text NOT NULL
);


ALTER TABLE public.meme_comments OWNER TO tfiverse;

--
-- Name: meme_downloads; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.meme_downloads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meme_id uuid NOT NULL,
    user_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.meme_downloads OWNER TO tfiverse;

--
-- Name: meme_likes; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.meme_likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meme_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.meme_likes OWNER TO tfiverse;

--
-- Name: meme_reports; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.meme_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meme_id uuid NOT NULL,
    reported_by uuid NOT NULL,
    reason text NOT NULL,
    details text,
    status text DEFAULT 'pending'::text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.meme_reports OWNER TO tfiverse;

--
-- Name: meme_shares; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.meme_shares (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meme_id uuid NOT NULL,
    user_id uuid,
    platform text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.meme_shares OWNER TO tfiverse;

--
-- Name: meme_views; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.meme_views (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    meme_id uuid NOT NULL,
    user_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    ip_address text
);


ALTER TABLE public.meme_views OWNER TO tfiverse;

--
-- Name: memes; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.memes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    tags json DEFAULT '[]'::json,
    hero_tags json DEFAULT '[]'::json,
    likes integer DEFAULT 0,
    views integer DEFAULT 0,
    shares integer DEFAULT 0,
    downloads integer DEFAULT 0,
    status text DEFAULT 'pending'::text NOT NULL,
    allow_comments boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.memes OWNER TO tfiverse;

--
-- Name: movies; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.movies (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    release_date text,
    status text DEFAULT 'released'::text,
    language text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    movie_id text NOT NULL,
    data jsonb NOT NULL,
    year integer,
    tmdb_id integer
);


ALTER TABLE public.movies OWNER TO tfiverse;

--
-- Name: movies_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_id_seq OWNER TO tfiverse;

--
-- Name: movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.movies_id_seq OWNED BY public.movies.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    category text DEFAULT 'general'::text,
    hero_id integer,
    movie_id integer,
    source_url text,
    image_url text,
    tags json,
    published_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.news OWNER TO tfiverse;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO tfiverse;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: password_reset_token; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.password_reset_token (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    token text NOT NULL,
    expires timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.password_reset_token OWNER TO tfiverse;

--
-- Name: profile_follows; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.profile_follows (
    id integer NOT NULL,
    follower_id integer NOT NULL,
    following_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_follows OWNER TO tfiverse;

--
-- Name: profile_follows_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.profile_follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_follows_id_seq OWNER TO tfiverse;

--
-- Name: profile_follows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.profile_follows_id_seq OWNED BY public.profile_follows.id;


--
-- Name: profile_memes; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.profile_memes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    image_url text NOT NULL,
    caption text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_memes OWNER TO tfiverse;

--
-- Name: profile_memes_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.profile_memes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_memes_id_seq OWNER TO tfiverse;

--
-- Name: profile_memes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.profile_memes_id_seq OWNED BY public.profile_memes.id;


--
-- Name: profile_online_status; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.profile_online_status (
    user_id integer NOT NULL,
    is_online boolean DEFAULT false,
    last_seen timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_online_status OWNER TO tfiverse;

--
-- Name: profile_profile_views; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.profile_profile_views (
    id integer NOT NULL,
    viewer_id integer,
    profile_id integer NOT NULL,
    viewed_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_profile_views OWNER TO tfiverse;

--
-- Name: profile_profile_views_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.profile_profile_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_profile_views_id_seq OWNER TO tfiverse;

--
-- Name: profile_profile_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.profile_profile_views_id_seq OWNED BY public.profile_profile_views.id;


--
-- Name: profile_reviews; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.profile_reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_slug character varying(255) NOT NULL,
    rating integer NOT NULL,
    review_text text,
    spoilers boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_reviews OWNER TO tfiverse;

--
-- Name: profile_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.profile_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_reviews_id_seq OWNER TO tfiverse;

--
-- Name: profile_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.profile_reviews_id_seq OWNED BY public.profile_reviews.id;


--
-- Name: profile_tier_lists; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.profile_tier_lists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    movies jsonb,
    is_pinned boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_tier_lists OWNER TO tfiverse;

--
-- Name: profile_tier_lists_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.profile_tier_lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_tier_lists_id_seq OWNER TO tfiverse;

--
-- Name: profile_tier_lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.profile_tier_lists_id_seq OWNED BY public.profile_tier_lists.id;


--
-- Name: profile_user_profiles; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.profile_user_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    bio text,
    avatar_url text,
    banner_url text,
    user_location character varying(100),
    pronouns character varying(50),
    twitter_url text,
    instagram_url text,
    youtube_url text,
    tiktok_url text,
    imdb_url text,
    letterboxd_url text,
    website text,
    favorite_badges jsonb,
    status_message text,
    show_followers boolean DEFAULT true,
    show_following boolean DEFAULT true,
    show_watchlist boolean DEFAULT true,
    show_watched boolean DEFAULT true,
    show_reviews boolean DEFAULT true,
    show_tier_lists boolean DEFAULT true,
    show_memes boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_user_profiles OWNER TO tfiverse;

--
-- Name: profile_user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.profile_user_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_user_profiles_id_seq OWNER TO tfiverse;

--
-- Name: profile_user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.profile_user_profiles_id_seq OWNED BY public.profile_user_profiles.id;


--
-- Name: profile_users; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.profile_users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_users OWNER TO tfiverse;

--
-- Name: profile_users_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.profile_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_users_id_seq OWNER TO tfiverse;

--
-- Name: profile_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.profile_users_id_seq OWNED BY public.profile_users.id;


--
-- Name: profile_watched_movies; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.profile_watched_movies (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_slug character varying(255) NOT NULL,
    watched_at timestamp without time zone DEFAULT now(),
    rating integer
);


ALTER TABLE public.profile_watched_movies OWNER TO tfiverse;

--
-- Name: profile_watched_movies_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.profile_watched_movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_watched_movies_id_seq OWNER TO tfiverse;

--
-- Name: profile_watched_movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.profile_watched_movies_id_seq OWNED BY public.profile_watched_movies.id;


--
-- Name: profile_watchlist; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.profile_watchlist (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_slug character varying(255) NOT NULL,
    added_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_watchlist OWNER TO tfiverse;

--
-- Name: profile_watchlist_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.profile_watchlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_watchlist_id_seq OWNER TO tfiverse;

--
-- Name: profile_watchlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.profile_watchlist_id_seq OWNED BY public.profile_watchlist.id;


--
-- Name: rumors; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.rumors (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    hero_id integer,
    movie_id integer,
    status text DEFAULT 'rumor'::text,
    source_url text,
    image_url text,
    published_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.rumors OWNER TO tfiverse;

--
-- Name: rumors_id_seq; Type: SEQUENCE; Schema: public; Owner: tfiverse
--

CREATE SEQUENCE public.rumors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rumors_id_seq OWNER TO tfiverse;

--
-- Name: rumors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tfiverse
--

ALTER SEQUENCE public.rumors_id_seq OWNED BY public.rumors.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.session (
    "sessionToken" text NOT NULL,
    "userId" uuid NOT NULL,
    expires timestamp without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO tfiverse;

--
-- Name: tier_list; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.tier_list (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "userId" uuid NOT NULL,
    title text NOT NULL,
    description text,
    tiers json DEFAULT '{"S":[],"A":[],"B":[],"C":[],"D":[],"F":[]}'::json,
    "isPublic" boolean DEFAULT true,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tier_list OWNER TO tfiverse;

--
-- Name: tier_list_like; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.tier_list_like (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "userId" uuid NOT NULL,
    "tierListId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tier_list_like OWNER TO tfiverse;

--
-- Name: user; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text,
    email text NOT NULL,
    "emailVerified" timestamp without time zone,
    image text,
    password text,
    "createdAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE public."user" OWNER TO tfiverse;

--
-- Name: user_follows; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.user_follows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "followerId" uuid NOT NULL,
    "followingId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_follows OWNER TO tfiverse;

--
-- Name: user_profile; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public.user_profile (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "userId" uuid NOT NULL,
    username text NOT NULL,
    bio text,
    location text,
    website text,
    "coverImage" text,
    "totalReviews" integer DEFAULT 0,
    "totalWatchlist" integer DEFAULT 0,
    "totalFollowers" integer DEFAULT 0,
    "totalFollowing" integer DEFAULT 0,
    badges json DEFAULT '[]'::json,
    "isPublic" boolean DEFAULT true,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    pronouns text,
    "statusMessage" text,
    "avatarUrl" text,
    "bannerUrl" text,
    "twitterUrl" text,
    "instagramUrl" text,
    "youtubeUrl" text,
    "tiktokUrl" text,
    "imdbUrl" text,
    "letterboxdUrl" text,
    "totalWatched" integer DEFAULT 0,
    "totalMemes" integer DEFAULT 0,
    "totalTierLists" integer DEFAULT 0,
    "favoriteBadges" json DEFAULT '[]'::json,
    "showFollowers" boolean DEFAULT true,
    "showFollowing" boolean DEFAULT true,
    "showWatchlist" boolean DEFAULT true,
    "showWatched" boolean DEFAULT true,
    "showReviews" boolean DEFAULT true,
    "showTierLists" boolean DEFAULT true,
    "showMemes" boolean DEFAULT true,
    "isOnline" boolean DEFAULT false,
    "lastSeen" timestamp without time zone
);


ALTER TABLE public.user_profile OWNER TO tfiverse;

--
-- Name: verificationToken; Type: TABLE; Schema: public; Owner: tfiverse
--

CREATE TABLE public."verificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp without time zone NOT NULL
);


ALTER TABLE public."verificationToken" OWNER TO tfiverse;

--
-- Name: hero_movies id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.hero_movies ALTER COLUMN id SET DEFAULT nextval('public.hero_movies_id_seq'::regclass);


--
-- Name: heroes id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.heroes ALTER COLUMN id SET DEFAULT nextval('public.heroes_id_seq'::regclass);


--
-- Name: movies id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.movies ALTER COLUMN id SET DEFAULT nextval('public.movies_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: profile_follows id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_follows ALTER COLUMN id SET DEFAULT nextval('public.profile_follows_id_seq'::regclass);


--
-- Name: profile_memes id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_memes ALTER COLUMN id SET DEFAULT nextval('public.profile_memes_id_seq'::regclass);


--
-- Name: profile_profile_views id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_profile_views ALTER COLUMN id SET DEFAULT nextval('public.profile_profile_views_id_seq'::regclass);


--
-- Name: profile_reviews id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_reviews ALTER COLUMN id SET DEFAULT nextval('public.profile_reviews_id_seq'::regclass);


--
-- Name: profile_tier_lists id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_tier_lists ALTER COLUMN id SET DEFAULT nextval('public.profile_tier_lists_id_seq'::regclass);


--
-- Name: profile_user_profiles id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_user_profiles ALTER COLUMN id SET DEFAULT nextval('public.profile_user_profiles_id_seq'::regclass);


--
-- Name: profile_users id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_users ALTER COLUMN id SET DEFAULT nextval('public.profile_users_id_seq'::regclass);


--
-- Name: profile_watched_movies id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_watched_movies ALTER COLUMN id SET DEFAULT nextval('public.profile_watched_movies_id_seq'::regclass);


--
-- Name: profile_watchlist id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_watchlist ALTER COLUMN id SET DEFAULT nextval('public.profile_watchlist_id_seq'::regclass);


--
-- Name: rumors id; Type: DEFAULT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.rumors ALTER COLUMN id SET DEFAULT nextval('public.rumors_id_seq'::regclass);


--
-- Name: account account_provider_providerAccountId_pk; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY (provider, "providerAccountId");


--
-- Name: hero_follow_counts hero_follow_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.hero_follow_counts
    ADD CONSTRAINT hero_follow_counts_pkey PRIMARY KEY (hero_slug);


--
-- Name: hero_follows hero_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.hero_follows
    ADD CONSTRAINT hero_follows_pkey PRIMARY KEY (id);


--
-- Name: hero_movies hero_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.hero_movies
    ADD CONSTRAINT hero_movies_pkey PRIMARY KEY (id);


--
-- Name: heroes heroes_hero_id_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_hero_id_unique UNIQUE (hero_id);


--
-- Name: heroes heroes_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_pkey PRIMARY KEY (id);


--
-- Name: heroes heroes_slug_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_slug_unique UNIQUE (slug);


--
-- Name: meme_bookmarks meme_bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_bookmarks
    ADD CONSTRAINT meme_bookmarks_pkey PRIMARY KEY (id);


--
-- Name: meme_comments meme_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_comments
    ADD CONSTRAINT meme_comments_pkey PRIMARY KEY (id);


--
-- Name: meme_downloads meme_downloads_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_downloads
    ADD CONSTRAINT meme_downloads_pkey PRIMARY KEY (id);


--
-- Name: meme_likes meme_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_likes
    ADD CONSTRAINT meme_likes_pkey PRIMARY KEY (id);


--
-- Name: meme_reports meme_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_reports
    ADD CONSTRAINT meme_reports_pkey PRIMARY KEY (id);


--
-- Name: meme_shares meme_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_shares
    ADD CONSTRAINT meme_shares_pkey PRIMARY KEY (id);


--
-- Name: meme_views meme_views_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_views
    ADD CONSTRAINT meme_views_pkey PRIMARY KEY (id);


--
-- Name: memes memes_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.memes
    ADD CONSTRAINT memes_pkey PRIMARY KEY (id);


--
-- Name: movies movies_movie_id_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_movie_id_unique UNIQUE (movie_id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- Name: movies movies_slug_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_slug_unique UNIQUE (slug);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_slug_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_unique UNIQUE (slug);


--
-- Name: password_reset_token password_reset_token_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_pkey PRIMARY KEY (id);


--
-- Name: password_reset_token password_reset_token_token_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_token_unique UNIQUE (token);


--
-- Name: profile_follows profile_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_follows
    ADD CONSTRAINT profile_follows_pkey PRIMARY KEY (id);


--
-- Name: profile_memes profile_memes_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_memes
    ADD CONSTRAINT profile_memes_pkey PRIMARY KEY (id);


--
-- Name: profile_online_status profile_online_status_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_online_status
    ADD CONSTRAINT profile_online_status_pkey PRIMARY KEY (user_id);


--
-- Name: profile_profile_views profile_profile_views_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_profile_views
    ADD CONSTRAINT profile_profile_views_pkey PRIMARY KEY (id);


--
-- Name: profile_reviews profile_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_reviews
    ADD CONSTRAINT profile_reviews_pkey PRIMARY KEY (id);


--
-- Name: profile_tier_lists profile_tier_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_tier_lists
    ADD CONSTRAINT profile_tier_lists_pkey PRIMARY KEY (id);


--
-- Name: profile_user_profiles profile_user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_user_profiles
    ADD CONSTRAINT profile_user_profiles_pkey PRIMARY KEY (id);


--
-- Name: profile_user_profiles profile_user_profiles_username_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_user_profiles
    ADD CONSTRAINT profile_user_profiles_username_unique UNIQUE (username);


--
-- Name: profile_users profile_users_email_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_users
    ADD CONSTRAINT profile_users_email_unique UNIQUE (email);


--
-- Name: profile_users profile_users_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_users
    ADD CONSTRAINT profile_users_pkey PRIMARY KEY (id);


--
-- Name: profile_watched_movies profile_watched_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_watched_movies
    ADD CONSTRAINT profile_watched_movies_pkey PRIMARY KEY (id);


--
-- Name: profile_watchlist profile_watchlist_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_watchlist
    ADD CONSTRAINT profile_watchlist_pkey PRIMARY KEY (id);


--
-- Name: rumors rumors_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.rumors
    ADD CONSTRAINT rumors_pkey PRIMARY KEY (id);


--
-- Name: rumors rumors_slug_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.rumors
    ADD CONSTRAINT rumors_slug_unique UNIQUE (slug);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY ("sessionToken");


--
-- Name: tier_list_like tier_list_like_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.tier_list_like
    ADD CONSTRAINT tier_list_like_pkey PRIMARY KEY (id);


--
-- Name: tier_list tier_list_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.tier_list
    ADD CONSTRAINT tier_list_pkey PRIMARY KEY (id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user_follows user_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_profile user_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_pkey PRIMARY KEY (id);


--
-- Name: user_profile user_profile_userId_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT "user_profile_userId_unique" UNIQUE ("userId");


--
-- Name: user_profile user_profile_username_unique; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_username_unique UNIQUE (username);


--
-- Name: verificationToken verificationToken_identifier_token_pk; Type: CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public."verificationToken"
    ADD CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY (identifier, token);


--
-- Name: user_hero_idx; Type: INDEX; Schema: public; Owner: tfiverse
--

CREATE UNIQUE INDEX user_hero_idx ON public.hero_follows USING btree (user_id, hero_slug);


--
-- Name: account account_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: hero_follows hero_follows_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.hero_follows
    ADD CONSTRAINT hero_follows_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: hero_movies hero_movies_hero_id_heroes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.hero_movies
    ADD CONSTRAINT hero_movies_hero_id_heroes_id_fk FOREIGN KEY (hero_id) REFERENCES public.heroes(id) ON DELETE CASCADE;


--
-- Name: hero_movies hero_movies_movie_id_movies_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.hero_movies
    ADD CONSTRAINT hero_movies_movie_id_movies_id_fk FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: meme_bookmarks meme_bookmarks_meme_id_memes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_bookmarks
    ADD CONSTRAINT meme_bookmarks_meme_id_memes_id_fk FOREIGN KEY (meme_id) REFERENCES public.memes(id) ON DELETE CASCADE;


--
-- Name: meme_bookmarks meme_bookmarks_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_bookmarks
    ADD CONSTRAINT meme_bookmarks_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: meme_comments meme_comments_meme_id_memes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_comments
    ADD CONSTRAINT meme_comments_meme_id_memes_id_fk FOREIGN KEY (meme_id) REFERENCES public.memes(id) ON DELETE CASCADE;


--
-- Name: meme_comments meme_comments_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_comments
    ADD CONSTRAINT meme_comments_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: meme_downloads meme_downloads_meme_id_memes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_downloads
    ADD CONSTRAINT meme_downloads_meme_id_memes_id_fk FOREIGN KEY (meme_id) REFERENCES public.memes(id) ON DELETE CASCADE;


--
-- Name: meme_downloads meme_downloads_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_downloads
    ADD CONSTRAINT meme_downloads_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: meme_likes meme_likes_meme_id_memes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_likes
    ADD CONSTRAINT meme_likes_meme_id_memes_id_fk FOREIGN KEY (meme_id) REFERENCES public.memes(id) ON DELETE CASCADE;


--
-- Name: meme_likes meme_likes_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_likes
    ADD CONSTRAINT meme_likes_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: meme_reports meme_reports_meme_id_memes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_reports
    ADD CONSTRAINT meme_reports_meme_id_memes_id_fk FOREIGN KEY (meme_id) REFERENCES public.memes(id) ON DELETE CASCADE;


--
-- Name: meme_reports meme_reports_reported_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_reports
    ADD CONSTRAINT meme_reports_reported_by_user_id_fk FOREIGN KEY (reported_by) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: meme_shares meme_shares_meme_id_memes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_shares
    ADD CONSTRAINT meme_shares_meme_id_memes_id_fk FOREIGN KEY (meme_id) REFERENCES public.memes(id) ON DELETE CASCADE;


--
-- Name: meme_shares meme_shares_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_shares
    ADD CONSTRAINT meme_shares_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: meme_views meme_views_meme_id_memes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_views
    ADD CONSTRAINT meme_views_meme_id_memes_id_fk FOREIGN KEY (meme_id) REFERENCES public.memes(id) ON DELETE CASCADE;


--
-- Name: meme_views meme_views_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.meme_views
    ADD CONSTRAINT meme_views_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: memes memes_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.memes
    ADD CONSTRAINT memes_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: news news_hero_id_heroes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_hero_id_heroes_id_fk FOREIGN KEY (hero_id) REFERENCES public.heroes(id);


--
-- Name: news news_movie_id_movies_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_movie_id_movies_id_fk FOREIGN KEY (movie_id) REFERENCES public.movies(id);


--
-- Name: profile_follows profile_follows_follower_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_follows
    ADD CONSTRAINT profile_follows_follower_id_profile_users_id_fk FOREIGN KEY (follower_id) REFERENCES public.profile_users(id);


--
-- Name: profile_follows profile_follows_following_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_follows
    ADD CONSTRAINT profile_follows_following_id_profile_users_id_fk FOREIGN KEY (following_id) REFERENCES public.profile_users(id);


--
-- Name: profile_memes profile_memes_user_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_memes
    ADD CONSTRAINT profile_memes_user_id_profile_users_id_fk FOREIGN KEY (user_id) REFERENCES public.profile_users(id);


--
-- Name: profile_online_status profile_online_status_user_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_online_status
    ADD CONSTRAINT profile_online_status_user_id_profile_users_id_fk FOREIGN KEY (user_id) REFERENCES public.profile_users(id);


--
-- Name: profile_profile_views profile_profile_views_profile_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_profile_views
    ADD CONSTRAINT profile_profile_views_profile_id_profile_users_id_fk FOREIGN KEY (profile_id) REFERENCES public.profile_users(id);


--
-- Name: profile_profile_views profile_profile_views_viewer_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_profile_views
    ADD CONSTRAINT profile_profile_views_viewer_id_profile_users_id_fk FOREIGN KEY (viewer_id) REFERENCES public.profile_users(id);


--
-- Name: profile_reviews profile_reviews_user_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_reviews
    ADD CONSTRAINT profile_reviews_user_id_profile_users_id_fk FOREIGN KEY (user_id) REFERENCES public.profile_users(id);


--
-- Name: profile_tier_lists profile_tier_lists_user_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_tier_lists
    ADD CONSTRAINT profile_tier_lists_user_id_profile_users_id_fk FOREIGN KEY (user_id) REFERENCES public.profile_users(id);


--
-- Name: profile_user_profiles profile_user_profiles_user_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_user_profiles
    ADD CONSTRAINT profile_user_profiles_user_id_profile_users_id_fk FOREIGN KEY (user_id) REFERENCES public.profile_users(id);


--
-- Name: profile_watched_movies profile_watched_movies_user_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_watched_movies
    ADD CONSTRAINT profile_watched_movies_user_id_profile_users_id_fk FOREIGN KEY (user_id) REFERENCES public.profile_users(id);


--
-- Name: profile_watchlist profile_watchlist_user_id_profile_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.profile_watchlist
    ADD CONSTRAINT profile_watchlist_user_id_profile_users_id_fk FOREIGN KEY (user_id) REFERENCES public.profile_users(id);


--
-- Name: rumors rumors_hero_id_heroes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.rumors
    ADD CONSTRAINT rumors_hero_id_heroes_id_fk FOREIGN KEY (hero_id) REFERENCES public.heroes(id);


--
-- Name: rumors rumors_movie_id_movies_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.rumors
    ADD CONSTRAINT rumors_movie_id_movies_id_fk FOREIGN KEY (movie_id) REFERENCES public.movies(id);


--
-- Name: session session_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: tier_list_like tier_list_like_tierListId_tier_list_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.tier_list_like
    ADD CONSTRAINT "tier_list_like_tierListId_tier_list_id_fk" FOREIGN KEY ("tierListId") REFERENCES public.tier_list(id) ON DELETE CASCADE;


--
-- Name: tier_list_like tier_list_like_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.tier_list_like
    ADD CONSTRAINT "tier_list_like_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: tier_list tier_list_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.tier_list
    ADD CONSTRAINT "tier_list_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_follows user_follows_followerId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT "user_follows_followerId_user_id_fk" FOREIGN KEY ("followerId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_follows user_follows_followingId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT "user_follows_followingId_user_id_fk" FOREIGN KEY ("followingId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_profile user_profile_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: tfiverse
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT "user_profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict qWOxZtHHhqT8t1CS8N4BkUH5ZaAOqEvjp2R4fexnb32Cpo3bLW4khYUsDRi0Uy5

