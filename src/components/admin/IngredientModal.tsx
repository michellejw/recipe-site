import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Ingredient } from '../types';

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ingredient: Ingredient) => void;
  ingredient?: Ingredient | null; // For editing existing ingredients
}

export function IngredientModal({ isOpen, onClose, onSave, ingredient }: IngredientModalProps) {
  const [formData, setFormData] = useState<Ingredient>(() => 
    ingredient || { amount: '', unit: '', item: '', notes: '' }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when ingredient changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(ingredient || { amount: '', unit: '', item: '', notes: '' });
      setErrors({});
    }
  }, [isOpen, ingredient]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    }
    
    if (!formData.item.trim()) {
      newErrors.item = 'Ingredient name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const cleanedIngredient: Ingredient = {
      amount: formData.amount.trim(),
      unit: formData.unit.trim() || undefined,
      item: formData.item.trim(),
      notes: formData.notes.trim() || undefined,
    };
    
    onSave(cleanedIngredient);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ amount: '', unit: '', item: '', notes: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {ingredient ? 'Edit Ingredient' : 'Add Ingredient'}
          </DialogTitle>
          <DialogDescription>
            Enter the ingredient details below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="2"
                autoFocus
              />
              {errors.amount && (
                <p className="text-destructive text-sm">{errors.amount}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="cups, tbsp, etc."
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item">Ingredient *</Label>
            <Input
              id="item"
              value={formData.item}
              onChange={(e) => setFormData(prev => ({ ...prev, item: e.target.value }))}
              placeholder="all-purpose flour"
            />
            {errors.item && (
              <p className="text-destructive text-sm">{errors.item}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="sifted, room temperature, etc."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}