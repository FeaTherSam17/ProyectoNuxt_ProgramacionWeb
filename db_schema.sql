/*
========================================================
TABLA: publicaciones_blog
========================================================
Guarda los artículos del blog.
*/

CREATE TABLE publicaciones_blog (
    id SERIAL PRIMARY KEY,

    -- Título del post
    titulo VARCHAR(255) NOT NULL,

    -- URL única para el post
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Texto corto de resumen
    resumen TEXT,

    -- Contenido completo
    contenido TEXT,

    -- Imagen principal del post
    imagen_portada TEXT,

    -- Estado actual del post
    estado VARCHAR(50) NOT NULL DEFAULT 'borrador'
        CHECK (estado IN ('borrador', 'publicado', 'archivado')),

    -- Fecha de publicación
    publicado_en TIMESTAMP,

    -- Fecha de creación
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/*
========================================================
TABLA: etiquetas
========================================================
Lista de etiquetas para organizar posts.
*/

CREATE TABLE etiquetas (
    id SERIAL PRIMARY KEY,

    -- Nombre de la etiqueta (único)
    nombre VARCHAR(100) UNIQUE NOT NULL
);


/*
========================================================
TABLA: publicaciones_etiquetas
========================================================
Relaciona posts con sus etiquetas.
*/

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


/*
========================================================
TABLA: mensajes_contacto
========================================================
Mensajes que envían los usuarios.
*/

CREATE TABLE mensajes_contacto (
    id SERIAL PRIMARY KEY,

    -- Nombre de quien escribe
    nombre VARCHAR(150) NOT NULL,

    -- Email de contacto
    correo VARCHAR(255) NOT NULL,

    -- Tema del mensaje
    asunto VARCHAR(255) NOT NULL,

    -- Contenido
    mensaje TEXT NOT NULL,

    -- Estado del mensaje
    estado VARCHAR(50) NOT NULL DEFAULT 'nuevo'
        CHECK (estado IN ('nuevo', 'leido', 'respondido')),

    -- Cuándo se creó
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/*
========================================================
ÍNDICES
========================================================
Para consultas más rápidas.
*/

CREATE INDEX idx_publicaciones_estado 
    ON publicaciones_blog(estado);

CREATE INDEX idx_publicaciones_fecha 
    ON publicaciones_blog(publicado_en);

CREATE INDEX idx_pub_etq_publicacion 
    ON publicaciones_etiquetas(publicacion_id);

CREATE INDEX idx_pub_etq_etiqueta 
    ON publicaciones_etiquetas(etiqueta_id);