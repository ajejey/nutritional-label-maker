'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, FileText, Plus, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { SaveIndicator, SaveStatus } from '../save-indicator/save-indicator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SavedRecipe, getSavedRecipes, loadRecipe, createNewRecipe } from '../../lib/local-storage';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface RecipeHeaderProps {
  recipeName: string;
  onNameChange: (name: string) => void;
  saveStatus: SaveStatus;
  currentRecipeId: string | undefined;
}

export function RecipeHeader({ 
  recipeName, 
  onNameChange, 
  saveStatus, 
  currentRecipeId 
}: RecipeHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(recipeName);
  const [recentRecipes, setRecentRecipes] = useState<SavedRecipe[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load recent recipes
    const allRecipes = getSavedRecipes();
    // Sort by last modified and take the 5 most recent
    const recent = [...allRecipes]
      .sort((a, b) => b.lastModified - a.lastModified)
      .slice(0, 5);
    setRecentRecipes(recent);
  }, []);

  useEffect(() => {
    setEditedName(recipeName);
  }, [recipeName]);

  const handleNameSubmit = () => {
    if (editedName.trim()) {
      onNameChange(editedName.trim());
    } else {
      setEditedName(recipeName); // Reset to original if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setEditedName(recipeName);
      setIsEditing(false);
    }
  };

  const handleLoadRecipe = (recipeId: string) => {
    loadRecipe(recipeId);
    router.refresh(); // Refresh the page to load the new recipe
  };

  const handleNewRecipe = () => {
    createNewRecipe();
    // Force a full page reload to ensure the new recipe is loaded
    window.location.href = '/ingredient-builder';
  };

  return (
    <div className="sticky top-0 z-10 bg-gray-300 border-b border-gray-200 mb-4 py-3 px-4 shadow-sm rounded-s">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={handleKeyDown}
                className="max-w-xs font-semibold"
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setEditedName(recipeName);
                  setIsEditing(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <h1 
              className="text-xl font-semibold truncate cursor-pointer hover:underline" 
              onClick={() => setIsEditing(true)}
              title="Click to edit recipe name"
            >
              {recipeName || "Untitled Recipe"}
            </h1>
          )}
          
          <SaveIndicator status={saveStatus} />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-3">
            <Button asChild variant="outline">
              <Link href="/saved-recipes">
                <FileText className="h-4 w-4 mr-2" />
                My Recipes
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Recipe
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Recent Recipes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {recentRecipes.map(recipe => (
                  <DropdownMenuItem 
                    key={recipe.id}
                    onClick={() => handleLoadRecipe(recipe.id)}
                    disabled={recipe.id === currentRecipeId}
                    className={recipe.id === currentRecipeId ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {recipe.name}
                  </DropdownMenuItem>
                ))}
                {recentRecipes.length === 0 && (
                  <DropdownMenuItem disabled>No recent recipes</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleNewRecipe}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Recipe
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/saved-recipes">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Recipes
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Recipe Options</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/saved-recipes">
                    <FileText className="h-4 w-4 mr-2" />
                    My Saved Recipes
                  </Link>
                </Button>
                <Button onClick={handleNewRecipe} variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Recipe
                </Button>
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Recent Recipes</h3>
                  <div className="space-y-1">
                    {recentRecipes.map(recipe => (
                      <Button
                        key={recipe.id}
                        variant="ghost"
                        className={`w-full justify-start ${recipe.id === currentRecipeId ? "bg-gray-100" : ""}`}
                        onClick={() => handleLoadRecipe(recipe.id)}
                        disabled={recipe.id === currentRecipeId}
                      >
                        {recipe.name}
                      </Button>
                    ))}
                    {recentRecipes.length === 0 && (
                      <p className="text-sm text-gray-500 px-2">No recent recipes</p>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
