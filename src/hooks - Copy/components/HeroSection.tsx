import { Card } from '@/components/ui/card';

export const HeroSection = () => {
  return (
    <Card className="text-center py-16 px-8 shadow-medium gradient-card border-0">
      <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
        Report Track Improve
        <span className="block bg-gradient-primary bg-clip-text text-transparent">
          Together
        </span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
        Help make your city cleaner and greener by reporting civic issues.
      </p>
      <p className="text-muted-foreground">
        Together, we can create better communities for everyone.
      </p>
    </Card>
  );
};