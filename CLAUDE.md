# Recipe Site JSON Data Migration Plan

## Overview
Migrating from static recipe data in TypeScript files to JSON file storage with admin UI for recipe management. This approach works perfectly with Vercel and other static hosting platforms.

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
- [x] Update `src/components/types.ts` with new Recipe interface
- [x] Remove `difficulty` field from interface
- [x] Add `dateAdded` and `tryThis` fields
- [x] Make appropriate fields optional

### 2. JSON Data Setup
- [x] Create `public/recipes.json` with recipe data
- [x] Move recipes to JSON format
- [x] Ensure JSON is accessible in production

### 3. Recipe Service Layer
- [x] Create `src/lib/recipeService.ts` with operations:
  - `getAllRecipes()` - fetch from JSON
  - `getRecipeById(id)` - find in JSON
  - `saveRecipes(recipes)` - for admin updates
- [x] Add data validation and sanitization
- [x] Handle JSON loading and error states

### 4. Component Updates
- [x] Update `App.tsx` to fetch from JSON instead of static data
- [x] Update all components that reference `mockRecipes`
- [x] Remove difficulty displays from:
  - [x] `RecipeCard.tsx`
  - [x] `RecipeDetail.tsx`
  - [x] Any other components showing difficulty
- [x] Add support for new `tryThis` field in `RecipeDetail.tsx`

### 5. Data Migration
- [x] Convert existing recipes to new schema
- [x] Add `dateAdded` to existing recipes (use current date)
- [x] Remove `difficulty` from all existing recipes
- [x] Save migrated data to `public/recipes.json`

### 6. Admin UI
- [ ] Create admin route (`/admin`) with passcode protection
- [ ] Add environment variable for admin passcode
- [ ] Create forms for:
  - [ ] Adding new recipes
  - [ ] Editing existing recipes
  - [ ] Deleting recipes
- [ ] Add validation and error handling
- [ ] Include support for `tryThis` field (dynamic array input)
- [ ] Create API endpoint to save JSON (development only)

### 7. Development Setup
- [ ] Add development-only API route for saving JSON
- [ ] Ensure JSON updates work locally
- [ ] For production: manual JSON updates or GitHub-based workflow
- [ ] Document deployment process

### 8. Testing Implementation
- [ ] Set up testing framework (Vitest + React Testing Library)
- [ ] Configure test environment for JSON data loading
- [ ] Write unit tests for recipeService.ts
- [ ] Write component tests for recipe display components
- [ ] Write integration tests for recipe filtering/searching
- [ ] Write admin UI tests (form validation, CRUD operations)
- [ ] Set up end-to-end tests with Playwright (optional)
- [ ] Configure CI/CD testing pipeline

### 9. Validation & Manual Testing
- [ ] Test all existing functionality still works
- [ ] Test recipe viewing, filtering, searching
- [ ] Test admin functionality locally
- [ ] Verify JSON loading performance
- [ ] Test with both existing and new recipe data
- [ ] Test deployment on Vercel

## File Changes Required

### New Files
- `public/recipes.json` - Recipe data storage
- `src/lib/recipeService.ts` - JSON data operations
- `src/components/admin/` - Admin UI components
- `src/components/admin/AdminLogin.tsx`
- `src/components/admin/RecipeForm.tsx`
- `src/components/admin/RecipeManager.tsx`
- `api/update-recipes.js` - Development API for JSON updates
- `src/test/` - Test files directory
- `src/test/recipeService.test.ts` - Service layer tests
- `src/test/components/` - Component test files
- `src/test/fixtures/` - Test data fixtures
- `vitest.config.ts` - Test configuration
- `src/test/setup.ts` - Test environment setup

### Modified Files
- `src/components/types.ts` - Updated Recipe interface
- `src/components/recipe-data.ts` - Remove after migration (KEEP for now as backup)
- `src/App.tsx` - Fetch from JSON
- `src/components/RecipeCard.tsx` - Remove difficulty
- `src/components/RecipeDetail.tsx` - Remove difficulty, add tryThis
- `src/components/RecipesView.tsx` - Use recipe service
- `vite.config.ts` - Add API route for development
- `.env` - Add admin passcode
- `package.json` - Add testing dependencies and scripts

### Environment Variables Needed
```
VITE_ADMIN_PASSCODE=your_secure_passcode_here
```

## Considerations

1. **JSON Location**: Store in `public/recipes.json` for easy access
2. **Performance**: JSON loads once, then cached in memory
3. **Backup**: Version control handles JSON backup
4. **Deployment**: JSON deploys with the site automatically
5. **Data Validation**: Strict validation on recipe input to maintain data quality
6. **Production Updates**: Can update via GitHub commit or admin export feature

## Rollback Plan
- Keep original `recipe-data.ts` as backup
- Can quickly revert components to use static data if needed
- JSON format is simple to manually edit if needed

## Testing Strategy

### Unit Tests
**Recipe Service (`recipeService.ts`)**:
- ✅ `loadRecipes()` - JSON fetching and parsing
- ✅ `getAllRecipes()` - Caching behavior
- ✅ `getRecipeById()` - Finding recipes by ID
- ✅ `addRecipe()` - ID generation, dateAdded auto-assignment
- ✅ `updateRecipe()` - Partial updates, validation
- ✅ `deleteRecipe()` - Recipe removal, not found handling

**Utility Functions**:
- ✅ Recipe validation helpers
- ✅ Date formatting utilities
- ✅ Search/filter logic

### Component Tests
**RecipeCard.tsx**:
- ✅ Renders recipe data correctly
- ✅ Handles optional fields (prepTime, cookTime, servings, tags)
- ✅ Displays ingredient matching indicators
- ✅ Click handler triggers correctly

**RecipeDetail.tsx**:
- ✅ Displays all recipe information
- ✅ Shows/hides optional sections (tryThis, timing, category)
- ✅ Step completion toggle functionality
- ✅ Pantry/shopping list interactions

**RecipesView.tsx**:
- ✅ Loads and displays recipes from service
- ✅ Search functionality (title, description, ingredients)
- ✅ Tag filtering
- ✅ Loading and error states

**Admin Components**:
- ✅ Form validation (required fields, data types)
- ✅ Dynamic array inputs (ingredients, instructions, tryThis)
- ✅ CRUD operations through service
- ✅ Passcode protection

### Integration Tests
- ✅ Recipe filtering + search combination
- ✅ Pantry ingredients → recipe matching
- ✅ Admin recipe creation → display in main app
- ✅ JSON updates → UI refresh

### Test Data Strategy
**Fixtures** (`src/test/fixtures/`):
- `testRecipes.json` - Sample recipe data for tests
- `invalidRecipes.json` - Malformed data for error testing
- `emptyRecipes.json` - Empty state testing

**Mock Strategy**:
- Mock `fetch` for JSON loading tests
- Mock local storage for admin session tests
- Mock file system APIs for development-only save operations

### Testing Dependencies
```json
{
  "devDependencies": {
    "vitest": "^2.1.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/user-event": "^14.5.0",
    "jsdom": "^25.0.0",
    "msw": "^2.6.0"
  }
}
```

### Test Commands
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

### CI/CD Testing
- ✅ Run tests on pull requests
- ✅ Require test coverage > 80%
- ✅ Run tests on multiple Node.js versions
- ✅ Integration with Vercel deployments

## Post-Implementation
- [ ] Update README with new setup instructions
- [ ] Document admin usage
- [ ] Set up automated testing in CI/CD
- [ ] Achieve >80% test coverage
- [ ] Consider adding recipe import/export functionality
- [ ] Plan for future features (ratings, comments, etc.)