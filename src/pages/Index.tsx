import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">Your App</h1>
            <Button variant="outline" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground shadow-elegant">
              ✨ Ready to build something amazing
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Your Blank Canvas
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A beautiful foundation with modern design system, components, and everything you need to start building.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                Start Building
              </Button>
              <Button variant="outline" size="lg">
                View Components
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 text-left shadow-elegant hover:shadow-glow transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Modern Stack</h3>
              <p className="text-muted-foreground text-sm">
                Built with React, TypeScript, Tailwind CSS, and shadcn/ui components.
              </p>
            </Card>

            <Card className="p-6 text-left shadow-elegant hover:shadow-glow transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">🎨</span>
              </div>
              <h3 className="font-semibold mb-2">Design System</h3>
              <p className="text-muted-foreground text-sm">
                Complete design tokens, gradients, and semantic color system ready to use.
              </p>
            </Card>

            <Card className="p-6 text-left shadow-elegant hover:shadow-glow transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">🚀</span>
              </div>
              <h3 className="font-semibold mb-2">Ready to Deploy</h3>
              <p className="text-muted-foreground text-sm">
                Optimized build configuration and deployment-ready setup out of the box.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground text-sm">
            Built with ❤️ using modern web technologies
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
