import { useState } from "react";
import { RecipeDetail } from "./components/RecipeDetail";
import { PantryView } from "./components/PantryView";
import { ShoppingListView } from "./components/ShoppingListView";
import { RecipesView } from "./components/RecipesView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Recipe, Ingredient } from "./components/types";

export default function App() {
  const [selectedRecipe, setSelectedRecipe] =
    useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState("recipes");
  
  // Pantry state - now stores ingredient objects with quantities
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState('');
  
  // Shopping list state - now stores ingredient objects with quantities
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipe(null)}
          userIngredients={selectedIngredients}
          onAddToPantry={(ingredient) => {
            const exists = selectedIngredients.some(existing => 
              existing.item.toLowerCase() === ingredient.item.toLowerCase()
            );
            if (!exists) {
              setSelectedIngredients(prev => [...prev, ingredient]);
            }
          }}
          onRemoveFromPantry={(ingredient) => {
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
          }}
          onAddToShoppingList={(ingredient) => {
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
          }}
          onRemoveFromShoppingList={(ingredient) => {
            setShoppingList(prev => prev.filter(item => 
              item.item.toLowerCase() !== ingredient.item.toLowerCase()
            ));
          }}
          shoppingList={shoppingList}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl">
                Dumb Recipes
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Recipes for people who like to eat but hate to
                cook.
              </p>
            </div>
            
            {/* Navigation Tabs */}
            <div className="max-w-4xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                  <TabsTrigger value="recipes">Recipes</TabsTrigger>
                  <TabsTrigger value="pantry">My Pantry</TabsTrigger>
                  <TabsTrigger value="shopping">
                    Shopping List
                    {shoppingList.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        {shoppingList.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="recipes">
            <RecipesView onRecipeSelect={setSelectedRecipe} />
          </TabsContent>
          
          <TabsContent value="pantry">
            <PantryView 
              onRecipeSelect={setSelectedRecipe} 
              selectedIngredients={selectedIngredients}
              setSelectedIngredients={setSelectedIngredients}
              ingredientSearch={ingredientSearch}
              setIngredientSearch={setIngredientSearch}
              shoppingList={shoppingList}
              setShoppingList={setShoppingList}
            />
          </TabsContent>
          
          <TabsContent value="shopping">
            <ShoppingListView
              shoppingList={shoppingList}
              setShoppingList={setShoppingList}
              selectedIngredients={selectedIngredients}
              setSelectedIngredients={setSelectedIngredients}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}