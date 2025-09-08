import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Leaf } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full text-center gradient-card shadow-medium">
        <CardContent className="py-12">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Leaf className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-primary hover:opacity-90 transition-smooth"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
