import { Clock, Users, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Recipe } from './types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  matchingIngredients?: string[];
  missingIngredients?: number;
}

export function RecipeCard({ 
  recipe, 
  onClick, 
  matchingIngredients = [],
  missingIngredients = 0
}: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border border-border/50"
      onClick={onClick}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={recipe.difficulty === 'Easy' ? 'default' : recipe.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
            {recipe.difficulty}
          </Badge>
        </div>
        
        {/* Ingredient Match Indicator */}
        {matchingIngredients.length > 0 && (
          <div className="absolute top-2 left-2 p-2 text-xs bg-background/90 backdrop-blur-sm border rounded-md">
            <div className="space-y-1">
              <div className="text-green-600">
                ✓ {matchingIngredients.length} have
              </div>
              {missingIngredients > 0 && (
                <div className="text-orange-600">
                  • {missingIngredients} need
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="line-clamp-2">{recipe.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.description}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{totalTime}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            <span>{recipe.category}</span>
          </div>
        </div>
        
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
      </CardContent>
    </Card>
  );
}