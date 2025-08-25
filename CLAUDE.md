# Recipe Site Database Migration Plan

## Overview
Migrating from static recipe data in TypeScript files to SQLite database with admin UI for recipe management.

## New Recipe Schema

### Required Fields
- `id` (string) - Auto-generated UUID
- `title` (string) - Recipe name
- `description` (string) - Brief description
- `image` (string) - Image URL (defaults to placeholder)
- `ingredients` (Ingredient[]) - List of ingredients
- `instructions` (string[]) - Step-by-step instructions
- `dateAdded` (string) - Auto-generated ISO date string

### Optional Fields
- `prepTime` (number) - Prep time in minutes
- `cookTime` (number) - Cook time in minutes
- `servings` (number) - Number of servings
- `category` (string) - Recipe category
- `tags` (string[]) - Array of tags
- `tryThis` (string[]) - Tips, variations, substitutions

### Ingredient Schema
- `amount` (string) - Required
- `unit` (string) - Optional (cups, tbsp, etc.)
- `item` (string) - Required
- `notes` (string) - Optional

## Implementation Steps

### 1. Schema & Types Update
- [ ] Update `src/components/types.ts` with new Recipe interface
- [ ] Remove `difficulty` field from interface
- [ ] Add `dateAdded` and `tryThis` fields
- [ ] Make appropriate fields optional

### 2. Database Setup
- [ ] Add SQLite dependencies (`better-sqlite3`, `@types/better-sqlite3`)
- [ ] Create `src/lib/database.ts` with SQLite setup
- [ ] Create database schema with recipes table
- [ ] Add database initialization function

### 3. Database Service Layer
- [ ] Create `src/lib/recipeService.ts` with CRUD operations:
  - `getAllRecipes()`
  - `getRecipeById(id)`
  - `createRecipe(recipe)`
  - `updateRecipe(id, recipe)`
  - `deleteRecipe(id)`
- [ ] Add data validation and sanitization
- [ ] Handle database connections properly

### 4. Component Updates
- [ ] Update `App.tsx` to use database service instead of static data
- [ ] Update all components that reference `mockRecipes`
- [ ] Remove difficulty displays from:
  - [ ] `RecipeCard.tsx`
  - [ ] `RecipeDetail.tsx`
  - [ ] Any other components showing difficulty
- [ ] Add support for new `tryThis` field in `RecipeDetail.tsx`

### 5. Data Migration
- [ ] Create migration script to convert existing recipes
- [ ] Add `dateAdded` to existing recipes (use current date or estimated dates)
- [ ] Remove `difficulty` from all existing recipes
- [ ] Import migrated data into SQLite database

### 6. Admin UI
- [ ] Create admin route (`/admin`) with passcode protection
- [ ] Add environment variable for admin passcode
- [ ] Create forms for:
  - [ ] Adding new recipes
  - [ ] Editing existing recipes
  - [ ] Deleting recipes
- [ ] Add validation and error handling
- [ ] Include support for `tryThis` field (dynamic array input)

### 7. Server Setup
- [ ] Update Vite config for SQLite compatibility
- [ ] Add API routes for database operations (if needed)
- [ ] Ensure database file is in appropriate location
- [ ] Add database to .gitignore

### 8. Testing & Validation
- [ ] Test all existing functionality still works
- [ ] Test recipe viewing, filtering, searching
- [ ] Test admin functionality
- [ ] Verify performance with database queries
- [ ] Test with both existing and new recipe data

## File Changes Required

### New Files
- `src/lib/database.ts` - SQLite setup and connection
- `src/lib/recipeService.ts` - Database CRUD operations
- `src/components/admin/` - Admin UI components
- `src/components/admin/AdminLogin.tsx`
- `src/components/admin/RecipeForm.tsx`
- `src/components/admin/RecipeManager.tsx`
- `migrate-recipes.js` - One-time migration script

### Modified Files
- `src/components/types.ts` - Updated Recipe interface
- `src/components/recipe-data.ts` - Remove or keep for migration only
- `src/App.tsx` - Use database service
- `src/components/RecipeCard.tsx` - Remove difficulty
- `src/components/RecipeDetail.tsx` - Remove difficulty, add tryThis
- `src/components/RecipesView.tsx` - Use database service
- `package.json` - Add SQLite dependencies
- `vite.config.ts` - SQLite compatibility
- `.env` - Add admin passcode

### Environment Variables Needed
```
VITE_ADMIN_PASSCODE=your_secure_passcode_here
```

## Considerations

1. **Database Location**: Store SQLite file in project root or data/ folder
2. **Performance**: Consider indexing on commonly queried fields
3. **Backup**: Document how to backup/restore the database file
4. **Deployment**: Ensure database file persists in deployment environment
5. **Data Validation**: Strict validation on recipe input to maintain data quality

## Rollback Plan
- Keep original `recipe-data.ts` as backup
- Can quickly revert components to use static data if needed
- Export function to dump database back to TypeScript format

## Post-Implementation
- [ ] Update README with new setup instructions
- [ ] Document admin usage
- [ ] Consider adding recipe import/export functionality
- [ ] Plan for future features (ratings, comments, etc.)