-- =========================
-- TABLA: autores
-- =========================
CREATE TABLE autores (
    id SERIAL PRIMARY KEY,

    correo VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    url_avatar TEXT,

    rol VARCHAR(50) DEFAULT 'admin'
        CHECK (rol IN ('admin', 'autor')),

    -- OAuth (Google u otros)
    proveedor VARCHAR(50) NOT NULL DEFAULT 'google',
    proveedor_id TEXT NOT NULL,

    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_proveedor UNIQUE (proveedor, proveedor_id)
);

-- =========================
-- TABLA: perfiles_autor
-- Relación 1:1 con autores
-- =========================
CREATE TABLE perfiles_autor (
    id SERIAL PRIMARY KEY,
    autor_id INT UNIQUE NOT NULL,

    nombre_mostrado VARCHAR(150),
    biografia TEXT,
    estilo_musical VARCHAR(100),
    telefono VARCHAR(50),
    correo_contacto VARCHAR(255),

    instagram VARCHAR(255),
    youtube VARCHAR(255),
    soundcloud VARCHAR(255),
    spotify VARCHAR(255),

    CONSTRAINT fk_perfiles_autor_autor
        FOREIGN KEY (autor_id)
        REFERENCES autores(id)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: publicaciones_blog
-- Relación 1:N con autores
-- =========================
CREATE TABLE publicaciones_blog (
    id SERIAL PRIMARY KEY,

    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    resumen TEXT,
    contenido TEXT,
    imagen_portada TEXT,

    autor_id INT NOT NULL,

    estado VARCHAR(50) DEFAULT 'borrador'
        CHECK (estado IN ('borrador', 'publicado', 'archivado')),

    publicado_en TIMESTAMP,

    CONSTRAINT fk_publicaciones_autor
        FOREIGN KEY (autor_id)
        REFERENCES autores(id)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: etiquetas (PRO)
-- =========================
CREATE TABLE etiquetas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- =========================
-- TABLA: publicaciones_etiquetas (N:M)
-- =========================
CREATE TABLE publicaciones_etiquetas (
    publicacion_id INT NOT NULL,
    etiqueta_id INT NOT NULL,

    PRIMARY KEY (publicacion_id, etiqueta_id),

    CONSTRAINT fk_pub_etq_publicacion
        FOREIGN KEY (publicacion_id)
        REFERENCES publicaciones_blog(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pub_etq_etiqueta
        FOREIGN KEY (etiqueta_id)
        REFERENCES etiquetas(id)
        ON DELETE CASCADE
);

-- =========================
-- ÍNDICES (RENDIMIENTO)
-- =========================
CREATE INDEX idx_autores_correo ON autores(correo);
CREATE INDEX idx_publicaciones_autor_id ON publicaciones_blog(autor_id);
CREATE INDEX idx_publicaciones_estado ON publicaciones_blog(estado);
CREATE INDEX idx_publicaciones_fecha ON publicaciones_blog(publicado_en);
CREATE INDEX idx_pub_etq_publicacion ON publicaciones_etiquetas(publicacion_id);
CREATE INDEX idx_pub_etq_etiqueta ON publicaciones_etiquetas(etiqueta_id);

-- =========================
-- TRIGGER: actualizar actualizado_en automáticamente
-- =========================
CREATE OR REPLACE FUNCTION actualizar_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
   NEW.actualizado_en = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_autores
BEFORE UPDATE ON autores
FOR EACH ROW
EXECUTE FUNCTION actualizar_actualizado_en();