import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { MapView } from '@/components/MapView';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const MapViewPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Link>
            </Button>
            <h1 className="text-xl font-bold">{t('map.title')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <MapView />
      </main>
    </div>
  );
};

export default MapViewPage;