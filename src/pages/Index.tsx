import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, TreePine, Recycle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Citizens working together to improve their neighborhoods'
    },
    {
      icon: TreePine,
      title: 'Environmental Focus',
      description: 'Prioritizing green solutions and sustainable practices'
    },
    {
      icon: Recycle,
      title: 'Issue Tracking',
      description: 'Real-time monitoring and resolution of civic problems'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
            <div className="bg-primary/10 p-4 rounded-full">
              <Leaf className="w-16 h-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 leading-tight">
            Clean & Green
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Technology
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Empowering communities to report, track, and resolve civic issues together. 
            Building cleaner, greener cities for everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-medium px-8 py-4 text-lg"
            >
              Get Started
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 text-lg transition-smooth hover:shadow-soft"
            >
              View Issues
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
            How We Make a Difference
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center gradient-card shadow-soft transition-smooth hover:shadow-medium">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto gradient-card shadow-medium">
            <CardContent className="py-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Make a Change?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of citizens already making their communities better.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/login')}
                className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-medium px-8 py-4 text-lg"
              >
                Start Reporting Issues
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
