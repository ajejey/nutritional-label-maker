'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, DollarSign, ShoppingCart, BarChart2, Package, FileDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getSavedRecipes, getCurrentRecipe } from '@/app/lib/local-storage';

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  costPerUnit: number;
  // Advanced features
  inStock?: number;        // Current inventory level
  reorderPoint?: number;   // When to reorder
  supplier?: string;       // Supplier name
  priceHistory?: {         // Historical price tracking
    date: string;
    price: number;
  }[];
}

const CostCalculator = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'All-purpose flour', amount: 2, unit: 'cups', costPerUnit: 0.25, inStock: 10, reorderPoint: 5, supplier: 'Local Grocery' },
    { id: '2', name: 'Sugar', amount: 1, unit: 'cup', costPerUnit: 0.50, inStock: 8, reorderPoint: 4, supplier: 'Bulk Foods' },
    { id: '3', name: 'Butter', amount: 0.5, unit: 'cup', costPerUnit: 1.20, inStock: 6, reorderPoint: 3, supplier: 'Dairy Farm' },
    { id: '4', name: 'Eggs', amount: 2, unit: 'pieces', costPerUnit: 0.25, inStock: 12, reorderPoint: 6, supplier: 'Local Farm' },
  ]);

  const [laborRate, setLaborRate] = useState(20);
  const [timeHours, setTimeHours] = useState(2);
  const [overheadPercent, setOverheadPercent] = useState(15);
  const [profitMargin, setProfitMargin] = useState(40);
  const [servings, setServings] = useState(12);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [batchSize, setBatchSize] = useState(1);
  
  // Advanced feature states
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [shoppingList, setShoppingList] = useState<{name: string, amount: number, unit: string, supplier: string}[]>([]);
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  
  // Recipe import states
  const [showRecipeImport, setShowRecipeImport] = useState(false);
  const [savedRecipesList, setSavedRecipesList] = useState<Array<{id: string, name: string}>>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      unit: 'cup',
      costPerUnit: 0,
      inStock: 0,
      reorderPoint: 0,
      supplier: '',
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map(ing =>
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const calculateCosts = () => {
    const ingredientCost = ingredients.reduce((total, ing) =>
      total + (ing.amount * ing.costPerUnit), 0
    );

    const laborCost = laborRate * timeHours;
    const overheadCost = (ingredientCost + laborCost) * (overheadPercent / 100);
    const totalCost = ingredientCost + laborCost + overheadCost;
    const suggestedPrice = totalCost * (1 + profitMargin / 100);
    
    // Calculate batch costs
    const batchIngredientCost = ingredientCost * batchSize;
    const batchLaborCost = laborCost * batchSize;
    const batchOverheadCost = overheadCost * batchSize;
    const batchTotalCost = totalCost * batchSize;
    const batchSuggestedPrice = suggestedPrice * batchSize;

    return {
      ingredientCost,
      laborCost,
      overheadCost,
      totalCost,
      suggestedPrice,
      costPerServing: totalCost / servings,
      pricePerServing: suggestedPrice / servings,
      // Batch calculations
      batchIngredientCost,
      batchLaborCost,
      batchOverheadCost,
      batchTotalCost,
      batchSuggestedPrice,
      batchCostPerServing: (totalCost * batchSize) / (servings * batchSize),
      batchPricePerServing: (suggestedPrice * batchSize) / (servings * batchSize),
    };
  };

  const costs = calculateCosts();

  const saveToLocalStorage = () => {
    const data = {
      ingredients,
      laborRate,
      timeHours,
      overheadPercent,
      profitMargin,
      servings,
      batchSize,
    };
    localStorage.setItem('bakersCostCalculator', JSON.stringify(data));
    toast({
      description: 'Recipe costs saved successfully!',
    });
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('bakersCostCalculator');
    if (saved) {
      const data = JSON.parse(saved);
      setIngredients(data.ingredients || []);
      setLaborRate(data.laborRate || 20);
      setTimeHours(data.timeHours || 2);
      setOverheadPercent(data.overheadPercent || 15);
      setProfitMargin(data.profitMargin || 40);
      setServings(data.servings || 12);
      setBatchSize(data.batchSize || 1);
      toast({
        description: 'Recipe costs loaded successfully!',
      });
    }
  };
  
  const generateShoppingList = () => {
    const list = ingredients
      .filter(ing => (ing.inStock || 0) < (ing.reorderPoint || 0))
      .map(ing => ({
        name: ing.name,
        amount: ing.amount * batchSize,
        unit: ing.unit,
        supplier: ing.supplier || 'Not specified'
      }));
    
    setShoppingList(list);
    setShowShoppingList(true);
    
    if (list.length === 0) {
      toast({
        description: 'All ingredients are above reorder points.',
      });
    }
  };
  
  const viewPriceHistory = (id: string) => {
    setSelectedIngredient(id);
    setShowPriceHistory(true);
  };
  
  const addPriceHistoryEntry = (id: string, price: number) => {
    setIngredients(ingredients.map(ing => {
      if (ing.id === id) {
        const priceHistory = ing.priceHistory || [];
        return {
          ...ing,
          costPerUnit: price,
          priceHistory: [
            ...priceHistory,
            { date: new Date().toISOString().split('T')[0], price }
          ]
        };
      }
      return ing;
    }));
    
    toast({
      description: 'Price history updated!',
    });
  };
  
  // Function to load saved recipes list
  const loadSavedRecipesList = () => {
    try {
      const recipes = getSavedRecipes();
      if (recipes.length > 0) {
        setSavedRecipesList(recipes.map(recipe => ({
          id: recipe.id,
          name: recipe.name
        })));
        return true;
      } else {
        toast({
          description: 'No saved recipes found.',
        });
        return false;
      }
    } catch (error) {
      console.error('Error loading saved recipes:', error);
      toast({
        description: 'Error loading saved recipes.',
      });
      return false;
    }
  };
  
  // Function to import ingredients from a selected recipe
  const importIngredientsFromRecipe = (recipeId: string) => {
    try {
      const recipes = getSavedRecipes();
      const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
      
      if (!selectedRecipe) {
        toast({
          description: 'Recipe not found.',
        });
        return;
      }
      
      // Convert recipe ingredients to calculator ingredients
      const recipeIngredients = selectedRecipe.data.recipe.ingredients;
      if (!recipeIngredients || recipeIngredients.length === 0) {
        toast({
          description: 'No ingredients found in the selected recipe.',
        });
        return;
      }
      
      const calculatorIngredients = recipeIngredients.map(recipeIng => ({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        name: recipeIng.name,
        amount: recipeIng.quantity,
        unit: recipeIng.unit,
        costPerUnit: 0, // Default cost, user will need to fill this in
        inStock: 0,
        reorderPoint: 0,
        supplier: '',
      }));
      
      // Add these ingredients to our current list
      setIngredients([...ingredients, ...calculatorIngredients]);
      
      toast({
        description: `Imported ${calculatorIngredients.length} ingredients from "${selectedRecipe.name}"`,
      });
      
      // Close the modal
      setShowRecipeImport(false);
    } catch (error) {
      console.error('Error importing ingredients:', error);
      toast({
        description: 'Error importing ingredients from recipe.',
      });
    }
  };

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cost Calculator</h1>
        <p className="text-gray-600">Calculate ingredient costs and set profitable prices</p>
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Simple</span>
          <button
            onClick={() => setAdvancedMode(!advancedMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              advancedMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                advancedMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-gray-600">Advanced</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>Add your recipe ingredients and their costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Recipe Ingredients</Label>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        const hasRecipes = loadSavedRecipesList();
                        if (hasRecipes) {
                          setShowRecipeImport(true);
                        }
                      }} 
                      size="sm" 
                      variant="secondary"
                      className=" hover:text-gray-900"
                    >
                      <FileDown className="h-4 w-4 mr-1" />
                      Import from Recipe
                    </Button>
                    <Button onClick={addIngredient} size="sm" variant="default">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Ingredient
                    </Button>
                  </div>
                </div>

                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <Input
                        placeholder="Ingredient name"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.25"
                        placeholder="Amount"
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(ingredient.id, 'amount', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                      >
                        <option value="cup">cup</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                        <option value="oz">oz</option>
                        <option value="lb">lb</option>
                        <option value="g">g</option>
                        <option value="pieces">pieces</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Cost per unit"
                          value={ingredient.costPerUnit}
                          onChange={(e) => updateIngredient(ingredient.id, 'costPerUnit', Number(e.target.value))}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        onClick={() => removeIngredient(ingredient.id)}
                        size="sm"
                        variant="outline"
                        className="p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Labor & Overhead</CardTitle>
              <CardDescription>Factor in your time and business expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="laborRate">Hourly Labor Rate ($)</Label>
                  <Input
                    id="laborRate"
                    type="number"
                    value={laborRate}
                    onChange={(e) => setLaborRate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="timeHours">Time Required (hours)</Label>
                  <Input
                    id="timeHours"
                    type="number"
                    step="0.25"
                    value={timeHours}
                    onChange={(e) => setTimeHours(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="overhead">Overhead (%)</Label>
                  <Input
                    id="overhead"
                    type="number"
                    value={overheadPercent}
                    onChange={(e) => setOverheadPercent(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="servings">Servings/Yield</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                  />
                </div>
              </div>
              
              {advancedMode && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <Label htmlFor="batchSize" className="font-medium">Batch Size</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="batchSize"
                      type="number"
                      min="1"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setBatchSize(1)}
                    >
                      Reset
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Calculate costs for multiple batches
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* {advancedMode && (
            <Card>
              <CardHeader>
                <CardTitle>Inventory Tracking</CardTitle>
                <CardDescription>Track ingredient stock levels and generate shopping lists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ingredients.map((ingredient) => (
                    <div key={`inv-${ingredient.id}`} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4 font-medium">{ingredient.name || 'Unnamed'}</div>
                      <div className="col-span-2">
                        <Label htmlFor={`stock-${ingredient.id}`} className="text-xs">In Stock</Label>
                        <Input
                          id={`stock-${ingredient.id}`}
                          type="number"
                          min="0"
                          value={ingredient.inStock || 0}
                          onChange={(e) => updateIngredient(ingredient.id, 'inStock', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor={`reorder-${ingredient.id}`} className="text-xs">Reorder At</Label>
                        <Input
                          id={`reorder-${ingredient.id}`}
                          type="number"
                          min="0"
                          value={ingredient.reorderPoint || 0}
                          onChange={(e) => updateIngredient(ingredient.id, 'reorderPoint', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor={`supplier-${ingredient.id}`} className="text-xs">Supplier</Label>
                        <Input
                          id={`supplier-${ingredient.id}`}
                          type="text"
                          value={ingredient.supplier || ''}
                          onChange={(e) => updateIngredient(ingredient.id, 'supplier', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-1 flex items-end justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          title="View price history"
                          onClick={() => viewPriceHistory(ingredient.id)}
                        >
                          <BarChart2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <Button onClick={generateShoppingList} className="w-full">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Generate Shopping List
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>Total costs and suggested pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {advancedMode && batchSize > 1 ? (
                <div className="bg-amber-50 p-3 rounded-lg mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Batch Size:</span>
                    <span className="font-bold">{batchSize}x</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Showing costs for {batchSize} batches ({batchSize * servings} total servings)
                  </div>
                </div>
              ) : null}
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ingredients:</span>
                  <span className="font-medium">
                    ${advancedMode && batchSize > 1 ? costs.batchIngredientCost.toFixed(2) : costs.ingredientCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Labor:</span>
                  <span className="font-medium">
                    ${advancedMode && batchSize > 1 ? costs.batchLaborCost.toFixed(2) : costs.laborCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overhead ({overheadPercent}%):</span>
                  <span className="font-medium">
                    ${advancedMode && batchSize > 1 ? costs.batchOverheadCost.toFixed(2) : costs.overheadCost.toFixed(2)}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Cost:</span>
                  <span className="text-red-600">
                    ${advancedMode && batchSize > 1 ? costs.batchTotalCost.toFixed(2) : costs.totalCost.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="mb-3">
                  <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                  <Input
                    id="profitMargin"
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(Number(e.target.value))}
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Suggested Selling Price</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${advancedMode && batchSize > 1 ? costs.batchSuggestedPrice.toFixed(2) : costs.suggestedPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ${costs.pricePerServing.toFixed(2)} per serving
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Per Serving</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span>${costs.costPerServing.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>${costs.pricePerServing.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Profit:</span>
                    <span className="text-green-600">
                      ${(costs.pricePerServing - costs.costPerServing).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* <div className="flex gap-2 mt-6">
                <Button onClick={saveToLocalStorage} variant="outline" className="flex-1">
                  Save
                </Button>
                <Button onClick={loadFromLocalStorage} variant="outline" className="flex-1">
                  Load
                </Button>
              </div> */}
            </CardContent>
          </Card>
          
          {advancedMode && (
            <Card>
              <CardHeader>
                <CardTitle>Production Summary</CardTitle>
                <CardDescription>Batch production details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Total Servings:</span>
                    <span className="font-medium">{servings * batchSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Production Time:</span>
                    <span className="font-medium">{(timeHours * batchSize).toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Labor Cost:</span>
                    <span className="font-medium">${costs.batchLaborCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cost Per Batch:</span>
                    <span className="font-medium">${costs.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Recipe Import Modal */}
      {showRecipeImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Import Ingredients from Recipe</h2>
              <Button variant="ghost" onClick={() => setShowRecipeImport(false)}>✕</Button>
            </div>
            
            {savedRecipesList.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-gray-600">Select a recipe to import its ingredients:</p>
                
                <div className="max-h-60 overflow-y-auto mb-4 border rounded-md">
                  {savedRecipesList.map(recipe => (
                    <div 
                      key={recipe.id}
                      className={`p-3 cursor-pointer hover:bg-gray-100 border-b ${selectedRecipeId === recipe.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedRecipeId(recipe.id)}
                    >
                      {recipe.name}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowRecipeImport(false)}>
                    Cancel
                  </Button>
                  <Button 
                    disabled={!selectedRecipeId}
                    onClick={() => selectedRecipeId && importIngredientsFromRecipe(selectedRecipeId)}
                  >
                    Import Ingredients
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p>No saved recipes found.</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowRecipeImport(false)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Shopping List Modal */}
      {showShoppingList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Shopping List</h2>
              <Button variant="ghost" onClick={() => setShowShoppingList(false)}>✕</Button>
            </div>
            
            {shoppingList.length > 0 ? (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Ingredient</th>
                      <th className="text-left py-2">Amount</th>
                      <th className="text-left py-2">Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoppingList.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">{item.amount} {item.unit}</td>
                        <td className="py-2">{item.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowShoppingList(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    // Here you would implement printing or exporting
                    toast({
                      description: 'Shopping list exported successfully!',
                    });
                  }}>
                    Export List
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p>All ingredients are above reorder points.</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowShoppingList(false)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Price History Modal */}
      {showPriceHistory && selectedIngredient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Price History</h2>
              <Button variant="ghost" onClick={() => setShowPriceHistory(false)}>✕</Button>
            </div>
            
            {(() => {
              const ingredient = ingredients.find(ing => ing.id === selectedIngredient);
              if (!ingredient) return null;
              
              return (
                <>
                  <h3 className="font-medium mb-2">{ingredient.name}</h3>
                  
                  <div className="mb-4">
                    <Label htmlFor="newPrice">Add New Price</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newPrice"
                        type="number"
                        step="0.01"
                        placeholder="Price per unit"
                        defaultValue={ingredient.costPerUnit}
                      />
                      <Button onClick={() => {
                        const priceInput = document.getElementById('newPrice') as HTMLInputElement;
                        const price = Number(priceInput.value);
                        if (price > 0) {
                          addPriceHistoryEntry(selectedIngredient, price);
                        }
                      }}>
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-right py-2">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(ingredient.priceHistory || []).map((entry, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{entry.date}</td>
                            <td className="py-2 text-right">${entry.price.toFixed(2)}</td>
                          </tr>
                        ))}
                        {(ingredient.priceHistory || []).length === 0 && (
                          <tr>
                            <td colSpan={2} className="py-4 text-center text-gray-500">
                              No price history available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCalculator;