export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
}

export interface Ingredient {
  amount: string;
  unit?: string;
  item: string;
  notes?: string;
}