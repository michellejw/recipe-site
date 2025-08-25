import { useState, useEffect } from 'react';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { IngredientModal } from './IngredientModal';
import { IngredientList } from './IngredientList';
import { Recipe, Ingredient } from '../types';

interface RecipeFormProps {
  recipe?: Recipe | null;
  onSave: (recipe: Omit<Recipe, 'id' | 'dateAdded'>) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800';

export function RecipeForm({ recipe, onSave, onCancel, loading = false }: RecipeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    category: '',
    tags: [''],
    ingredients: [] as Ingredient[],
    instructions: [''],
    tryThis: ['']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<{ ingredient: Ingredient; index: number } | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        prepTime: recipe.prepTime?.toString() || '',
        cookTime: recipe.cookTime?.toString() || '',
        servings: recipe.servings?.toString() || '',
        category: recipe.category || '',
        tags: recipe.tags && recipe.tags.length > 0 ? recipe.tags : [''],
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [],
        instructions: recipe.instructions.length > 0 ? recipe.instructions : [''],
        tryThis: recipe.tryThis && recipe.tryThis.length > 0 ? recipe.tryThis : ['']
      });
    }
  }, [recipe]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Check ingredients
    const validIngredients = formData.ingredients.filter(ing => ing.amount && ing.item);
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }

    // Check instructions
    const validInstructions = formData.instructions.filter(inst => inst.trim());
    if (validInstructions.length === 0) {
      newErrors.instructions = 'At least one instruction is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const processedData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image.trim() || PLACEHOLDER_IMAGE,
      ...(formData.prepTime && { prepTime: parseInt(formData.prepTime) }),
      ...(formData.cookTime && { cookTime: parseInt(formData.cookTime) }),
      ...(formData.servings && { servings: parseInt(formData.servings) }),
      ...(formData.category && { category: formData.category.trim() }),
      ingredients: formData.ingredients.filter(ing => ing.amount && ing.item),
      instructions: formData.instructions.filter(inst => inst.trim()),
      ...(formData.tags.some(tag => tag.trim()) && { 
        tags: formData.tags.filter(tag => tag.trim()).map(tag => tag.trim()) 
      }),
      ...(formData.tryThis.some(tip => tip.trim()) && { 
        tryThis: formData.tryThis.filter(tip => tip.trim()).map(tip => tip.trim()) 
      })
    };

    await onSave(processedData);
  };

  // Array management functions
  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev] as any[], field === 'ingredients' 
        ? { amount: '', unit: '', item: '', notes: '' }
        : ''
      ]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: string, index: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  // Ingredient management functions
  const handleAddIngredient = (ingredient: Ingredient) => {
    if (editingIngredient) {
      // Update existing ingredient
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.map((item, i) => 
          i === editingIngredient.index ? ingredient : item
        )
      }));
      setEditingIngredient(null);
    } else {
      // Add new ingredient
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient]
      }));
    }
    setIngredientModalOpen(false);
  };

  const handleEditIngredient = (ingredient: Ingredient, index: number) => {
    setEditingIngredient({ ingredient, index });
    setIngredientModalOpen(true);
  };

  const handleDeleteIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const openAddIngredientModal = () => {
    setEditingIngredient(null);
    setIngredientModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={loading}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {recipe ? 'Edit Recipe' : 'Add New Recipe'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Recipe name"
                  disabled={loading}
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the recipe"
                rows={3}
                disabled={loading}
              />
              {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Optional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Recipe Details (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prepTime">Prep Time (min)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  value={formData.prepTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, prepTime: e.target.value }))}
                  placeholder="15"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cookTime">Cook Time (min)</Label>
                <Input
                  id="cookTime"
                  type="number"
                  min="0"
                  value={formData.cookTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, cookTime: e.target.value }))}
                  placeholder="30"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
                  placeholder="4"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Main Dishes"
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tags</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('tags')}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateArrayItem('tags', index, e.target.value)}
                      placeholder="e.g., vegetarian, quick, healthy"
                      disabled={loading}
                    />
                    {formData.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('tags', index)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ingredients *</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openAddIngredientModal}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.ingredients && <p className="text-destructive text-sm">{errors.ingredients}</p>}
            <IngredientList
              ingredients={formData.ingredients}
              onEdit={handleEditIngredient}
              onDelete={handleDeleteIngredient}
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Instructions *</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('instructions')}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.instructions && <p className="text-destructive text-sm">{errors.instructions}</p>}
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-sm text-muted-foreground mt-3 min-w-6">
                  {index + 1}.
                </span>
                <Textarea
                  value={instruction}
                  onChange={(e) => updateArrayItem('instructions', index, e.target.value)}
                  placeholder="Describe this step..."
                  rows={2}
                  disabled={loading}
                  className="flex-1"
                />
                {formData.instructions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('instructions', index)}
                    disabled={loading}
                    className="mt-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Try This (Tips & Variations) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Try This (Optional)</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('tryThis')}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tip
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Add tips, variations, substitutions, or serving suggestions
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.tryThis.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  value={tip}
                  onChange={(e) => updateArrayItem('tryThis', index, e.target.value)}
                  placeholder="e.g., Try substituting Greek yogurt for sour cream"
                  rows={2}
                  disabled={loading}
                  className="flex-1"
                />
                {formData.tryThis.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('tryThis', index)}
                    disabled={loading}
                    className="mt-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Separator />

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Recipe'}
          </Button>
        </div>
      </form>

      {/* Ingredient Modal */}
      <IngredientModal
        isOpen={ingredientModalOpen}
        onClose={() => setIngredientModalOpen(false)}
        onSave={handleAddIngredient}
        ingredient={editingIngredient?.ingredient}
      />
    </div>
  );
}