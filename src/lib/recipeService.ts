import { Recipe } from '../components/types';

class RecipeService {
  private recipes: Recipe[] = [];
  private loaded = false;

  async loadRecipes(): Promise<Recipe[]> {
    if (this.loaded) {
      return this.recipes;
    }

    try {
      const response = await fetch('/recipes.json');
      if (!response.ok) {
        throw new Error(`Failed to load recipes: ${response.statusText}`);
      }
      this.recipes = await response.json();
      this.loaded = true;
      return this.recipes;
    } catch (error) {
      console.error('Error loading recipes:', error);
      // Return empty array on error to prevent app crash
      return [];
    }
  }

  async getAllRecipes(): Promise<Recipe[]> {
    if (!this.loaded) {
      await this.loadRecipes();
    }
    return this.recipes;
  }

  async getRecipeById(id: string): Promise<Recipe | undefined> {
    const recipes = await this.getAllRecipes();
    return recipes.find(recipe => recipe.id === id);
  }

  // For future admin functionality
  async saveRecipes(recipes: Recipe[]): Promise<boolean> {
    try {
      // In development, this would make an API call to save the JSON
      // For now, just update the in-memory cache
      this.recipes = recipes;
      
      // In production, you'd update via GitHub or manual deployment
      if (import.meta.env.DEV) {
        // Development-only save endpoint
        const response = await fetch('/api/save-recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipes),
        });
        return response.ok;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving recipes:', error);
      return false;
    }
  }

  // Helper methods for admin UI
  async addRecipe(recipe: Omit<Recipe, 'id' | 'dateAdded'>): Promise<Recipe> {
    const newRecipe: Recipe = {
      ...recipe,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
    };
    
    const recipes = await this.getAllRecipes();
    recipes.push(newRecipe);
    await this.saveRecipes(recipes);
    
    return newRecipe;
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<boolean> {
    const recipes = await this.getAllRecipes();
    const index = recipes.findIndex(r => r.id === id);
    
    if (index === -1) {
      return false;
    }
    
    recipes[index] = { ...recipes[index], ...updates };
    return await this.saveRecipes(recipes);
  }

  async deleteRecipe(id: string): Promise<boolean> {
    const recipes = await this.getAllRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    
    if (filtered.length === recipes.length) {
      return false; // Recipe not found
    }
    
    return await this.saveRecipes(filtered);
  }
}

// Export singleton instance
export const recipeService = new RecipeService();