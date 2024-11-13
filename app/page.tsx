"use client";

import { useState } from "react";
import { NutritionForm } from "./components/nutrition-form";
import { USNutritionLabel } from "./components/us-nutrition-label";
import { EUNutritionLabel } from "./components/eu-nutrition-label";
import { IndianNutritionalLabel } from "./components/IndianNutritionalLabel";
import { CanadaNutritionLabel } from "./components/canada-nutrition-label";
import { NutritionData, LabelFormat } from "./types/nutrition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { labelInfo } from "./labelInfo";

export default function Home() {
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [format, setFormat] = useState<LabelFormat>("US");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSubmit = (data: NutritionData) => {
    setNutritionData(data);
  };

  const downloadLabel = async () => {
    const element = document.getElementById("nutrition-label");
    if (!element || isDownloading) return;

    try {
      setIsDownloading(true);

      // Define the desired DPI for printing
      const desiredDPI = 300;
      // Calculate scale factor (assuming screen DPI is 96, which is common for many displays)
      const scaleFactor = desiredDPI / 96;

      const width = element.offsetWidth * scaleFactor;
      const height = element.offsetHeight * scaleFactor;

      const dataUrl = await htmlToImage.toPng(element, {
        width: width,
        height: height,
        style: {
          transform: `scale(${scaleFactor})`,
          transformOrigin: 'top left',
          width: `${element.offsetWidth}px`,
          height: `${element.offsetHeight}px`,
        },
        quality: 1.0,
      });

      const link = document.createElement("a");
      link.download = `nutrition-label-${format.toLowerCase()}-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const labelComponents = {
    US: USNutritionLabel,
    EU: EUNutritionLabel,
    INDIAN: IndianNutritionalLabel,
    CANADA: CanadaNutritionLabel,
    // Add more label components here as you create them
  };

  const LabelComponent = labelComponents[format];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Nutrition Label Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Enter Nutrition Data</h2>
            <NutritionForm onSubmit={handleSubmit} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Label Preview</h2>
            </div>

            {nutritionData ? (
              <div className="flex flex-col items-center">
                <div className="w-full mb-6 flex justify-between items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {format} Format <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {Object.keys(labelComponents).map((key) => (
                        <DropdownMenuItem key={key} onSelect={() => setFormat(key as LabelFormat)}>
                          {key} Format
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    onClick={downloadLabel}
                    variant="outline"
                    disabled={isDownloading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Generating..." : "Download High-Res"}
                  </Button>
                </div>

                <div className="flex justify-center">
                  {LabelComponent && <LabelComponent data={nutritionData} />}
                </div>

                <div className="mt-8 w-full max-w-2xl">
                  <h2 className="text-2xl font-bold mb-4">{labelInfo[format].title}</h2>
                  <p className="mb-4">{labelInfo[format].description}</p>
                  <h3 className="text-xl font-semibold mb-2">Key Features:</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {labelInfo[format].keyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="italic">{labelInfo[format].regulatoryBody}</p>
                </div>
              </div>

            ) : (
              <div className="text-center text-gray-500">
                Fill out the nutrition form to generate a label preview
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}