// app/labelInfo.ts

export const labelInfo = {
  US: {
    title: "US FDA Nutrition Facts Label",
    description: "The US FDA Nutrition Facts label is required on most packaged foods in the United States. It provides detailed nutritional information to help consumers make informed food choices.",
    keyFeatures: [
      "Serving size and servings per container",
      "Calories per serving",
      "Mandatory nutrients like total fat, saturated fat, trans fat, cholesterol, sodium, total carbohydrate, dietary fiber, total sugars, added sugars, and protein",
      "Percent Daily Value (%DV) based on a 2,000 calorie diet",
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
};