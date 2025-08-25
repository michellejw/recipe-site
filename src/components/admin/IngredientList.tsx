import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Ingredient } from '../types';

interface IngredientListProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient, index: number) => void;
  onDelete: (index: number) => void;
}

export function IngredientList({ ingredients, onEdit, onDelete }: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No ingredients added yet.</p>
        <p className="text-sm">Click "Add Ingredient" to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">
                {ingredient.amount}
                {ingredient.unit && (
                  <span className="text-muted-foreground ml-1">
                    {ingredient.unit}
                  </span>
                )}
              </span>
              <span className="text-foreground">
                {ingredient.item}
              </span>
            </div>
            
            {ingredient.notes && (
              <div className="text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {ingredient.notes}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(ingredient, index)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(index)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
      
      <div className="text-xs text-muted-foreground pt-2">
        {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
      </div>
    </div>
  );
}