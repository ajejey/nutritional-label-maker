// app/labelInfo.ts

export const labelInfo = {
  US: {
    title: "US FDA Nutrition Facts Label (Standard)",
    description: "The standard US FDA Nutrition Facts label is required on most packaged foods in the United States. It provides detailed nutritional information in a vertical format.",
    keyFeatures: [
      "Serving size and servings per container",
      "Calories per serving prominently displayed",
      "Mandatory nutrients with amounts and % Daily Value",
      "Footnote explaining Daily Values based on a 2,000 calorie diet",
    ],
    regulatoryBody: "Regulated by the U.S. Food and Drug Administration (FDA)",
  },
  US_DUAL_COLUMN: {
    title: "US FDA Dual Column Label",
    description: "The dual column format shows nutrition information per serving and per package. Required when a package contains 2-3 servings and could reasonably be consumed in one sitting.",
    keyFeatures: [
      "Side-by-side columns for 'Per Serving' and 'Per Container'",
      "Helps consumers understand nutrition when consuming entire package",
      "Same nutrients as standard format but in dual presentation",
      "Required for packages with 2-3 servings that could be consumed at once",
    ],
    regulatoryBody: "Regulated by the U.S. Food and Drug Administration (FDA)",
  },
  US_TABULAR: {
    title: "US FDA Tabular Format",
    description: "A more condensed horizontal arrangement of the Nutrition Facts, used for products with limited label space but not severely restricted.",
    keyFeatures: [
      "Horizontal arrangement of nutrition information",
      "Maintains all required nutrient information",
      "Used for products with moderate space limitations",
      "Same font size requirements as standard format",
    ],
    regulatoryBody: "Regulated by the U.S. Food and Drug Administration (FDA)",
  },
  US_LINEAR: {
    title: "US FDA Linear Format",
    description: "An ultra-condensed single-line or few-line format for very small packages with extremely limited space, such as small candies or gum.",
    keyFeatures: [
      "Condensed into a single line or few lines",
      "For very small packages (less than 40 square inches available)",
      "Contains abbreviated information with core nutrients",
      "May use smaller font sizes than standard format",
    ],
    regulatoryBody: "Regulated by the U.S. Food and Drug Administration (FDA)",
  },
  US_SIMPLIFIED: {
    title: "US FDA Simplified Format",
    description: "For products with insignificant amounts of 7 or more of the mandatory nutrients. Allows omission of those nutrients from the label.",
    keyFeatures: [
      "Shortened format omitting nutrients present in insignificant amounts",
      "Must include statement 'Not a significant source of [omitted nutrients]'",
      "Maintains same structure as standard format for included nutrients",
      "Used for products like plain coffee, tea, some spices, etc.",
    ],
    regulatoryBody: "Regulated by the U.S. Food and Drug Administration (FDA)",
  },
  US_AGGREGATE: {
    title: "US FDA Aggregate Format",
    description: "For variety packs containing different food items. Shows nutrition information for each food item separately.",
    keyFeatures: [
      "Separate nutrition information for each distinct food in a multi-unit package",
      "Used for variety packs, assortments, or multi-component meals",
      "May use any of the other formats for each component",
      "Clearly identifies which information applies to which food",
    ],
    regulatoryBody: "Regulated by the U.S. Food and Drug Administration (FDA)",
  },
  US_BILINGUAL: {
    title: "US FDA Bilingual Format",
    description: "Presents nutrition information in two languages, typically English and Spanish, to serve diverse consumer populations.",
    keyFeatures: [
      "Dual-language presentation (typically English and Spanish)",
      "All required elements presented in both languages",
      "May use any of the other formats as base structure",
      "Common in areas with large Spanish-speaking populations",
    ],
    regulatoryBody: "Regulated by the U.S. Food and Drug Administration (FDA)",
  },
  US_VERTICAL_CONDENSED: {
    title: "US FDA Vertical Condensed Format",
    description: "A more compact version of the standard vertical format, used when space is limited but not severely restricted.",
    keyFeatures: [
      "Condensed version of standard vertical format",
      "Maintains all required nutrient information",
      "Used for products with moderate space limitations",
      "May use minimum required font sizes",
    ],
    regulatoryBody: "Regulated by the U.S. Food and Drug Administration (FDA)",
  },
  EU: {
    title: "EU Nutrition Declaration",
    description: "The EU nutrition label follows regulations set by the European Food Safety Authority. It provides consistent nutritional information across European Union member states.",
    keyFeatures: [
      "Energy value in both kilojoules (kJ) and kilocalories (kcal)",
      "Amounts of fat, saturates, carbohydrate, sugars, protein and salt",
      "Voluntary declaration of mono-unsaturates, polyunsaturates, polyols, starch, fibre, vitamins and minerals",
      "Information typically provided per 100g or 100ml",
    ],
    regulatoryBody: "Regulated by the European Food Safety Authority (EFSA)",
  },
  INDIAN: {
    title: "Indian Nutrition Label",
    description: "Indian nutrition labels are regulated by the Food Safety and Standards Authority of India (FSSAI). They provide essential nutritional information for packaged foods sold in India.",
    keyFeatures: [
      "Energy value in kcal",
      "Amounts of protein, carbohydrate, and fat in grams",
      "Information on total sugars and added sugars",
      "Percent contribution to Recommended Dietary Allowance (RDA)",
    ],
    regulatoryBody: "Regulated by the Food Safety and Standards Authority of India (FSSAI)",
  },
  CANADA: {
    title: "Canadian Nutrition Facts Table",
    description: "The Canadian Nutrition Facts table is required on most prepackaged foods sold in Canada. It provides detailed nutritional information in both English and French.",
    keyFeatures: [
      "Serving size and calories prominently displayed",
      "Core nutrients with their amounts and % Daily Value",
      "Bilingual format (English and French)",
      "Footnote explaining % Daily Value",
    ],
    regulatoryBody: "Regulated by Health Canada and the Canadian Food Inspection Agency (CFIA)",
  },
  AUSTRALIA: {
    title: "Australian Nutrition Information Panel (NIP)",
    description: "The Australian Nutrition Information Panel (NIP) is mandatory for most packaged foods in Australia and New Zealand. It follows the Food Standards Code requirements set by Food Standards Australia New Zealand (FSANZ).",
    keyFeatures: [
      "Mandatory display of serving size and servings per package",
      "Nutrient information displayed per serving and per 100g",
      "Core nutrients including energy (kJ), protein, total fat, saturated fat, carbohydrates, sugars, and sodium",
      "Based on average adult daily energy intake of 8700kJ",
    ],
    regulatoryBody: "Regulated by Food Standards Australia New Zealand (FSANZ)",
  },
};