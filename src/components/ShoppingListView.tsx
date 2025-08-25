import { ShoppingCart, X, Plus } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Ingredient } from './types';

interface ShoppingListViewProps {
  shoppingList: Ingredient[];
  setShoppingList: (items: Ingredient[] | ((prev: Ingredient[]) => Ingredient[])) => void;
  selectedIngredients: Ingredient[];
  setSelectedIngredients: (ingredients: Ingredient[] | ((prev: Ingredient[]) => Ingredient[])) => void;
}

export function ShoppingListView({
  shoppingList,
  setShoppingList,
  selectedIngredients,
  setSelectedIngredients
}: ShoppingListViewProps) {
  const handleRemoveFromShoppingList = (ingredientToRemove: Ingredient) => {
    setShoppingList(prev => prev.filter(item => 
      item.item.toLowerCase() !== ingredientToRemove.item.toLowerCase()
    ));
  };

  const handleAddToPantry = (ingredient: Ingredient) => {
    // Check if ingredient is already in pantry
    const alreadyInPantry = selectedIngredients.some(existing =>
      existing.item.toLowerCase() === ingredient.item.toLowerCase()
    );
    
    if (!alreadyInPantry) {
      setSelectedIngredients(prev => [...prev, ingredient]);
    }
    // Remove from shopping list when added to pantry
    handleRemoveFromShoppingList(ingredient);
  };

  const handleMoveAllToPantry = () => {
    shoppingList.forEach(item => {
      const alreadyInPantry = selectedIngredients.some(existing =>
        existing.item.toLowerCase() === item.item.toLowerCase()
      );
      
      if (!alreadyInPantry) {
        setSelectedIngredients(prev => [...prev, item]);
      }
    });
    setShoppingList([]);
  };

  const handleClearList = () => {
    setShoppingList([]);
  };

  const formatIngredient = (ingredient: Ingredient): string => {
    const parts = [];
    if (ingredient.amount) parts.push(ingredient.amount);
    if (ingredient.unit) parts.push(ingredient.unit);
    parts.push(ingredient.item);
    return parts.join(' ');
  };

  if (shoppingList.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-3">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h3>Your shopping list is empty</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Add ingredients from recipes in the "My Pantry" tab to build your shopping list.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Shopping List
            <Badge variant="secondary" className="ml-auto">
              {shoppingList.length} item{shoppingList.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleMoveAllToPantry}
            >
              <Plus className="h-4 w-4 mr-2" />
              Got everything
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearList}
            >
              Clear list
            </Button>
          </div>

          {/* Shopping List Items */}
          <div className="space-y-3">
            {shoppingList.map((item, index) => (
              <div
                key={`${item.item}-${index}`}
                className="flex items-center justify-between p-3 bg-accent/30 rounded-md"
              >
                <div className="space-y-1">
                  <span className="capitalize">{formatIngredient(item)}</span>
                  {item.notes && (
                    <div className="text-xs text-muted-foreground">
                      {item.notes}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => handleAddToPantry(item)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Got it
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveFromShoppingList(item)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shopping Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Check your pantry before heading to the store</p>
          <p>• Look for sales on ingredients you use frequently</p>  
          <p>• Consider buying in bulk for non-perishable items</p>
          <p>• Organize your list by store sections for faster shopping</p>
        </CardContent>
      </Card>
    </div>
  );
}