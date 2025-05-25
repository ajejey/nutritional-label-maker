'use client'

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, Plus, Download, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSavedRecipes, deleteRecipe, loadRecipe, SavedRecipe } from '../lib/local-storage';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
// import { toast } from '@/components/ui/use-toast';

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const router = useRouter();
  const {toast} = useToast();

  useEffect(() => {
    // Load saved recipes on component mount
    const savedRecipes = getSavedRecipes();
    setRecipes(savedRecipes);
  }, []);

  const handleDeleteRecipe = (recipeId: string) => {
    setRecipeToDelete(recipeId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (recipeToDelete) {
      deleteRecipe(recipeToDelete);
      setRecipes(recipes.filter(recipe => recipe.id !== recipeToDelete));
      toast({
        title: "Recipe Deleted",
        description: "Your recipe has been permanently removed.",
      });
    }
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  const handleEditRecipe = (recipeId: string) => {
    loadRecipe(recipeId);
    // Pass the recipe ID in the URL to force a reload of the recipe
    router.push(`/ingredient-builder?id=${recipeId}`);
  };

  const handleExportRecipe = (recipe: SavedRecipe) => {
    const dataStr = JSON.stringify(recipe.data.recipe, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `${recipe.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Saved Recipes</h1>
          <p className="text-gray-500">
            {recipes.length === 0 
              ? "You don't have any saved recipes yet." 
              : `You have ${recipes.length} saved recipe${recipes.length === 1 ? '' : 's'}.`}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Note: Recipes are stored in your browser's local storage and will be lost if you clear your browser data.
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button asChild>
            <Link href="/ingredient-builder">
              <Plus className="mr-2 h-4 w-4" />
              New Recipe
            </Link>
          </Button>
        </div>
      </div>

      {recipes.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-gray-100 p-3">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold">No Recipes Found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't created any recipes yet. Start by creating a new recipe using the ingredient builder.
            </p>
            <Button asChild className="mt-4">
              <Link href="/ingredient-builder">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Recipe
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 truncate">{recipe.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Last edited {formatDistanceToNow(recipe.lastModified, { addSuffix: true })}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Serving Size:</span>
                    <span>{recipe.data.recipe.servingSize}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ingredients:</span>
                    <span>{recipe.data.recipe.ingredients.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Calories:</span>
                    <span>{recipe.data.recipe.totalNutrition.calories.toFixed(0)} kcal</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => handleEditRecipe(recipe.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleExportRecipe(recipe)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDeleteRecipe(recipe.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your recipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
