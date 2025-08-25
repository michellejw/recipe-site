export interface Recipe {
  // Required fields
  id: string;
  title: string;
  description: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  dateAdded: string; // ISO date string
  
  // Optional fields
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  servings?: number;
  category?: string;
  tags?: string[];
  tryThis?: string[]; // Tips, variations, substitutions
}

export interface Ingredient {
  amount: string;
  unit?: string;
  item: string;
  notes?: string;
}