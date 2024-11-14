import { Globe2, ShieldCheck, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Create Professional Nutrition Labels
              <span className="block text-primary">in Seconds</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Generate FDA-compliant nutrition facts labels and international nutrition declarations instantly. 
              Perfect for food manufacturers, restaurants, and health professionals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/generator">
                <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-secondary" id="features">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for compliant nutrition labels
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
              <div className="flex flex-col items-start">
                <div className="rounded-lg bg-primary p-2 ring-1 ring-primary/10">
                  <Globe2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  International Formats
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  Support for US, EU, Canadian, Indian, and Australian nutrition label formats. Switch between formats with a single click.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-lg bg-primary p-2 ring-1 ring-primary/10">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  Instant Generation
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  Create professional nutrition labels in seconds with our easy-to-use form and real-time preview.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-lg bg-primary p-2 ring-1 ring-primary/10">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  Compliance Ready
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  All labels are designed to meet current regulatory requirements for their respective regions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-16">
              Create Your Nutrition Label in 3 Simple Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Enter Your Data",
                description: "Input your product's nutritional information using our simple form.",
              },
              {
                step: "2",
                title: "Choose Format",
                description: "Select from US, EU, Canadian, Indian, or Australian label formats.",
              },
              {
                step: "3",
                title: "Download & Use",
                description: "Get your high-resolution nutrition label ready for packaging.",
              },
            ].map((item) => (
              <div key={item.step} className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Our Nutrition Label Generator?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Compliant with FDA, EU, and international standards",
              "High-resolution output suitable for packaging",
              "Real-time preview of your nutrition label",
              "Multiple format support for global markets",
              "Easy-to-use interface with guided inputs",
              "Instant downloads in various formats",
              "Regular updates to match regulation changes",
              "Accurate calculations and formatting",
              "Time and cost-effective solution",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {[
              {
                q: "Is this nutrition label generator free to use?",
                a: "Yes, our nutrition label generator is completely free to use. Create and download as many labels as you need.",
              },
              {
                q: "Are the labels FDA compliant?",
                a: "Yes, our US nutrition labels follow all FDA guidelines and requirements for nutrition facts panels.",
              },
              {
                q: "Can I use these labels for my food products?",
                a: "Yes, you can use these labels for your food products. However, we recommend verifying the information with your local food safety authority.",
              },
              {
                q: "What file format do I receive?",
                a: "You receive a high-resolution PNG file that's suitable for both digital use and print packaging.",
              },
              {
                q: "Do you support international formats?",
                a: "Yes, we support US, EU, Canadian, Indian, and Australian nutrition label formats, with more coming soon.",
              },
              {
                q: "How accurate are the calculations?",
                a: "Our calculator follows standard rounding rules and formatting guidelines for each region's requirements.",
              },
            ].map((faq, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to create your nutrition label?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
              Join thousands of food manufacturers and professionals who trust our nutrition label generator.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/generator">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}