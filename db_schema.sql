-- ============================================================================
-- ESQUEMA DE BASE DE DATOS - PORTAFOLIO NUXT
-- Versión simplificada y optimizada para portafolio personal
-- ============================================================================

-- ============================================================================
-- 1. USUARIOS - Para autenticación y control de acceso
-- ============================================================================
-- Propósito: Gestionar administradores del sitio
-- Campos: Identificación única, credenciales y metadatos
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,           -- Contraseña hasheada (nunca texto plano)
  name TEXT NOT NULL,                    -- Nombre del usuario
  role TEXT NOT NULL DEFAULT 'editor',   -- Roles: 'admin', 'editor' (controla permisos)
  avatar_url TEXT,                       -- URL de la foto de perfil
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. ARTÍCULOS DE BLOG - Contenido principal del blog
-- ============================================================================
-- Propósito: Almacenar posts/artículos de blog
-- Campos: Metadatos, contenido y estado de publicación
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,                   -- Título del artículo
  slug TEXT NOT NULL UNIQUE,             -- URL amigable (ej: 'mi-primer-articulo')
  excerpt TEXT NOT NULL,                 -- Resumen corto del artículo
  content TEXT NOT NULL,                 -- Contenido completo en markdown
  cover_image TEXT,                      -- URL de la imagen portada
  author_id INTEGER NOT NULL,            -- Relación con usuario (quién lo escribió)
  status TEXT NOT NULL DEFAULT 'draft',  -- Estados: 'draft', 'published'
  published_at DATETIME,                 -- Fecha de publicación
  views_count INTEGER DEFAULT 0,         -- Cantidad de visualizaciones
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- 3. ETIQUETAS DE BLOG - Categorización de artículos
-- ============================================================================
-- Propósito: Etiquetar artículos para mejor organización y búsqueda
-- Campos: Relación artículo-etiqueta (relación muchos a muchos)
CREATE TABLE blog_post_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,              -- ID del artículo
  tag TEXT NOT NULL,                     -- Nombre de la etiqueta (ej: 'React', 'Diseño')
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  UNIQUE(post_id, tag)                   -- Evita etiquetas duplicadas en mismo post
);

-- ============================================================================
-- 4. PROYECTOS - Portafolio de proyectos realizados
-- ============================================================================
-- Propósito: Mostrar trabajos realizados con detalles completos
-- Campos: Información del proyecto y metadatos
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,                   -- Nombre del proyecto (ej: 'Bloom Finance')
  slug TEXT NOT NULL UNIQUE,             -- URL amigable
  description TEXT NOT NULL,             -- Descripción detallada del proyecto
  image TEXT,                            -- Imagen principal del proyecto
  url TEXT,                              -- Link al proyecto en vivo
  repository_url TEXT,                   -- Link al repositorio (GitHub, GitLab, etc)
  status TEXT NOT NULL DEFAULT 'completed', -- Estados: 'completed', 'in-progress', 'archived'
  date TEXT NOT NULL,                    -- Fecha de realización (ej: '2024')
  metrics_json TEXT,                     -- JSON con métricas (ej: {"retention": "32%", "users": 5000})
  tools_json TEXT,                       -- JSON con tecnologías usadas
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. MENSAJES DE CONTACTO - Formulario de contacto
-- ============================================================================
-- Propósito: Guardar mensajes de usuarios interesados en colaborar
-- Campos: Información del contacto y estado del mensaje
CREATE TABLE contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                    -- Nombre del remitente
  email TEXT NOT NULL,                   -- Email para responder
  subject TEXT NOT NULL,                 -- Asunto del mensaje
  message TEXT NOT NULL,                 -- Contenido del mensaje
  phone_number TEXT,                     -- Teléfono (opcional)
  status TEXT NOT NULL DEFAULT 'unread', -- Estados: 'unread', 'read', 'archived', 'responded'
  response TEXT,                         -- Respuesta del administrador
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME                  -- Fecha en que se respondió
);

-- ============================================================================
-- 6. TESTIMONIOS - Comentarios de clientes/colegas
-- ============================================================================
-- Propósito: Mostrar opiniones de personas que han trabajado contigo
-- Campos: Quote, autor y información de presentación
CREATE TABLE comentarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote TEXT NOT NULL,                   -- El testimonio/comentario
  author_name TEXT NOT NULL,             -- Nombre de quien da el testimonio
  author_position TEXT,                  -- Puesto/rol de la persona (ej: 'CTO en Google')
  author_image TEXT,                     -- Foto del autor
  rating INTEGER DEFAULT 5,              -- Calificación de 1-5 estrellas
  featured BOOLEAN DEFAULT FALSE,        -- Si se muestra en la homepage
  order_index INTEGER,                   -- Orden de visualización
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. CONFIGURACIÓN DEL SITIO - Ajustes generales
-- ============================================================================
-- Propósito: Almacenar configuraciones dinámicas del sitio
-- Campos: Pares clave-valor para settings
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,              -- Identificador del setting (ej: 'site_title')
  value TEXT NOT NULL                    -- Valor del setting
);

-- ============================================================================
-- ÍNDICES - Para optimizar búsquedas frecuentes
-- ============================================================================

-- Índices en blog_posts para búsquedas rápidas
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Índices en projects para búsquedas rápidas
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);

-- Índices en contact_messages para búsquedas rápidas
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);

-- Índices en testimonials
CREATE INDEX idx_testimonials_featured ON testimonials(featured);

-- ============================================================================
-- DATOS DE EJEMPLO - Inserciones iniciales (opcional)
-- ============================================================================

-- Ejemplo: Usuario administrador
-- INSERT INTO users (email, password_hash, name, role, avatar_url)
-- VALUES ('admin@ejemplo.com', '$2b$10$...', 'Emma Thompson', 'admin', 'https://...');

-- Ejemplo: Configuración del sitio
-- INSERT INTO site_settings (key, value) VALUES 
-- ('site_title', 'Emma Thompson - UX/UI Designer'),
-- ('site_description', 'Portfolio personal de diseño y desarrollo'),
-- ('site_url', 'https://emmathompson.com');
