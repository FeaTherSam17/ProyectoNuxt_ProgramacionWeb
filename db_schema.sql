/*
========================================================
TABLA: autores
========================================================
Almacena la información principal de los usuarios del sistema
que tienen rol de autor o administrador.

Incluye soporte para autenticación mediante proveedores
externos (OAuth), como Google u otros servicios similares.

Relaciones:
- Un autor puede tener un perfil (1:1 con perfiles_autor)
- Un autor puede tener muchas publicaciones (1:N con publicaciones_blog)
*/

CREATE TABLE autores (
    id SERIAL PRIMARY KEY,

    -- Correo electrónico único del autor
    correo VARCHAR(255) UNIQUE NOT NULL,

    -- Nombre completo del autor
    nombre VARCHAR(150) NOT NULL,

    -- URL opcional de imagen de perfil
    url_avatar TEXT,

    -- Rol del usuario dentro del sistema
    -- Valores permitidos: admin, autor
    rol VARCHAR(50) DEFAULT 'admin'
        CHECK (rol IN ('admin', 'autor')),

    -- Proveedor de autenticación (ej. google, github)
    proveedor VARCHAR(50) NOT NULL DEFAULT 'google',

    -- Identificador único del usuario en el proveedor OAuth
    proveedor_id TEXT NOT NULL,

    -- Fecha de creación del registro
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Fecha de última actualización del registro
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Garantiza unicidad del usuario por proveedor OAuth
    CONSTRAINT unique_proveedor UNIQUE (proveedor, proveedor_id)
);


/*
========================================================
TABLA: perfiles_autor
========================================================
Contiene información extendida del autor.
Funciona como una relación 1:1 con la tabla autores.

Permite almacenar datos opcionales de perfil público
y redes sociales.
*/

CREATE TABLE perfiles_autor (
    id SERIAL PRIMARY KEY,

    -- Relación directa con autores
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

    -- Relación con autores (eliminación en cascada)
    CONSTRAINT fk_perfiles_autor_autor
        FOREIGN KEY (autor_id)
        REFERENCES autores(id)
        ON DELETE CASCADE
);


/*
========================================================
TABLA: publicaciones_blog
========================================================
Almacena las publicaciones realizadas por los autores.

Relación:
- Un autor puede tener múltiples publicaciones (1:N)
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

    -- Autor que crea la publicación
    autor_id INT NOT NULL,

    -- Estado de la publicación
    -- Valores: borrador, publicado, archivado
    estado VARCHAR(50) DEFAULT 'borrador'
        CHECK (estado IN ('borrador', 'publicado', 'archivado')),

    -- Fecha de publicación
    publicado_en TIMESTAMP,

    -- Relación con autores
    CONSTRAINT fk_publicaciones_autor
        FOREIGN KEY (autor_id)
        REFERENCES autores(id)
        ON DELETE CASCADE
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

CREATE INDEX idx_autores_correo ON autores(correo);
CREATE INDEX idx_publicaciones_autor_id ON publicaciones_blog(autor_id);
CREATE INDEX idx_publicaciones_estado ON publicaciones_blog(estado);
CREATE INDEX idx_publicaciones_fecha ON publicaciones_blog(publicado_en);
CREATE INDEX idx_pub_etq_publicacion ON publicaciones_etiquetas(publicacion_id);
CREATE INDEX idx_pub_etq_etiqueta ON publicaciones_etiquetas(etiqueta_id);


/*
========================================================
TRIGGER: actualización automática de fecha
========================================================
Función que actualiza el campo actualizado_en
cada vez que se modifica un registro en la tabla autores.
*/

CREATE OR REPLACE FUNCTION actualizar_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
   NEW.actualizado_en = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;


/*
Trigger asociado a la tabla autores.
Se ejecuta antes de cada actualización.
*/

CREATE TRIGGER trigger_actualizar_autores
BEFORE UPDATE ON autores
FOR EACH ROW
EXECUTE FUNCTION actualizar_actualizado_en();