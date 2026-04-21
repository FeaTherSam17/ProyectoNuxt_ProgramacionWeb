-- Migration: single-author blog model (no autores table dependency)

-- Remove FK from publicaciones_blog to autores if present.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'publicaciones_blog'
      AND constraint_name = 'fk_publicaciones_autor'
  ) THEN
    ALTER TABLE publicaciones_blog DROP CONSTRAINT fk_publicaciones_autor;
  END IF;
END $$;

-- Remove autor_id column if present.
ALTER TABLE IF EXISTS publicaciones_blog
  DROP COLUMN IF EXISTS autor_id;

-- Drop legacy indexes that depend on autores/autor_id.
DROP INDEX IF EXISTS idx_publicaciones_autor_id;
DROP INDEX IF EXISTS idx_autores_correo;

-- Remove legacy trigger/function if they exist.
DROP TRIGGER IF EXISTS trigger_actualizar_autores ON autores;
DROP FUNCTION IF EXISTS actualizar_actualizado_en();

-- Optional cleanup: drop autores table if it exists and is no longer used.
DROP TABLE IF EXISTS autores CASCADE;
