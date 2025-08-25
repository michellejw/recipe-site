import { useMemo, useState, useEffect } from 'react';
import { Search, X, ChefHat } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RecipeCard } from './RecipeCard';
import { recipeService } from '../lib/recipeService';
import { Recipe, Ingredient } from './types';

interface PantryViewProps {
  onRecipeSelect: (recipe: Recipe) => void;
  selectedIngredients: Ingredient[];
  setSelectedIngredients: (ingredients: Ingredient[] | ((prev: Ingredient[]) => Ingredient[])) => void;
  ingredientSearch: string;
  setIngredientSearch: (search: string) => void;
  shoppingList: Ingredient[];
  setShoppingList: (items: Ingredient[] | ((prev: Ingredient[]) => Ingredient[])) => void;
}

interface RecipeWithScore {
  recipe: Recipe;
  missingIngredients: number;
  totalIngredients: number;
  matchingIngredients: string[];
}

export function PantryView({ 
  onRecipeSelect, 
  selectedIngredients, 
  setSelectedIngredients, 
  ingredientSearch, 
  setIngredientSearch,
  shoppingList,
  setShoppingList
}: PantryViewProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Load recipes on mount
  useEffect(() => {
    recipeService.getAllRecipes().then(loadedRecipes => {
      setRecipes(loadedRecipes);
      setLoading(false);
    });
  }, []);

  // Extract all unique ingredient names from recipes for search suggestions
  const allIngredientNames = useMemo(() => {
    const ingredientNames = new Set<string>();
    
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        // Get the full item name, preserving specificity like "sea salt" vs "table salt"
        let itemName = ingredient.item.toLowerCase().trim();
        
        // Remove parenthetical content and notes
        itemName = itemName.replace(/\([^)]*\)/g, '').trim();
        
        // Clean up but preserve meaningful multi-word names
        if (itemName.length > 0) {
          ingredientNames.add(itemName);
          
          // Also add common base ingredients for searchability
          const words = itemName.split(/[\s,]+/).filter(word => word.length > 2);
          const coreIngredients = ['flour', 'sugar', 'salt', 'pepper', 'oil', 'butter', 'milk', 'cream', 'cheese',
            'eggs', 'egg', 'water', 'vinegar', 'wine', 'beer', 'stock', 'broth', 'honey',
            'garlic', 'onion', 'onions', 'ginger', 'lemon', 'lime', 'tomato', 'tomatoes',
            'potato', 'potatoes', 'carrot', 'carrots', 'celery', 'mushrooms', 'mushroom',
            'chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'pasta', 'rice', 'bread',
            'basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'cilantro', 'spinach', 'lettuce'];
          
          words.forEach(word => {
            if (coreIngredients.includes(word)) {
              ingredientNames.add(word);
            }
          });
        }
      });
    });
    
    return Array.from(ingredientNames).sort();
  }, [recipes]);

  // Filter ingredient names based on search
  const filteredIngredientNames = useMemo(() => {
    if (!ingredientSearch.trim()) return [];
    
    const searchLower = ingredientSearch.toLowerCase();
    return allIngredientNames
      .filter(name => 
        name.includes(searchLower) &&
        !selectedIngredients.some(selected => selected.item.toLowerCase() === name)
      )
      .slice(0, 8); // Limit to 8 suggestions
  }, [ingredientSearch, allIngredientNames, selectedIngredients]);

  // Find matching recipes and score them
  const matchingRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) return [];

    const recipesWithScores: RecipeWithScore[] = [];

    recipes.forEach(recipe => {
      const userIngredientNames = selectedIngredients.map(ing => ing.item.toLowerCase().trim());
      const matchingIngredients = userIngredientNames.filter(userIng => {
        return recipe.ingredients.some(recipeIng => {
          const recipeIngLower = recipeIng.item.toLowerCase().trim();
          
          // More flexible matching: check if either ingredient contains the other
          // or if they share significant words
          const recipeWords = recipeIngLower.split(/[\s,]+/).filter(w => w.length > 2);
          const userWords = userIng.split(/[\s,]+/).filter(w => w.length > 2);
          
          // Direct substring match
          if (recipeIngLower.includes(userIng) || userIng.includes(recipeIngLower)) {
            return true;
          }
          
          // Word-based matching for compound ingredients
          return recipeWords.some(recipeWord => 
            userWords.some(userWord => 
              recipeWord.includes(userWord) || userWord.includes(recipeWord)
            )
          );
        });
      });

      // Only include recipes where user has at least one ingredient
      if (matchingIngredients.length > 0) {
        const missingIngredients = recipe.ingredients.length - matchingIngredients.length;
        recipesWithScores.push({
          recipe,
          missingIngredients,
          totalIngredients: recipe.ingredients.length,
          matchingIngredients
        });
      }
    });

    // Sort by missing ingredients (ascending), then by total ingredients (ascending)
    return recipesWithScores.sort((a, b) => {
      if (a.missingIngredients !== b.missingIngredients) {
        return a.missingIngredients - b.missingIngredients;
      }
      return a.totalIngredients - b.totalIngredients;
    });
  }, [selectedIngredients, recipes]);

  const addIngredient = (ingredientName: string) => {
    // Check if already exists
    const exists = selectedIngredients.some(ing => ing.item.toLowerCase() === ingredientName.toLowerCase());
    if (!exists) {
      // Create a simple ingredient object for pantry (no quantity needed for general pantry items)
      const newIngredient: Ingredient = {
        amount: '',
        item: ingredientName
      };
      setSelectedIngredients(prev => [...prev, newIngredient]);
      setIngredientSearch('');
    }
  };

  const removeIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients(prev => prev.filter(ing => 
      ing.item.toLowerCase() !== ingredient.item.toLowerCase()
    ));
  };

  const handleAddToPantry = (ingredient: Ingredient) => {
    const exists = selectedIngredients.some(existing => 
      existing.item.toLowerCase() === ingredient.item.toLowerCase()
    );
    if (!exists) {
      setSelectedIngredients(prev => [...prev, ingredient]);
    }
  };

  const handleRemoveFromPantry = (ingredient: Ingredient) => {
    setSelectedIngredients(prev => prev.filter(existing => {
      const existingLower = existing.item.toLowerCase();
      const ingredientLower = ingredient.item.toLowerCase();
      
      // Use same matching logic as elsewhere for consistency
      const ingredientWords = ingredientLower.split(/[\s,]+/).filter(w => w.length > 2);
      const existingWords = existingLower.split(/[\s,]+/).filter(w => w.length > 2);
      
      // Direct match
      if (existingLower === ingredientLower) {
        return false; // Remove this item
      }
      
      // Substring match
      if (existingLower.includes(ingredientLower) || ingredientLower.includes(existingLower)) {
        return false; // Remove this item
      }
      
      // Word-based matching
      const hasMatch = ingredientWords.some(ingredientWord => 
        existingWords.some(existingWord => 
          ingredientWord.includes(existingWord) || existingWord.includes(ingredientWord)
        )
      );
      
      return !hasMatch; // Keep items that don't match
    }));
  };

  const handleAddToShoppingList = (ingredient: Ingredient) => {
    const exists = shoppingList.some(item => 
      item.item.toLowerCase() === ingredient.item.toLowerCase()
    );
    if (!exists) {
      // Create simplified ingredient without quantities for shopping list
      const shoppingListItem: Ingredient = {
        amount: '',
        unit: '',
        item: ingredient.item,
        notes: ingredient.notes
      };
      setShoppingList(prev => [...prev, shoppingListItem]);
    }
  };

  const handleRemoveFromShoppingList = (ingredient: Ingredient) => {
    setShoppingList(prev => prev.filter(item => 
      item.item.toLowerCase() !== ingredient.item.toLowerCase()
    ));
  };

  return (
    <div className="space-y-6">
      {/* Ingredient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            What's in your pantry?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search ingredients (e.g., sea salt, olive oil, garlic)..."
              value={ingredientSearch}
              onChange={(e) => setIngredientSearch(e.target.value)}
              className="pl-10"
            />
            
            {/* Suggestions */}
            {filteredIngredientNames.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredIngredientNames.map((ingredientName) => (
                  <button
                    key={ingredientName}
                    className="w-full px-3 py-2 text-left hover:bg-accent transition-colors capitalize"
                    onClick={() => addIngredient(ingredientName)}
                  >
                    {ingredientName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Ingredients */}
          {selectedIngredients.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Your ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ingredient, index) => (
                  <Badge
                    key={`${ingredient.item}-${index}`}
                    variant="default"
                    className="pr-1 capitalize"
                  >
                    {ingredient.item}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-2 hover:bg-transparent"
                      onClick={() => removeIngredient(ingredient)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recipe Results */}
      {selectedIngredients.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2>Recipes you can make</h2>
            <span className="text-sm text-muted-foreground">
              {matchingRecipes.length} recipe{matchingRecipes.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          {matchingRecipes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No recipes found with your current ingredients. Try adding more ingredients to your pantry.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {matchingRecipes.map(({ recipe, missingIngredients, matchingIngredients }) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => onRecipeSelect(recipe)}
                  matchingIngredients={matchingIngredients}
                  missingIngredients={missingIngredients}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {selectedIngredients.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3>Start adding ingredients</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Search and select the ingredients you have at home. We'll show you recipes you can make with what you've got!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}