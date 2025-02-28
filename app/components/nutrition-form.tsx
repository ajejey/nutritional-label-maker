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
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const nutritionSchema = z.object({
  servingSize: z.union([
    z.coerce.number().min(0.1, "Serving size must be greater than 0"),
    z.string().regex(/^(about\s*)?(\d+(\.\d+)?|\d+\/\d+)\s*(cup|g|oz|ml|piece|slice|tablespoon|medium|small|large)?$/i, "Oops! Invalid serving size. Try formats like:\n• 1 cup\n• 2 oz\n• 1/2 slice\n• about 50 g\n\nInclude a number and optional unit (cup, g, oz, etc.)")
  ]),
servingsPerContainer: z.union([
  z.coerce.number().min(0.1, "Servings per container must be greater than 0"),
  z.string().regex(
    /^(about\s*)?(\d+(\.\d+)?|\d+(-\d+)?)$/i, 
    "Oops! Invalid servings per container. Try formats like:\n• 4\n• about 6\n• 3-4\n\nEnter a whole number or range"
  )
]),
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

type FormField = {
  name: keyof NutritionData;
  label: string;
};

const formFields: Record<string, FormField[]> = {
  serving: [
    { name: "servingSize", label: "Serving Size" },
    { name: "servingsPerContainer", label: "Servings Per Container" },
  ],
  mainNutrients: [
    { name: "calories", label: "Calories" },
    { name: "totalFat", label: "Total Fat (g)" },
    { name: "saturatedFat", label: "Saturated Fat (g)" },
    { name: "transFat", label: "Trans Fat (g)" },
    { name: "cholesterol", label: "Cholesterol (mg)" },
    { name: "sodium", label: "Sodium (mg)" },
  ],
  carbs: [
    { name: "totalCarbohydrates", label: "Total Carbohydrates (g)" },
    { name: "dietaryFiber", label: "Dietary Fiber (g)" },
    { name: "sugars", label: "Sugars (g)" },
    { name: "protein", label: "Protein (g)" },
  ],
  vitamins: [
    { name: "vitaminD", label: "Vitamin D (mcg)" },
    { name: "calcium", label: "Calcium (mg)" },
    { name: "iron", label: "Iron (mg)" },
    { name: "potassium", label: "Potassium (mg)" },
  ],
};

const ServingInputGuide = ({ type }: { type: 'size' | 'container' }) => {
  const sizeExamples = [
    "1 cup",
    "2 oz",
    "50 g",
    "1/2 slice",
    "about 2 tablespoons"
  ];

  const containerExamples = [
    "4 servings",
    "about 6 servings",
    "3-4 servings"
  ];

  const examples = type === 'size' ? sizeExamples : containerExamples;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-help">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs" side="right">
          <div className="space-y-2">
            <p className="font-bold">
              {type === 'size'
                ? "Serving Size Formats"
                : "Servings Per Container Formats"}
            </p>
            <ul className="list-disc pl-4 text-sm">
              <li>Numeric values (1, 1.5, 1/2)</li>
              <li>With units (cup, oz, g, ml)</li>
              <li>Optional &quot;about&quot; prefix</li>
            </ul>
            <p className="text-sm font-semibold mt-2">Examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, index) => (
                <span
                  key={index}
                  className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function NutritionForm({ onSubmit }: NutritionFormProps) {
  const form = useForm<NutritionData>({
    resolver: zodResolver(nutritionSchema),
    defaultValues: {
      servingSize: 1,
      servingsPerContainer: 8,
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

  const renderField = (field: FormField) => (
    <FormField
      key={field.name}
      control={form.control}
      name={field.name}
      render={({ field: inputField }) => (
        <FormItem>
          <div className="flex items-center space-x-2">
            <FormLabel>{field.label}</FormLabel>
            {(field.name === "servingSize" || field.name === "servingsPerContainer") && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-bold">
                        {field.name === 'servingSize'
                          ? "Serving Size Formats"
                          : "Servings Per Container Formats"}
                      </p>
                      <ul className="list-disc pl-4 text-sm">
                        <li>Numeric values (1, 1.5, 1/2)</li>
                        <li>With units (cup, oz, g, ml)</li>
                        <li>Optional &quot;about&quot; prefix</li>
                      </ul>
                      <p className="text-sm font-semibold mt-2">Examples:</p>
                      <div className="flex flex-wrap gap-2">
                        {(field.name === 'servingSize'
                          ? ["1 cup", "2 oz", "50 g", "1/2 slice", "about 2 tablespoons"]
                          : ["4 servings", "about 6 servings", "3-4 servings"]
                        ).map((example, index) => (
                          <span
                            key={index}
                            className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <FormControl>
            <Input
              type={field.name === "servingSize" || field.name === "servingsPerContainer" ? "text" : "number"}
              min="0"
              step="0.1"
              {...inputField}
              onChange={(e) =>
                inputField.onChange(
                  field.name === "servingSize" || field.name === "servingsPerContainer"
                    ? e.target.value
                    : parseFloat(e.target.value) || 0
                )
              }
              placeholder={
                field.name === "servingSize" || field.name === "servingsPerContainer"
                  ? (field.name === 'servingSize' 
                    ? "e.g., 1 cup, 2 oz, 50 g" 
                    : "e.g., 4 servings, about 6")
                  : undefined
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-4 border-none">
          <h3 className="font-semibold mb-3">Serving Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {formFields.serving.map((field) => renderField(field))}
          </div>
        </Card>

        <Card className="p-4 border-none">
          <h3 className="font-semibold mb-3">Main Nutrients</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formFields.mainNutrients.map((field) => renderField(field))}
          </div>
        </Card>

        <Card className="p-4 border-none">
          <h3 className="font-semibold mb-3">Carbohydrates & Protein</h3>
          <div className="grid grid-cols-2 gap-4">
            {formFields.carbs.map((field) => renderField(field))}
          </div>
        </Card>

        <Card className="p-4 border-none">
          <h3 className="font-semibold mb-3">Vitamins & Minerals</h3>
          <div className="grid grid-cols-2 gap-4">
            {formFields.vitamins.map((field) => renderField(field))}
          </div>
        </Card>

        <Button type="submit" className="w-full">
          Generate Label
        </Button>
      </form>
    </Form>
  );
}