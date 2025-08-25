import { Recipe } from './types';

// @ts-ignore - Temporarily ignoring type errors for migration
export const mockRecipes: any[] = [
  {
    id: '1',
    title: 'Sourdough Starter & Bread',
    description: 'Make your own sourdough starter from scratch and bake a rustic loaf',
    image: 'https://images.unsplash.com/photo-1597604396383-b8ca64ed8fa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VyZG91Z2glMjBicmVhZCUyMHJ1c3RpY3xlbnwxfHx8fDE3NTYwNjc4ODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 30,
    cookTime: 45,
    servings: 8,
    difficulty: 'Medium',
    category: 'Bread & Baking',
    tags: ['fermented', 'artisan', 'homemade'],
    ingredients: [
      { amount: '2', unit: 'cups', item: 'bread flour' },
      { amount: '1', unit: 'cup', item: 'warm water' },
      { amount: '1/2', unit: 'cup', item: 'active sourdough starter' },
      { amount: '1', unit: 'tsp', item: 'salt' },
      { amount: '1', unit: 'tbsp', item: 'olive oil' }
    ],
    instructions: [
      'Feed your sourdough starter 4-8 hours before baking',
      'Mix flour and salt in a large bowl',
      'Combine water, starter, and olive oil in a separate bowl',
      'Pour wet ingredients into dry and mix until shaggy dough forms',
      'Knead for 8-10 minutes until smooth and elastic',
      'Place in oiled bowl, cover, and let rise for 4-6 hours',
      'Shape into a boule and place seam-side down in a banneton or bowl',
      'Cover and refrigerate overnight',
      'Preheat Dutch oven to 450°F',
      'Score the dough and bake covered for 30 minutes',
      'Remove lid and bake 15 more minutes until golden'
    ]
  },
  {
    id: '2',
    title: 'Homemade Kimchi',
    description: 'Fermented Korean cabbage with DIY spice blend',
    image: 'https://images.unsplash.com/photo-1540138279543-b3728f037467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraW1jaGklMjBmZXJtZW50ZWQlMjB2ZWdldGFibGVzfGVufDF8fHx8MTc1NjA2Nzg4NXww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 45,
    cookTime: 0,
    servings: 6,
    difficulty: 'Easy',
    category: 'Fermented Foods',
    tags: ['fermented', 'spicy', 'probiotics', 'korean'],
    ingredients: [
      { amount: '1', unit: 'head', item: 'napa cabbage', notes: 'about 2 lbs' },
      { amount: '1/4', unit: 'cup', item: 'sea salt' },
      { amount: '2', unit: 'tbsp', item: 'gochugaru (Korean chili flakes)' },
      { amount: '6', unit: 'cloves', item: 'garlic, minced' },
      { amount: '1', unit: 'inch', item: 'fresh ginger, grated' },
      { amount: '4', unit: 'scallions', item: 'chopped' },
      { amount: '1', unit: 'tbsp', item: 'fish sauce' },
      { amount: '1', unit: 'tsp', item: 'sugar' }
    ],
    instructions: [
      'Chop cabbage into 2-inch pieces',
      'Dissolve salt in 8 cups water, submerge cabbage for 2 hours',
      'Drain cabbage and rinse 3 times',
      'Mix gochugaru, garlic, ginger, fish sauce, and sugar into a paste',
      'Massage paste into cabbage along with scallions',
      'Pack tightly into a clean jar, leaving 1 inch headspace',
      'Weight down with a small jar or fermentation weight',
      'Cover with cloth and ferment at room temperature 3-5 days',
      'Taste daily until desired sourness is reached',
      'Refrigerate to slow fermentation'
    ]
  },
  {
    id: '3',
    title: 'Cold-Pressed Coffee',
    description: 'Smooth, concentrate coffee made without heat',
    image: 'https://images.unsplash.com/photo-1611477948234-a3c27435c72b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwYnJldyUyMGNvZmZlZSUyMGdsYXNzfGVufDF8fHx8MTc1NjA1NTA0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 5,
    cookTime: 0,
    servings: 4,
    difficulty: 'Easy',
    category: 'Beverages',
    tags: ['coffee', 'cold-brew', 'concentrate'],
    ingredients: [
      { amount: '1', unit: 'cup', item: 'coarsely ground coffee' },
      { amount: '4', unit: 'cups', item: 'filtered water' },
      { amount: '1', unit: 'cup', item: 'milk or water', notes: 'for serving' },
      { amount: '2', unit: 'tbsp', item: 'simple syrup', notes: 'optional' }
    ],
    instructions: [
      'Combine coffee grounds and water in a large jar',
      'Stir well to ensure all grounds are saturated',
      'Cover and steep at room temperature for 12-24 hours',
      'Strain through a fine-mesh sieve lined with cheesecloth',
      'Store concentrate in refrigerator for up to 1 week',
      'To serve: mix 1:1 with milk or water over ice',
      'Sweeten with simple syrup if desired'
    ]
  },
  {
    id: '4',
    title: 'Herb-Infused Salt',
    description: 'Preserve garden herbs in flaky sea salt',
    image: 'https://images.unsplash.com/photo-1558960589-06934b614a27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiJTIwc2FsdCUyMHNlYXNvbmluZ3xlbnwxfHx8fDE3NTYwNjc4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 15,
    cookTime: 120,
    servings: 8,
    difficulty: 'Easy',
    category: 'Seasonings',
    tags: ['herbs', 'seasoning', 'preserved'],
    ingredients: [
      { amount: '2', unit: 'cups', item: 'flaky sea salt' },
      { amount: '1/2', unit: 'cup', item: 'fresh rosemary, chopped' },
      { amount: '1/4', unit: 'cup', item: 'fresh thyme leaves' },
      { amount: '2', unit: 'tbsp', item: 'fresh oregano, chopped' },
      { amount: '1', unit: 'tbsp', item: 'black peppercorns' }
    ],
    instructions: [
      'Preheat oven to 200°F',
      'Spread salt on a large baking sheet',
      'Sprinkle herbs evenly over salt',
      'Bake for 2 hours, stirring every 30 minutes',
      'Let cool completely',
      'Transfer to a food processor and pulse 10-15 times',
      'Sift through a fine-mesh strainer to remove large pieces',
      'Store in airtight containers for up to 6 months',
      'Use on roasted vegetables, meat, or finishing dishes'
    ]
  },
  {
    id: '5',
    title: 'Homemade Pasta',
    description: 'Simple egg pasta made from scratch',
    image: 'https://images.unsplash.com/photo-1513553016575-0ccd93e15315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHBhc3RhJTIwbWFraW5nfGVufDF8fHx8MTc1NjA2Nzg4NXww&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 60,
    cookTime: 5,
    servings: 4,
    difficulty: 'Medium',
    category: 'Pasta & Noodles',
    tags: ['italian', 'handmade', 'fresh'],
    ingredients: [
      { amount: '2', unit: 'cups', item: '00 flour or all-purpose flour' },
      { amount: '3', unit: 'large', item: 'eggs' },
      { amount: '1', unit: 'tbsp', item: 'olive oil' },
      { amount: '1', unit: 'tsp', item: 'salt' },
      { amount: '2-4', unit: 'tbsp', item: 'semolina flour', notes: 'for dusting' }
    ],
    instructions: [
      'Create a well with flour on a clean work surface',
      'Crack eggs into the center and add oil and salt',
      'Beat eggs with a fork, gradually incorporating flour',
      'Knead dough for 8-10 minutes until smooth and elastic',
      'Wrap in plastic and rest for 30 minutes',
      'Divide into 4 portions and roll each very thin',
      'Cut into desired shapes (fettuccine, linguine, etc.)',
      'Dust with semolina to prevent sticking',
      'Cook in salted boiling water for 2-3 minutes',
      'Serve immediately with your favorite sauce'
    ]
  },
  {
    id: '6',
    title: 'Pickled Vegetables',
    description: 'Quick refrigerator pickles with customizable brine',
    image: 'https://images.unsplash.com/photo-1610602925036-1d81bb50065a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWNrbGVkJTIwdmVnZXRhYmxlcyUyMGphcnN8ZW58MXx8fHwxNzU2MDY3ODg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    prepTime: 20,
    cookTime: 10,
    servings: 8,
    difficulty: 'Easy',
    category: 'Preserved Foods',
    tags: ['pickled', 'vegetables', 'quick'],
    ingredients: [
      { amount: '2', unit: 'cups', item: 'mixed vegetables', notes: 'carrots, cucumbers, radishes' },
      { amount: '1', unit: 'cup', item: 'white vinegar' },
      { amount: '1', unit: 'cup', item: 'water' },
      { amount: '2', unit: 'tbsp', item: 'sugar' },
      { amount: '1', unit: 'tbsp', item: 'salt' },
      { amount: '2', unit: 'cloves', item: 'garlic' },
      { amount: '1', unit: 'tsp', item: 'peppercorns' },
      { amount: '1', unit: 'bay leaf', item: '' }
    ],
    instructions: [
      'Cut vegetables into uniform pieces',
      'Pack vegetables tightly into clean jars',
      'Combine vinegar, water, sugar, and salt in a saucepan',
      'Add garlic, peppercorns, and bay leaf',
      'Bring to a boil and stir until sugar dissolves',
      'Pour hot brine over vegetables, leaving 1/2 inch headspace',
      'Let cool to room temperature',
      'Refrigerate for at least 2 hours before eating',
      'Will keep in refrigerator for up to 1 month'
    ]
  }
];