/*
========================================================
TABLA: publicaciones_blog
========================================================
Almacena las publicaciones del artista (autor unico).
*/

CREATE TABLE publicaciones_blog (
    id SERIAL PRIMARY KEY,

    -- Título principal del artículo
    titulo VARCHAR(255) NOT NULL,

    -- Identificador URL-friendly único
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Resumen breve del contenido
    resumen TEXT,

    -- Contenido completo del artículo
    contenido TEXT,

    -- Imagen principal del artículo
    imagen_portada TEXT,

    -- Estado de la publicación
    -- Valores: borrador, publicado, archivado
    estado VARCHAR(50) DEFAULT 'borrador'
        CHECK (estado IN ('borrador', 'publicado', 'archivado')),

    -- Fecha de publicación
    publicado_en TIMESTAMP
);


/*
========================================================
TABLA: etiquetas
========================================================
Catálogo de etiquetas o categorías que pueden
asociarse a las publicaciones.
*/

CREATE TABLE etiquetas (
    id SERIAL PRIMARY KEY,

    -- Nombre único de la etiqueta
    nombre VARCHAR(100) UNIQUE NOT NULL
);


/*
========================================================
TABLA: publicaciones_etiquetas
========================================================
Tabla intermedia que implementa una relación
muchos a muchos entre publicaciones y etiquetas.

Relaciones:
- Una publicación puede tener varias etiquetas
- Una etiqueta puede pertenecer a varias publicaciones
*/

CREATE TABLE publicaciones_etiquetas (
    publicacion_id INT NOT NULL,
    etiqueta_id INT NOT NULL,

    -- Clave primaria compuesta
    PRIMARY KEY (publicacion_id, etiqueta_id),

    -- Relación con publicaciones
    CONSTRAINT fk_pub_etq_publicacion
        FOREIGN KEY (publicacion_id)
        REFERENCES publicaciones_blog(id)
        ON DELETE CASCADE,

    -- Relación con etiquetas
    CONSTRAINT fk_pub_etq_etiqueta
        FOREIGN KEY (etiqueta_id)
        REFERENCES etiquetas(id)
        ON DELETE CASCADE
);


/*
========================================================
ÍNDICES DE RENDIMIENTO
========================================================
Se crean índices para optimizar consultas frecuentes
sobre filtros y relaciones.
*/

CREATE INDEX idx_publicaciones_estado ON publicaciones_blog(estado);
CREATE INDEX idx_publicaciones_fecha ON publicaciones_blog(publicado_en);
CREATE INDEX idx_pub_etq_publicacion ON publicaciones_etiquetas(publicacion_id);
CREATE INDEX idx_pub_etq_etiqueta ON publicaciones_etiquetas(etiqueta_id);
