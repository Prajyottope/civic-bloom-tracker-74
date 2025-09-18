import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const MapViewPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Issues Map</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Issues Map</h1>
          <p className="text-muted-foreground mb-8">View all reported issues on the map</p>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-700 mb-2">
              Map Feature Coming Soon
            </h3>
            <p className="text-amber-700 mb-4">
              We're working on integrating the interactive map to show all reported issues. 
              This feature will be available soon with real-time issue locations and status updates.
            </p>
            <Button asChild>
              <Link to="/dashboard">View Issues List</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MapViewPage;