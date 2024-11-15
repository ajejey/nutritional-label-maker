# 🏷️ Nutrition Label Maker

A professional-grade nutrition label generator built with Next.js 13, featuring real-time calculations and multiple international formats. Perfect for food manufacturers and businesses.

[![Next.js](https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![USDA API](https://img.shields.io/badge/USDA-API-green?style=for-the-badge)](https://fdc.nal.usda.gov/)

## ✨ Features

### 🛠️ Technical Highlights

- **Modern Tech Stack**
  - Next.js 13 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Shadcn/UI components
  - Server-side rendering
  - API route handlers

- **Performance & SEO**
  - Server components optimization
  - Dynamic metadata generation
  - Sitemap automation
  - Mobile responsiveness
  - Image optimization

- **State Management & Data Flow**
  - React hooks architecture
  - Custom utility functions
  - Type-safe API integration
  - Real-time calculations

### 💡 Core Functionality

- **Dual Generation Methods**
  - Ingredient Nutrition Builder
    - USDA database integration
    - Automatic calculations
    - Ingredient management
  - Direct Generator
    - Manual value input
    - Quick label creation
    - Format switching

- **International Standards**
  - US FDA Nutrition Facts
  - EU Energy Labels
  - Canadian NFt
  - Australian NIP
  - Indian Labels

- **Professional Features**
  - High-resolution exports
  - Print-ready quality
  - Multiple serving sizes
  - Regulatory compliance
  - Error handling

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/nutrition-label-maker.git
   cd nutrition-label-maker
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Create .env.local and add:
   USDA_FOOD_DATA_API_KEY=your_api_key
   ```

3. **Development**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

4. **Build & Start**
   ```bash
   npm run build
   npm start
   ```

## 🏗️ Architecture

```
project/
├── app/                    # Next.js 13 App Router
│   ├── ingredient-builder/ # Ingredient-based generation
│   ├── generator/         # Direct label generation
│   └── components/        # Reusable components
├── lib/                   # Utility functions
├── styles/               # Global styles
└── public/              # Static assets
```

## 🛡️ Technical Decisions

- **Next.js 13**: Chosen for its server components, improved performance, and SEO capabilities
- **TypeScript**: Ensures type safety and better developer experience
- **Tailwind CSS**: Provides rapid styling with utility classes and excellent responsive design
- **Shadcn/UI**: Offers high-quality, customizable components with excellent accessibility
- **USDA API**: Provides reliable, up-to-date nutrition data for accurate calculations


## 🔄 Future Enhancements

- User authentication
- Label template customization
- Batch processing
- PDF export options
- Additional label formats

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

<div align="center">

**[Live Demo](https://nutrition-label-maker.vercel.app) | [Documentation](docs/) | [Report Bug](issues/) | [Request Feature](issues/)**

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

</div>
