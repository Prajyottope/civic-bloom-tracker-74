import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const SimpleHeader = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          Clean & Green
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/map" className="text-foreground hover:text-primary transition-colors">
            {t('nav.mapView')}
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                {t('nav.dashboard')}
              </Link>
              <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
                {t('nav.profile')}
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          ) : user ? (
            <Button onClick={handleLogout} variant="outline">
              {t('nav.logout')}
            </Button>
          ) : (
            <>
              <Button asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/municipal-login">{t('nav.municipalLogin')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};