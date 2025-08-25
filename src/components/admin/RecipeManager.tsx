import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, LogOut, Search, Calendar, Clock, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { RecipeForm } from './RecipeForm';
import { recipeService } from '../../lib/recipeService';
import { Recipe } from '../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface RecipeManagerProps {
  onLogout: () => void;
}

export function RecipeManager({ onLogout }: RecipeManagerProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Load recipes
  useEffect(() => {
    loadRecipes();
  }, []);

  // Filter recipes based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.category?.toLowerCase().includes(query) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredRecipes(filtered);
    }
  }, [recipes, searchQuery]);

  const loadRecipes = async () => {
    try {
      const loadedRecipes = await recipeService.getAllRecipes();
      setRecipes(loadedRecipes);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load recipes:', error);
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (recipeData: Omit<Recipe, 'id' | 'dateAdded'>) => {
    setSaveLoading(true);
    
    try {
      if (editingRecipe) {
        // Update existing recipe
        const success = await recipeService.updateRecipe(editingRecipe.id, recipeData);
        if (success) {
          await loadRecipes(); // Reload to get updated data
          setCurrentView('list');
          setEditingRecipe(null);
        }
        return success;
      } else {
        // Add new recipe
        const newRecipe = await recipeService.addRecipe(recipeData);
        if (newRecipe) {
          await loadRecipes(); // Reload to get new data
          setCurrentView('list');
        }
        return !!newRecipe;
      }
    } catch (error) {
      console.error('Failed to save recipe:', error);
      return false;
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipe: Recipe) => {
    try {
      const success = await recipeService.deleteRecipe(recipe.id);
      if (success) {
        await loadRecipes();
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setCurrentView('edit');
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingRecipe(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('recipe-admin-session');
    onLogout();
  };

  if (currentView === 'add' || currentView === 'edit') {
    return (
      <RecipeForm
        recipe={editingRecipe}
        onSave={handleSaveRecipe}
        onCancel={handleCancel}
        loading={saveLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Recipe Manager</h1>
              <p className="text-muted-foreground">
                Manage your recipe collection • {recipes.length} recipes
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setCurrentView('add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Recipe
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes by title, description, category, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Recipes List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading recipes...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? 'No recipes match your search.' : 'No recipes found.'}
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setCurrentView('add')} 
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Recipe
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <ImageWithFallback
                    src={recipe.image}
                    alt={recipe.title}
                    recipeTitle={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="line-clamp-2 text-lg">
                        {recipe.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {recipe.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  {/* Recipe metadata */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {(recipe.prepTime || recipe.cookTime) && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {((recipe.prepTime || 0) + (recipe.cookTime || 0))}m
                        </span>
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{recipe.servings}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(recipe.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Category and tags */}
                  <div className="space-y-2">
                    {recipe.category && (
                      <Badge variant="secondary" className="text-xs">
                        {recipe.category}
                      </Badge>
                    )}
                    
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {recipe.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{recipe.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
                      {recipe.tryThis && recipe.tryThis.length > 0 && (
                        <> • {recipe.tryThis.length} tips</>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(recipe)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRecipe(recipe)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Recipe
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}