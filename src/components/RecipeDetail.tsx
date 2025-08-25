import { ArrowLeft, Clock, Users, ChefHat, CheckCircle2, Circle, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Recipe, Ingredient } from './types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useRef } from 'react';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  userIngredients: Ingredient[];
  onAddToPantry: (ingredient: Ingredient) => void;
  onRemoveFromPantry: (ingredient: Ingredient) => void;
  onAddToShoppingList: (ingredient: Ingredient) => void;
  onRemoveFromShoppingList: (ingredient: Ingredient) => void;
  shoppingList: Ingredient[];
}

export function RecipeDetail({ 
  recipe, 
  onBack, 
  userIngredients,
  onAddToPantry,
  onRemoveFromPantry,
  onAddToShoppingList,
  onRemoveFromShoppingList,
  shoppingList
}: RecipeDetailProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  // State for tracking animations
  const [animatingItems, setAnimatingItems] = useState<Record<string, 'pantry' | 'shopping' | null>>({});
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const triggerAnimation = (ingredientKey: string, type: 'pantry' | 'shopping') => {
    // Clear existing timeout if any
    if (timeoutRefs.current[ingredientKey]) {
      clearTimeout(timeoutRefs.current[ingredientKey]);
    }

    // Set animation state
    setAnimatingItems(prev => ({ ...prev, [ingredientKey]: type }));

    // Reset after animation duration
    timeoutRefs.current[ingredientKey] = setTimeout(() => {
      setAnimatingItems(prev => ({ ...prev, [ingredientKey]: null }));
      delete timeoutRefs.current[ingredientKey];
    }, 600); // 600ms total animation time
  };

  // Check if user has an ingredient
  const hasIngredient = (ingredient: Ingredient): boolean => {
    return userIngredients.some(userIng => {
      const userIngLower = userIng.item.toLowerCase().trim();
      const ingredientLower = ingredient.item.toLowerCase().trim();
      
      // Use same matching logic as in PantryView
      const recipeWords = ingredientLower.split(/[\s,]+/).filter(w => w.length > 2);
      const userWords = userIngLower.split(/[\s,]+/).filter(w => w.length > 2);
      
      // Direct substring match
      if (ingredientLower.includes(userIngLower) || userIngLower.includes(ingredientLower)) {
        return true;
      }
      
      // Word-based matching for compound ingredients
      return recipeWords.some(recipeWord => 
        userWords.some(userWord => 
          recipeWord.includes(userWord) || userWord.includes(recipeWord)
        )
      );
    });
  };

  // Check if an ingredient is on the shopping list
  const isOnShoppingList = (ingredient: Ingredient): boolean => {
    return shoppingList.some(item => 
      item.item.toLowerCase().trim() === ingredient.item.toLowerCase().trim()
    );
  };

  const handleTogglePantry = (ingredient: Ingredient) => {
    const currentlyHas = hasIngredient(ingredient);
    const currentlyOnShoppingList = isOnShoppingList(ingredient);
    
    triggerAnimation(ingredient.item, 'pantry');
    
    if (currentlyHas) {
      onRemoveFromPantry(ingredient);
    } else {
      onAddToPantry(ingredient);
      // If the ingredient was on the shopping list, remove it since we now have it
      if (currentlyOnShoppingList) {
        onRemoveFromShoppingList(ingredient);
      }
    }
  };

  const handleToggleShoppingList = (ingredient: Ingredient) => {
    const currentlyOnList = isOnShoppingList(ingredient);
    
    triggerAnimation(ingredient.item, 'shopping');
    
    if (currentlyOnList) {
      onRemoveFromShoppingList(ingredient);
    } else {
      // Create simplified ingredient without quantities for shopping list
      const shoppingListItem: Ingredient = {
        amount: '',
        unit: '',
        item: ingredient.item,
        notes: ingredient.notes
      };
      onAddToShoppingList(shoppingListItem);
    }
  };

  const formatIngredient = (ingredient: Ingredient): string => {
    const parts = [];
    if (ingredient.amount) parts.push(ingredient.amount);
    if (ingredient.unit) parts.push(ingredient.unit);
    parts.push(ingredient.item);
    return parts.join(' ');
  };

  // Count ingredients by status
  const ingredientCounts = recipe.ingredients.reduce((acc, ingredient) => {
    if (hasIngredient(ingredient)) {
      acc.have++;
    } else {
      acc.need++;
    }
    return acc;
  }, { have: 0, need: 0 });
  
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Recipe Header */}
      <Card>
        <div className="aspect-[16/9] sm:aspect-[3/1] relative overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.title}
            recipeTitle={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl">{recipe.title}</h1>
              <p className="text-muted-foreground">{recipe.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              {recipe.prepTime !== undefined && recipe.prepTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Prep: {recipe.prepTime}m</span>
                </div>
              )}
              {recipe.cookTime !== undefined && recipe.cookTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Cook: {recipe.cookTime}m</span>
                </div>
              )}
              {totalTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Total: {totalTime}m</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Serves {recipe.servings}</span>
                </div>
              )}
              {recipe.category && (
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-primary" />
                  <span>{recipe.category}</span>
                </div>
              )}
            </div>
            
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Ingredients */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Ingredients
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{ingredientCounts.have} have</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>{ingredientCounts.need} need</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recipe.ingredients.map((ingredient, index) => {
              const animationType = animatingItems[ingredient.item];
              const userHasIt = hasIngredient(ingredient);
              const onShoppingList = isOnShoppingList(ingredient);
              
              return (
                <div 
                  key={`${recipe.id}-${ingredient.item}-${index}`}
                  className={`p-3 rounded-md border-2 transition-all duration-300 ease-in-out ${
                    animationType === 'pantry' 
                      ? 'bg-green-100 border-green-300' 
                      : animationType === 'shopping'
                      ? 'bg-orange-100 border-orange-300'
                      : userHasIt
                      ? 'bg-green-50 border-green-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Ingredient Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${userHasIt ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <span className="capitalize text-sm font-medium">
                          {formatIngredient(ingredient)}
                        </span>
                      </div>
                      {ingredient.notes && (
                        <div className="text-xs text-muted-foreground ml-4">
                          {ingredient.notes}
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant={userHasIt ? "default" : "outline"}
                        size="sm"
                        className={`text-xs transition-all duration-200 ${
                          userHasIt 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'border-green-600 text-green-600 hover:bg-green-50'
                        } ${
                          animationType === 'pantry' 
                            ? 'bg-green-500 text-white border-green-500' 
                            : ''
                        }`}
                        onClick={() => handleTogglePantry(ingredient)}
                      >
                        {userHasIt ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            In pantry
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Add to pantry
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant={onShoppingList ? "default" : "outline"}
                        size="sm"
                        disabled={userHasIt}
                        className={`text-xs transition-all duration-200 ${
                          onShoppingList 
                            ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                            : userHasIt
                            ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400'
                            : 'border-orange-600 text-orange-600 hover:bg-orange-50'
                        } ${
                          animationType === 'shopping' 
                            ? 'bg-orange-500 text-white border-orange-500' 
                            : ''
                        }`}
                        onClick={() => !userHasIt && handleToggleShoppingList(ingredient)}
                      >
                        {onShoppingList ? (
                          <>
                            <Minus className="h-3 w-3 mr-1" />
                            Remove from list
                          </>
                        ) : userHasIt ? (
                          <>
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Already have
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add to list
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Instructions
              <span className="text-sm text-muted-foreground">
                {completedSteps.size}/{recipe.instructions.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="space-y-3">
                <div 
                  className="flex gap-4 p-4 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => toggleStep(index)}
                >
                  <div className="shrink-0 pt-1">
                    {completedSteps.has(index) ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                        <span className="text-sm">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className={`flex-1 text-base leading-relaxed ${completedSteps.has(index) ? 'line-through text-muted-foreground' : ''}`}>
                    {instruction}
                  </div>
                </div>
                {index < recipe.instructions.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Try This Section */}
        {recipe.tryThis && recipe.tryThis.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Try This
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.tryThis.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}