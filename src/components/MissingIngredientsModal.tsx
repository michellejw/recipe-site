import { Plus, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Recipe } from './types';
import { useState, useRef } from 'react';

interface MissingIngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
  userIngredients: string[];
  onAddToPantry: (ingredient: string) => void;
  onAddToShoppingList: (ingredient: string) => void;
  shoppingList: string[];
}

export function MissingIngredientsModal({
  isOpen,
  onClose,
  recipe,
  userIngredients,
  onAddToPantry,
  onAddToShoppingList,
  shoppingList
}: MissingIngredientsModalProps) {
  // State for tracking animations and removed items - use ingredient names instead of indexes
  const [animatingItems, setAnimatingItems] = useState<Record<string, 'shopping' | null>>({});
  const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  // Get missing ingredient objects from recipe
  const missingIngredientDetails = recipe.ingredients.filter(ingredient => {
    const cleanName = ingredient.item.toLowerCase().trim();
    return !userIngredients.some(userIng => {
      const userIngLower = userIng.toLowerCase();
      
      // Use same matching logic as in PantryView
      const recipeWords = cleanName.split(/[\s,]+/).filter(w => w.length > 2);
      const userWords = userIngLower.split(/[\s,]+/).filter(w => w.length > 2);
      
      // Direct substring match
      if (cleanName.includes(userIngLower) || userIngLower.includes(cleanName)) {
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

  const cleanIngredientName = (ingredient: string): string => {
    // Clean ingredient name for matching
    const cleanName = ingredient.toLowerCase().trim()
      .replace(/\([^)]*\)/g, '').trim();
    
    // Remove descriptive words to get core ingredient
    const filterWords = ['fresh', 'dried', 'frozen', 'canned', 'ground', 'whole', 'chopped', 'minced', 
      'sliced', 'diced', 'grated', 'shredded', 'cooked', 'raw', 'organic', 'free-range',
      'extra', 'virgin', 'kosher', 'sea', 'table', 'fine', 'coarse', 'large', 'small',
      'medium', 'about', 'approximately', 'or', 'to', 'taste'];
    
    const words = cleanName.split(/[\s,]+/).filter(word => 
      word.length > 1 && !filterWords.includes(word)
    );
    
    return words.length > 0 ? words.join(' ') : cleanName;
  };

  const triggerShoppingAnimation = (ingredientKey: string) => {
    // Clear existing timeout if any
    if (timeoutRefs.current[ingredientKey]) {
      clearTimeout(timeoutRefs.current[ingredientKey]);
    }

    // Set animation state for shopping
    setAnimatingItems(prev => ({ ...prev, [ingredientKey]: 'shopping' }));

    // Reset after animation duration
    timeoutRefs.current[ingredientKey] = setTimeout(() => {
      setAnimatingItems(prev => ({ ...prev, [ingredientKey]: null }));
      delete timeoutRefs.current[ingredientKey];
    }, 600); // 600ms total animation time
  };

  const handleAddToPantry = (ingredient: string) => {
    const coreIngredient = cleanIngredientName(ingredient);
    
    // Mark item as removed immediately for visual feedback using ingredient name as key
    setRemovedItems(prev => new Set([...prev, ingredient]));
    
    // Call the original handler
    onAddToPantry(coreIngredient);
  };

  const handleAddToShoppingList = (ingredient: string) => {
    const coreIngredient = cleanIngredientName(ingredient);
    
    // Trigger animation using ingredient name as key
    triggerShoppingAnimation(ingredient);
    
    // Call the original handler
    onAddToShoppingList(coreIngredient);
  };

  // Check if an ingredient is already on the shopping list
  const isOnShoppingList = (ingredient: string): boolean => {
    const coreIngredient = cleanIngredientName(ingredient);
    return shoppingList.some(item => 
      item.toLowerCase() === coreIngredient.toLowerCase()
    );
  };

  // Clean up timeouts on unmount
  const cleanupTimeouts = () => {
    Object.values(timeoutRefs.current).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    timeoutRefs.current = {};
    setAnimatingItems({});
    setRemovedItems(new Set());
  };

  // Clean up when modal closes
  const handleClose = () => {
    cleanupTimeouts();
    onClose();
  };

  if (missingIngredientDetails.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Missing Ingredients for {recipe.title}</DialogTitle>
          <DialogDescription>
            Add the missing ingredients to your pantry if you have them, or add them to your shopping list to get them later.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground">
            You need {missingIngredientDetails.filter(ingredient => !removedItems.has(ingredient.item)).length} more ingredient{missingIngredientDetails.filter(ingredient => !removedItems.has(ingredient.item)).length !== 1 ? 's' : ''} for this recipe:
          </p>
          
          <div className="space-y-3 transition-all duration-300 ease-in-out">
            {missingIngredientDetails.map((ingredient, index) => {
              const animationType = animatingItems[ingredient.item];
              const alreadyOnList = isOnShoppingList(ingredient.item);
              const isRemoved = removedItems.has(ingredient.item);
              
              return (
                <div 
                  key={`${recipe.id}-${ingredient.item}`} // Use ingredient name for stable key
                  className={`transition-all duration-300 ease-in-out ${
                    isRemoved 
                      ? 'opacity-0 scale-95 h-0 overflow-hidden mb-0 py-0' 
                      : 'opacity-100 scale-100'
                  }`}
                  style={{
                    transform: isRemoved ? 'translateY(-20px)' : 'translateY(0)',
                  }}
                >
                  <div 
                    className={`p-3 rounded-md transition-all duration-300 ease-in-out ${
                      animationType === 'shopping'
                        ? 'bg-orange-100 border-2 border-orange-300'
                        : 'bg-accent/30'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="capitalize">{ingredient.amount} {ingredient.unit} {ingredient.item}</span>
                      </div>
                      {ingredient.notes && (
                        <div className="text-xs text-muted-foreground">
                          {ingredient.notes}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs transition-all duration-200"
                          onClick={() => handleAddToPantry(ingredient.item)}
                          disabled={isRemoved}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          I have this
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={alreadyOnList || isRemoved}
                          className={`text-xs transition-all duration-200 ${
                            alreadyOnList
                              ? 'opacity-50 text-muted-foreground cursor-not-allowed'
                              : animationType === 'shopping' 
                              ? 'bg-orange-500 text-white border-orange-500' 
                              : ''
                          }`}
                          onClick={() => !alreadyOnList && !isRemoved && handleAddToShoppingList(ingredient.item)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {alreadyOnList ? 'On list' : 'Add to list'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}