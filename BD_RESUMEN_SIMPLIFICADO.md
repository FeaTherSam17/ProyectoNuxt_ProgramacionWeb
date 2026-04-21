# 📊 Base de Datos - Portafolio (Versión Simplificada)

> **Versión minimalista y práctica** para un portafolio profesional

---

## 🎯 ¿Por qué esta versión simplificada?

- **7 tablas principales** en lugar de 17+
- **Solo campos esenciales** que realmente necesitas
- **JSON para datos flexibles** (métricas, tecnologías) en lugar de tablas adicionales
- **Fácil de mantener y escalar**

---

## 📋 Tablas Principales

### 1. **USERS** 👤
Para administrar acceso al panel de control

```
┌─────────────────────────────────┐
│ USERS                           │
├─────────────────────────────────┤
│ id (PK)                         │
│ email (ÚNICO)                   │
│ password_hash                   │
│ name                            │
│ role: 'admin' | 'editor'        │
│ avatar_url                      │
│ created_at, updated_at          │
└─────────────────────────────────┘
```

**¿Qué guarda?**
- Administradores del sitio
- Credenciales para el login
- Información del perfil

---

### 2. **BLOG_POSTS** 📝
Todos tus artículos de blog

```
┌─────────────────────────────────┐
│ BLOG_POSTS                      │
├─────────────────────────────────┤
│ id (PK)                         │
│ author_id (FK → Users)          │ ← Quién escribió
│ title                           │
│ slug (URL amigable)             │
│ excerpt (resumen)               │
│ content (HTML/Markdown)         │
│ cover_image (URL)               │
│ status: 'draft' | 'published'   │
│ published_at                    │
│ views_count                     │
│ created_at, updated_at          │
└─────────────────────────────────┘
```

**¿Qué guarda?**
- Todos tus artículos
- Borradores y publicados
- Contador de visualizaciones
- Metadata de SEO

---

### 3. **BLOG_POST_TAGS** 🏷️
Etiquetas/categorías para los posts

```
┌──────────────────────────────────┐
│ BLOG_POST_TAGS                   │
├──────────────────────────────────┤
│ id (PK)                          │
│ post_id (FK → BlogPosts)         │
│ tag (ej: 'React', 'Diseño')      │
│ created_at                       │
│ UNIQUE(post_id, tag)             │
└──────────────────────────────────┘
```

**¿Qué guarda?**
- Etiquetas de cada artículo
- Evita duplicados en el mismo post
- Permite filtrar por categoría

---

### 4. **PROJECTS** 🎨
Tus proyectos destacados del portafolio

```
┌─────────────────────────────────────┐
│ PROJECTS                            │
├─────────────────────────────────────┤
│ id (PK)                             │
│ title                               │
│ slug (URL amigable)                 │
│ description                         │
│ image (portada del proyecto)         │
│ url (link al proyecto vivo)          │
│ repository_url (GitHub/GitLab)       │
│ status: 'completed' | 'in-progress'  │
│ date (año o rango: '2024')           │
│ metrics_json (JSON)                 │ ← Estadísticas en JSON
│   → {"retention": "32%", ...}        │
│ tools_json (JSON)                   │ ← Tecnologías en JSON
│   → ["React", "Node.js", "Figma"]   │
│ created_at, updated_at              │
└─────────────────────────────────────┘
```

**¿Qué guarda?**
- Información de cada proyecto
- Links a demo y repositorio
- Métricas de impacto
- Tecnologías utilizadas

---

### 5. **CONTACT_MESSAGES** 💬
Mensajes del formulario de contacto

```
┌──────────────────────────────┐
│ CONTACT_MESSAGES             │
├──────────────────────────────┤
│ id (PK)                      │
│ name                         │
│ email                        │
│ phone_number                 │
│ subject                      │
│ message                      │
│ status: 'unread' | 'read'    │
│        | 'responded'         │
│ response (tu respuesta)      │
│ created_at                   │
│ responded_at                 │
└──────────────────────────────┘
```

**¿Qué guarda?**
- Solicitudes de contacto
- Estado del seguimiento
- Tu respuesta

---

### 6. **Comentarios** ⭐
Comentarios de clientes/colegas

```
┌─────────────────────────┐
│ Comentarios             │
├─────────────────────────┤
│ id (PK)                 │
│ quote                   │
│ author_name             │
│ author_position         │
│ author_image            │
│ rating (1-5 estrellas)  │
│ featured (TRUE/FALSE)   │
│ order_index (orden)     │
│ created_at              │
└─────────────────────────┘
```

**¿Qué guarda?**
- Testimonios de personas
- Puesto/rol del autor
- Foto del autor
- Visibilidad en homepage

---

### 7. **SITE_SETTINGS** ⚙️
Configuraciones globales del sitio

```
┌──────────────────────────┐
│ SITE_SETTINGS            │
├──────────────────────────┤
│ id (PK)                  │
│ key (ej: 'site_title')   │
│ value (ej: 'Mi Portfolio'│
└──────────────────────────┘
```

**¿Qué guarda?**
- Título del sitio
- Meta descripciones
- URLs de redes sociales
- Ajustes generales

---

## 🔗 Relaciones Entre Tablas

```
┌─────────────────────────────────────────────────────────┐
│                      USERS                              │
│                   (Administrador)                       │
└─────────────────────────────────────────────────────────┘
           │                               │
           │ (1 usuario escribe           │
           │  muchos posts)               │
           ▼                               │
┌─────────────────────────────────────────┐
│         BLOG_POSTS                      │──────┐
│      (Artículos del Blog)               │      │
└─────────────────────────────────────────┘      │
           │                                     │
           │ (1 post tiene muchas etiquetas)    │
           ▼                                     │
    ┌──────────────────┐                        │
    │ BLOG_POST_TAGS   │                        │
    │  (Etiquetas)     │                        │
    └──────────────────┘                        │
                                               │
┌──────────────────────────────────────────────┤
│           PROJECTS                           │
│        (Tus Proyectos)                       │
└──────────────────────────────────────────────┘
           │
           │ (un proyecto puede recibir
           │  muchos testimonios)
           ▼
    ┌──────────────────────────┐
    │     Comentarios          │
    │   (Recomendaciones)      │
    └──────────────────────────┘

┌──────────────────────────┐
│  CONTACT_MESSAGES        │
│   (Mensajes Contacto)    │
└──────────────────────────┘

┌──────────────────────────┐
│   SITE_SETTINGS          │
│     (Configuración)      │
└──────────────────────────┘
```

---

## 💾 Tipos de Datos Usados

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **INTEGER** | Números enteros | `5`, `123`, `0` |
| **TEXT** | Texto largo | Contenido de posts, descripciones |
| **STRING** | Texto corto | Nombres, emails, URLs |
| **DATETIME** | Fecha y hora | `2024-04-20 15:30:00` |
| **BOOLEAN** | Verdadero/Falso | `TRUE`, `FALSE` |
| **JSON** | Datos estructurados | `{"key": "value"}` |

---

## 🚀 Ejemplos de Uso

### Crear un post de blog
```sql
INSERT INTO blog_posts 
(title, slug, excerpt, content, author_id, status, published_at)
VALUES 
('Mi primer artículo', 'mi-primer-articulo', 
 'Resumen corto', 'Contenido completo...', 
 1, 'published', '2024-04-20');
```

### Agregar una etiqueta
```sql
INSERT INTO blog_post_tags (post_id, tag)
VALUES (1, 'React');
```

### Guardar un mensaje de contacto
```sql
INSERT INTO contact_messages 
(name, email, subject, message)
VALUES 
('Juan', 'juan@ejemplo.com', 'Colaboración', 
 'Me gustaría trabajar contigo...');
```

### Agregar un testimonial
```sql
INSERT INTO testimonials 
(quote, author_name, author_position, featured)
VALUES 
('Excelente profesional', 'María López', 'CEO en StartupX', TRUE);
```

---

## 📊 Índices (Búsquedas Rápidas)

Se agregaron índices en campos que se buscan frecuentemente:

- **Blog posts**: búsquedas por autor, estado, fecha, slug
- **Projects**: búsquedas por slug, estado
- **Contact messages**: búsquedas por email, estado, fecha
- **Testimonials**: búsquedas por featured (mostrados en homepage)

---

## ✨ Características de esta Base de Datos

✅ **Simple pero completa**
✅ **Escalable** (fácil agregar más tablas después)
✅ **Campos necesarios** sin exceso
✅ **JSON para flexibilidad** (métricas, tecnologías)
✅ **Auditoria** (created_at, updated_at en todo)
✅ **Integridad referencial** (FK entre tablas)
✅ **Búsquedas optimizadas** (índices)

---

## 🔒 Notas de Seguridad

⚠️ **Las contraseñas siempre hasheadas** (nunca texto plano)
⚠️ **Emails únicos** para evitar duplicados
⚠️ **Status controlados** (no valores libres) para integridad
⚠️ **Timestamps automáticos** para auditoría

---

## 📈 Si necesitas agregar después...

Si más adelante necesitas más funcionalidades, puedes agregar:

- **NEWSLETTER_SUBSCRIBERS** - Para boletín de correos
- **ANALYTICS** - Vistas y estadísticas del sitio
- **BLOG_COMMENTS** - Si permites comentarios públicos
- **SOCIAL_MEDIA** - Links a redes sociales

Pero por ahora, estas 7 tablas cubren todo lo esencial 🎯
