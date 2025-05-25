'use client';

import { LabelFormat, NutritionData } from "@/app/types/nutrition";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, Globe, Check, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { USNutritionLabel } from "../us-nutrition-label";
import { EUNutritionLabel } from "../eu-nutrition-label";
import { IndianNutritionalLabel } from "../IndianNutritionalLabel";
import { CanadaNutritionLabel } from "../canada-nutrition-label";
import { AustraliaNutritionLabel } from "../australia-nutrition-label";
import { USDualColumnLabel } from "../us-dual-column-label";
import { USTabularLabel } from "../us-tabular-label";
import { USLinearLabel } from "../us-linear-label";
import { USSimplifiedLabel } from "../us-simplified-label";
import { USVerticalCondensedLabel } from "../us-vertical-condensed-label";
import { USBilingualLabel } from "../us-bilingual-label";
import { USAggregateLabel } from "../us-aggregate-label";
import * as htmlToImage from "html-to-image";
import { labelInfo } from "@/app/labelInfo";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LabelPreviewProps {
  nutritionData: NutritionData;
  className?: string;
  showInfo?: boolean;
  compact?: boolean;
  defaultFormat?: LabelFormat;
  onFormatChange?: (format: LabelFormat) => void;
}

const LabelPreview = ({ 
  nutritionData,
  className,
  showInfo = true,
  compact = false,
  defaultFormat = "US",
  onFormatChange
}: LabelPreviewProps) => {
  const [format, setFormat] = useState<LabelFormat>(defaultFormat);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState(5);
  
  // Reset download complete status after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (downloadComplete) {
      timer = setTimeout(() => {
        setDownloadComplete(false);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [downloadComplete]);

  const handleFormatChange = (newFormat: LabelFormat) => {
    setFormat(newFormat);
    onFormatChange?.(newFormat);
  };

  const downloadLabel = async () => {
    const element = document.getElementById("nutrition-label");
    if (!element || isDownloading) {
      console.log("Download aborted: element not found or already downloading");
      return;
    }

    try {
      console.log("Starting download process...");
      setIsDownloading(true);
      const desiredDPI = 300;
      const scaleFactor = desiredDPI / 96;
      const width = element.offsetWidth * scaleFactor;
      const height = element.offsetHeight * scaleFactor;
      
      console.log(`Generating image with dimensions: ${width}x${height}, scale factor: ${scaleFactor}`);
      
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
      
      console.log("Image generated successfully, creating download link");
      
      const link = document.createElement("a");
      link.download = `nutrition-label-${format.toLowerCase()}-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      
      console.log("Download initiated");
      
      // Show download complete status
      setDownloadComplete(true);
      
      // Check if user has donated in the last month
      const lastDonationDate = localStorage.getItem('lastDonationDate');
      const showDonation = !lastDonationDate || 
        (new Date().getTime() - parseInt(lastDonationDate)) > 30 * 24 * 60 * 60 * 1000;
      
      if (showDonation) {
        console.log("Preparing to show donation dialog");
        setTimeout(() => {
          setShowDonationDialog(true);
        }, 1000);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      console.log("Download process completed");
      setIsDownloading(false);
    }
  };
  
  const handleDonation = () => {
    // Save donation date to localStorage
    localStorage.setItem('lastDonationDate', new Date().getTime().toString());
    // Open PayPal donation link in a new tab
    window.open(`https://paypal.me/bubbletrends/${donationAmount}USD`, '_blank');
    setShowDonationDialog(false);
  };

  const labelComponents: Record<LabelFormat, React.ComponentType<{data: NutritionData}>> = {
    US: USNutritionLabel,
    US_SIMPLIFIED: USSimplifiedLabel,
    US_VERTICAL_CONDENSED: USVerticalCondensedLabel,
    US_DUAL_COLUMN: USDualColumnLabel,
    US_BILINGUAL: USBilingualLabel,
    US_LINEAR: USLinearLabel,
    US_TABULAR: USTabularLabel,
    // US_AGGREGATE: USAggregateLabel,
    EU: EUNutritionLabel,
    INDIAN: IndianNutritionalLabel,
    CANADA: CanadaNutritionLabel,
    AUSTRALIA: AustraliaNutritionLabel,
  };

  const LabelComponent = labelComponents[format];

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="p-2 border-none">
        {/* Header with Format Selection and Download */}
        <div className="flex items-center justify-between mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 hover:text-primary-foreground">
                <Globe className="w-4 h-4" />
                {format.replace(/US_/g, 'US ').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Format
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {Object.keys(labelComponents).map((key) => {
                // Format the key to be more presentable
                const formattedKey = key
                  .replace(/US_/g, 'US ')
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                
                return (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleFormatChange(key as LabelFormat)}
                    className="hover:text-white focus:text-white"
                  >
                   {`${formattedKey} Format`}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={downloadLabel}
            variant={downloadComplete ? "outline" : "default"}
            disabled={isDownloading}
            className={cn(
              "relative transition-all",
              downloadComplete ? "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800" : "hover:text-white"
            )}
          >
            {isDownloading ? (
              <>
                <div className="animate-spin mr-2">
                  <Download className="h-4 w-4" />
                </div>
                Generating...
              </>
            ) : downloadComplete ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Downloaded
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>
        </div>

        {/* Label Preview */}
        <div id="nutrition-label" className="flex justify-center bg-white rounded-lg">
          {LabelComponent && <LabelComponent data={nutritionData} />}
        </div>

        {/* Label Information */}
        {showInfo && (
          <div className="mt-6 pt-6 border-t">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{labelInfo[format].title}</h2>
                <Badge variant="secondary">{format}</Badge>
              </div>
              <p className="text-gray-600">{labelInfo[format].description}</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Download Format</h4>
                  <p className="text-sm text-gray-500">PNG with transparent background</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Resolution</h4>
                  <p className="text-sm text-gray-500">300 DPI for print-ready quality</p>
                </Card>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {/* Donation Dialog */}
      <Dialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Support Our Project</DialogTitle>
            <DialogDescription className="text-center">
              Your label has been downloaded successfully!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Heart className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-center text-sm text-gray-600 max-w-xs mx-auto mb-6">
              If you find this tool helpful, please consider supporting us with a small contribution.
            </p>
            
            <div className="w-full max-w-xs mb-6">
              <Label htmlFor="donation-amount" className="text-sm mb-2 block">Choose an amount</Label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[3, 5, 10].map((amount) => (
                  <Button 
                    key={amount}
                    type="button"
                    variant={donationAmount === amount ? "default" : "outline"}
                    onClick={() => setDonationAmount(amount)}
                    className="h-10"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <div className="flex items-center">
                <span className="bg-muted px-3 h-10 flex items-center border rounded-l-md">$</span>
                <Input
                  id="donation-amount"
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="rounded-l-none h-10"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowDonationDialog(false)}
              className="w-full sm:w-auto"
            >
              No Thanks
            </Button>
            <Button 
              onClick={handleDonation}
              className="w-full sm:w-auto"
            >
              Donate via PayPal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LabelPreview;