import { useMemo, useState, useEffect } from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RecipeCard } from './RecipeCard';
import { recipeService } from '../lib/recipeService';
import { Recipe } from './types';

interface RecipesViewProps {
  onRecipeSelect: (recipe: Recipe) => void;
}

export function RecipesView({ onRecipeSelect }: RecipesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Load recipes on mount
  useEffect(() => {
    recipeService.getAllRecipes().then(loadedRecipes => {
      setRecipes(loadedRecipes);
      setLoading(false);
    });
  }, []);

  // Extract all unique tags from recipes
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    recipes.forEach(recipe => {
      recipe.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [recipes]);

  // Filter recipes based on search query and selected tags
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Filter by search query (title, description, ingredients)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => 
          ingredient.item.toLowerCase().includes(query)
        ) ||
        recipe.instructions.some(instruction =>
          instruction.toLowerCase().includes(query)
        )
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(recipe =>
        selectedTags.every(tag => recipe.tags?.includes(tag))
      );
    }

    return filtered;
  }, [searchQuery, selectedTags, recipes]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery.trim() || selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Browse Recipes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search recipes, ingredients, or cooking methods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tag Filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Filter by tags:</p>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-auto p-1 text-xs hover:bg-transparent"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer transition-colors hover:bg-primary/90"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Active filters:</span>
              {searchQuery.trim() && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recipe Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2>
            {hasActiveFilters ? 'Search Results' : 'All Recipes'}
          </h2>
          <span className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''} ${hasActiveFilters ? ' found' : ''}`}
          </span>
        </div>
        
        {filteredRecipes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">No recipes found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {hasActiveFilters 
                  ? "Try adjusting your search terms or removing some filters."
                  : "No recipes available at the moment."
                }
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="mt-4"
                >
                  Clear all filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => onRecipeSelect(recipe)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Empty State (when no filters active) */}
      {!hasActiveFilters && filteredRecipes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3>No recipes available</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are no recipes to display at the moment. Check back later for new recipes!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}