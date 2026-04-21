-- =========================
-- TABLA: autor
-- =========================
CREATE TABLE autor (
    id SERIAL PRIMARY KEY,

    email VARCHAR(255) UNIQUE NOT NULL,

    name VARCHAR(150) NOT NULL,
    avatar_url TEXT,

    role VARCHAR(50) DEFAULT 'admin',

    -- OAuth (Google)
    provider VARCHAR(50) NOT NULL DEFAULT 'google',
    provider_id TEXT UNIQUE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA: author_profile
-- Relación 1:1 con autor
-- =========================
CREATE TABLE author_profile (
    id SERIAL PRIMARY KEY,
    author_id INT UNIQUE NOT NULL,
    display_name VARCHAR(150),
    bio TEXT,
    music_style VARCHAR(100),
    phone VARCHAR(50),
    email_contact VARCHAR(255),
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    soundcloud VARCHAR(255),
    spotify VARCHAR(255),

    CONSTRAINT fk_author_profile_author
        FOREIGN KEY (author_id)
        REFERENCES autor(id)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: blog_posts
-- Relación 1:N con autor
-- =========================
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    author_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    published_at TIMESTAMP,

    CONSTRAINT fk_blog_posts_author
        FOREIGN KEY (author_id)
        REFERENCES autor(id)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: blog_post_tags
-- Relación N:1 con blog_posts
-- =========================
CREATE TABLE blog_post_tags (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    tag VARCHAR(100) NOT NULL,

    CONSTRAINT fk_blog_post_tags_post
        FOREIGN KEY (post_id)
        REFERENCES blog_posts(id)
        ON DELETE CASCADE
);

---===
---atucilizar campo
--==
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_autor_updated_at
BEFORE UPDATE ON autor
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();