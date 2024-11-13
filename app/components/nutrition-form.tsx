"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NutritionData } from "../types/nutrition";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const nutritionSchema = z.object({
  servingSize: z.string().min(1, "Required"),
  servingsPerContainer: z.string().min(1, "Required"),
  calories: z.number().min(0),
  totalFat: z.number().min(0),
  saturatedFat: z.number().min(0),
  transFat: z.number().min(0),
  cholesterol: z.number().min(0),
  sodium: z.number().min(0),
  totalCarbohydrates: z.number().min(0),
  dietaryFiber: z.number().min(0),
  sugars: z.number().min(0),
  protein: z.number().min(0),
  vitaminD: z.number().min(0),
  calcium: z.number().min(0),
  iron: z.number().min(0),
  potassium: z.number().min(0),
});

interface NutritionFormProps {
  onSubmit: (data: NutritionData) => void;
}

export function NutritionForm({ onSubmit }: NutritionFormProps) {
  const form = useForm<NutritionData>({
    resolver: zodResolver(nutritionSchema),
    defaultValues: {
      servingSize: "1 cup",
      servingsPerContainer: "8",
      calories: 150,
      totalFat: 8,
      saturatedFat: 1,
      transFat: 0,
      cholesterol: 0,
      sodium: 100,
      totalCarbohydrates: 20,
      dietaryFiber: 4,
      sugars: 10,
      protein: 5,
      vitaminD: 0,
      calcium: 20,
      iron: 10,
      potassium: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="servingSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serving Size</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 100g" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="servingsPerContainer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servings Per Container</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 4" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {[
          { name: "calories", label: "Calories" },
          { name: "totalFat", label: "Total Fat (g)" },
          { name: "saturatedFat", label: "Saturated Fat (g)" },
          { name: "transFat", label: "Trans Fat (g)" },
          { name: "cholesterol", label: "Cholesterol (mg)" },
          { name: "sodium", label: "Sodium (mg)" },
          { name: "totalCarbohydrates", label: "Total Carbohydrates (g)" },
          { name: "dietaryFiber", label: "Dietary Fiber (g)" },
          { name: "sugars", label: "Sugars (g)" },
          { name: "protein", label: "Protein (g)" },
          { name: "vitaminD", label: "Vitamin D (mcg)" },
          { name: "calcium", label: "Calcium (mg)" },
          { name: "iron", label: "Iron (mg)" },
          { name: "potassium", label: "Potassium (mg)" },
        ].map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof NutritionData}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    {...formField}
                    onChange={(e) =>
                      formField.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" className="w-full">
          Generate Label
        </Button>
      </form>
    </Form>
  );
}