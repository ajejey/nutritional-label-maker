'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, BarChart3, Search, Utensils, Users, LogOut } from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timePeriod, setTimePeriod] = useState('7days');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/analytics?period=${timePeriod}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if unauthorized
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      console.log("data ", data);
      setAnalyticsData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Fetch data on initial load and when time period changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [timePeriod]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Prepare chart data for user activity
  const prepareActivityChartData = () => {
    if (!analyticsData?.activity || analyticsData.activity.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Actions',
            data: [],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
          },
          {
            label: 'Unique Users',
            data: [],
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
          }
        ]
      };
    }
    
    return {
      labels: analyticsData.activity.map((item: any) => formatDate(item.date)),
      datasets: [
        {
          label: 'Actions',
          data: analyticsData.activity.map((item: any) => item.count),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
        {
          label: 'Unique Users',
          data: analyticsData.activity.map((item: any) => item.uniqueUsers),
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
        }
      ]
    };
  };
  
  // Prepare chart data for top ingredients
  const prepareIngredientsChartData = () => {
    if (!analyticsData?.recipes?.topIngredients || analyticsData.recipes.topIngredients.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
            ],
          }
        ]
      };
    }
    
    return {
      labels: analyticsData.recipes.topIngredients.map((item: any) => item._id),
      datasets: [
        {
          data: analyticsData.recipes.topIngredients.map((item: any) => item.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
          ],
        }
      ]
    };
  };
  
  // Prepare chart data for top searches
  const prepareSearchesChartData = () => {
    if (!analyticsData?.searches?.topSearches || analyticsData.searches.topSearches.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Search Count',
            data: [],
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
          }
        ]
      };
    }
    
    return {
      labels: analyticsData.searches.topSearches.map((item: any) => item._id),
      datasets: [
        {
          label: 'Search Count',
          data: analyticsData.searches.topSearches.map((item: any) => item.count),
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
        }
      ]
    };
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">Last 24 Hours</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Recipe Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRecipe?.recipe?.name || 'Recipe Details'}</DialogTitle>
            <DialogDescription>
              Created on {selectedRecipe ? new Date(selectedRecipe.timestamp).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecipe && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Serving Size</h4>
                  <p>{selectedRecipe.recipe?.servingSize || 0} {selectedRecipe.recipe?.servingUnit || 'g'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Servings Per Container</h4>
                  <p>{selectedRecipe.recipe?.servingsPerContainer || 1}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Ingredients</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRecipe.recipe?.ingredients?.map((ingredient: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{ingredient.name}</TableCell>
                        <TableCell>{ingredient.quantity}</TableCell>
                        <TableCell>{ingredient.unit}</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">No ingredients found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {selectedRecipe.recipe?.totalNutrition && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Nutrition Information</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nutrient</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Calories</TableCell>
                        <TableCell>{selectedRecipe.recipe.totalNutrition.calories || 0}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Fat</TableCell>
                        <TableCell>{selectedRecipe.recipe.totalNutrition.totalFat || 0}g</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Saturated Fat</TableCell>
                        <TableCell>{selectedRecipe.recipe.totalNutrition.saturatedFat || 0}g</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Protein</TableCell>
                        <TableCell>{selectedRecipe.recipe.totalNutrition.protein || 0}g</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Carbohydrates</TableCell>
                        <TableCell>{selectedRecipe.recipe.totalNutrition.totalCarbohydrates || 0}g</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sugars</TableCell>
                        <TableCell>{selectedRecipe.recipe.totalNutrition.sugars || 0}g</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sodium</TableCell>
                        <TableCell>{selectedRecipe.recipe.totalNutrition.sodium || 0}mg</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading analytics data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.recipes?.count || 0}</div>
                <p className="text-xs text-muted-foreground">
                  By {analyticsData?.recipes?.uniqueUsers || 0} unique users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData?.searches?.count || 0}</div>
                <p className="text-xs text-muted-foreground">
                  By {analyticsData?.searches?.uniqueUsers || 0} unique users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Ingredients</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.recipes?.avgIngredientsPerRecipe 
                    ? analyticsData.recipes.avgIngredientsPerRecipe.toFixed(1) 
                    : '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per recipe
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Selection Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.searches?.selectionRate 
                    ? `${(analyticsData.searches.selectionRate * 100).toFixed(1)}%` 
                    : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Searches resulting in selection
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Tabs defaultValue="activity" className="mb-6">
            <TabsList>
              <TabsTrigger value="activity">User Activity</TabsTrigger>
              <TabsTrigger value="recipes">Recipe Analytics</TabsTrigger>
              <TabsTrigger value="searches">Search Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Over Time</CardTitle>
                  <CardDescription>
                    Daily activity and unique user counts
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <Line 
                    data={prepareActivityChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recipes" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Ingredients</CardTitle>
                    <CardDescription>
                      Most commonly used ingredients in recipes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Pie 
                      data={prepareIngredientsChartData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Recipes</CardTitle>
                    <CardDescription>
                      Latest recipes created by users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {analyticsData?.recent?.recipes?.length > 0 ? (
                        analyticsData.recent.recipes.map((recipeData: any, index: number) => {
                          const recipe = recipeData.recipe || {};
                          const ingredientCount = recipe.ingredients?.length || 0;
                          
                          return (
                            <div 
                              key={index} 
                              className="border-b pb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                              onClick={() => {
                                setSelectedRecipe(recipeData);
                                setDialogOpen(true);
                              }}
                            >
                              <div className="font-medium">{recipe.name || 'Untitled Recipe'}</div>
                              <div className="text-sm text-muted-foreground">
                                {recipe.servingSize || 0}{recipe.servingUnit || 'g'} | {ingredientCount} ingredients
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(recipeData.timestamp).toLocaleString()}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No recent recipes found
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="searches" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Search Queries</CardTitle>
                    <CardDescription>
                      Most common search terms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Bar 
                      data={prepareSearchesChartData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y' as const,
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Searches</CardTitle>
                    <CardDescription>
                      Latest search queries by users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {analyticsData?.recent?.searches?.length > 0 ? (
                        analyticsData.recent.searches.map((search: any, index: number) => (
                          <div key={index} className="border-b pb-2">
                            <div className="font-medium">&quot;{search.query || 'Unknown search'}&quot;</div>
                            <div className="text-sm text-muted-foreground">
                              {search.resultCount || 0} results
                              {search.selectedIngredient && (
                                <span> | Selected: {search.selectedIngredient.name || 'Unknown ingredient'}</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(search.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No recent searches found
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
