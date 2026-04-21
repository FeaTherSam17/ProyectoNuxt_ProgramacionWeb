/*
========================================================
TABLA: perfil_autor
========================================================
Contiene información extendida del autor.
Funciona como una relación 1:1 con la tabla autores.

Permite almacenar datos opcionales de perfil público
y redes sociales.
*/

CREATE TABLE perfil_autor (
    id SERIAL PRIMARY KEY,

    -- Relación 1:1 con autores
    autor_id INT UNIQUE NOT NULL,

    -- Nombre público o artístico del autor
    nombre_mostrado VARCHAR(150),

    -- Biografía del autor
    biografia TEXT,

    -- Estilo musical o categoría artística
    estilo_musical VARCHAR(100),

    -- Teléfono de contacto
    telefono VARCHAR(50),

    -- Correo de contacto alternativo
    correo_contacto VARCHAR(255),

    -- Redes sociales del autor
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    soundcloud VARCHAR(255),
    spotify VARCHAR(255),

    CONSTRAINT fk_perfil_autor_autor
        FOREIGN KEY (autor_id)
        REFERENCES autores(id)
        ON DELETE CASCADE
);


/*
========================================================
TABLA: publicaciones_blog
========================================================
Almacena las publicaciones creadas por los autores.

Relación:
- Un autor puede tener múltiples publicaciones (1:N)
*/

CREATE TABLE publicaciones_blog (
    id SERIAL PRIMARY KEY,

    -- Autor que crea la publicación
    autor_id INT NOT NULL,

    -- Título del artículo
    titulo VARCHAR(255) NOT NULL,

    -- URL amigable única
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Resumen del contenido
    resumen TEXT,

    -- Contenido completo del artículo
    contenido TEXT,

    -- Imagen principal
    imagen_portada TEXT,

    -- Estado de publicación
    -- borrador | publicado | archivado
    estado VARCHAR(50) DEFAULT 'borrador'
        CHECK (estado IN ('borrador', 'publicado', 'archivado')),

    -- Fecha de publicación
    publicado_en TIMESTAMP,

    CONSTRAINT fk_publicaciones_autor
        FOREIGN KEY (autor_id)
        REFERENCES autores(id)
        ON DELETE CASCADE
);


/*
========================================================
TABLA: etiquetas
========================================================
Catálogo de etiquetas para clasificar publicaciones.
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
Tabla intermedia para relación muchos a muchos
entre publicaciones y etiquetas.
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
Almacena mensajes enviados por usuarios al sistema.
Permite gestionar consultas o solicitudes de contacto.
*/

CREATE TABLE mensajes_contacto (
    id SERIAL PRIMARY KEY,

    -- Nombre del remitente
    nombre VARCHAR(150) NOT NULL,

    -- Correo del remitente
    correo VARCHAR(255) NOT NULL,

    -- Asunto del mensaje
    asunto VARCHAR(255) NOT NULL,

    -- Contenido del mensaje
    mensaje TEXT NOT NULL,

    -- Estado del mensaje
    -- nuevo | leído | respondido
    estado VARCHAR(50) DEFAULT 'nuevo',

    -- Fecha de creación
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



/*
========================================================
ÍNDICES DE RENDIMIENTO
========================================================
Optimización de consultas frecuentes del sistema.
*/

CREATE INDEX idx_publicaciones_estado ON publicaciones_blog(estado);

CREATE INDEX idx_publicaciones_fecha ON publicaciones_blog(publicado_en);

CREATE INDEX idx_pub_etq_publicacion ON publicaciones_etiquetas(publicacion_id);

CREATE INDEX idx_pub_etq_etiqueta ON publicaciones_etiquetas(etiqueta_id);

CREATE INDEX idx_publicaciones_autor ON publicaciones_blog(autor_id);

CREATE INDEX idx_perfil_autor ON perfil_autor(autor_id);