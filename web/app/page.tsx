import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Zap, FileText, BarChart3, Users, Shield, Heart } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI Personalization",
    description: "Automatically personalize emails based on prospect data, company info, and recent activities."
  },
  {
    icon: FileText,
    title: "Smart Sequences",
    description: "Create multi-touch campaigns with intelligent timing and conditional logic."
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Track performance, optimize campaigns, and understand what drives responses."
  },
  {
    icon: Users,
    title: "Lead Management",
    description: "Organize prospects, track interactions, and manage your sales pipeline effectively."
  },
  {
    icon: Shield,
    title: "Deliverability",
    description: "Advanced email infrastructure ensures your messages reach the inbox, not spam."
  },
  {
    icon: Heart,
    title: "Template Library",
    description: "Access proven email templates and copy frameworks that convert."
  }
];

const stats = [
  { label: "Active Users", value: "10,000+" },
  { label: "Emails Sent", value: "2.5M+" },
  { label: "Response Rate", value: "89%" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-foreground">
            Supercharge Your{" "}
            <span className="relative inline-block">
              <span className="z-10 relative">Cold Outreach</span>
              <span className="absolute left-0 right-0 bottom-0 h-3 bg-warning/30 rounded"></span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Outfoundry automates your cold email campaigns with AI, smart sequencing, and beautiful analytics. Focus on closing, not chasing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg font-semibold">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg font-semibold">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="rounded-xl bg-card border border-border shadow-sm flex flex-col items-center py-8 px-4">
                <div className="text-4xl font-extrabold mb-2 text-primary">{stat.value}</div>
                <div className="text-muted-foreground text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
              Everything you need to{" "}
              <span className="relative inline-block">
                <span className="z-10 relative">scale your outreach</span>
                <span className="absolute left-0 right-0 bottom-0 h-2 bg-info/30 rounded"></span>
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From prospecting to follow-ups, we've got you covered with powerful automation tools.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={feature.title} className="p-8 rounded-2xl bg-card border border-border shadow-md flex flex-col items-start hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-md bg-primary">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
            Ready to transform your outreach?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of sales teams who've already scaled their cold email campaigns with Outfoundry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg font-semibold">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg font-semibold">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
