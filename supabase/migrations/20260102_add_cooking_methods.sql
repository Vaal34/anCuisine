-- ============================================
-- Migration: Add cooking methods support to recipes
-- Date: 2026-01-02
-- Description: Adds a JSONB column to store multiple cooking methods per recipe
-- ============================================

-- Add cooking_methods column to recipes table
-- Using JSONB array for flexibility and performance
-- Default to ["four"] for backward compatibility with existing recipes
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS cooking_methods JSONB NOT NULL DEFAULT '["four"]'::jsonb;

-- Add a comment to document the column structure
COMMENT ON COLUMN recipes.cooking_methods IS
'Array of cooking method strings. Valid values: "four", "micro-onde", "air-fryer", "plaque", "casserole", "vapeur", "barbecue", "sans-cuisson"';

-- Create a GIN index for efficient querying of cooking methods
-- This allows fast searches like "find all recipes that use air-fryer"
CREATE INDEX IF NOT EXISTS recipes_cooking_methods_idx
ON recipes USING GIN (cooking_methods);

-- ============================================
-- Validation Function (Optional but recommended)
-- ============================================

-- Create a function to validate cooking methods
CREATE OR REPLACE FUNCTION validate_cooking_methods()
RETURNS TRIGGER AS $$
DECLARE
  valid_methods TEXT[] := ARRAY[
    'four',
    'micro-onde',
    'air-fryer',
    'plaque',
    'casserole',
    'vapeur',
    'barbecue',
    'sans-cuisson'
  ];
  method TEXT;
BEGIN
  -- Check if cooking_methods is an array
  IF jsonb_typeof(NEW.cooking_methods) != 'array' THEN
    RAISE EXCEPTION 'cooking_methods must be a JSON array';
  END IF;

  -- Validate each method in the array
  FOR method IN SELECT jsonb_array_elements_text(NEW.cooking_methods)
  LOOP
    IF NOT (method = ANY(valid_methods)) THEN
      RAISE EXCEPTION 'Invalid cooking method: %. Valid methods are: %',
        method, array_to_string(valid_methods, ', ');
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate cooking methods on insert/update
DROP TRIGGER IF EXISTS validate_cooking_methods_trigger ON recipes;
CREATE TRIGGER validate_cooking_methods_trigger
  BEFORE INSERT OR UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION validate_cooking_methods();

-- ============================================
-- Example queries for reference
-- ============================================

-- Find all recipes that use a specific cooking method:
-- SELECT * FROM recipes WHERE cooking_methods @> '["four"]'::jsonb;

-- Find recipes that use air-fryer OR micro-onde:
-- SELECT * FROM recipes WHERE cooking_methods ?| array['air-fryer', 'micro-onde'];

-- Find recipes that use both four AND vapeur:
-- SELECT * FROM recipes WHERE cooking_methods @> '["four", "vapeur"]'::jsonb;

-- Count recipes by cooking method:
-- SELECT method, COUNT(*)
-- FROM recipes, jsonb_array_elements_text(cooking_methods) as method
-- GROUP BY method
-- ORDER BY COUNT(*) DESC;

-- ============================================
-- Migration rollback (if needed)
-- ============================================

-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS validate_cooking_methods_trigger ON recipes;
-- DROP FUNCTION IF EXISTS validate_cooking_methods();
-- DROP INDEX IF EXISTS recipes_cooking_methods_idx;
-- ALTER TABLE recipes DROP COLUMN IF EXISTS cooking_methods;
