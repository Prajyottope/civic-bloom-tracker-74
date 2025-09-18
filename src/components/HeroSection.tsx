import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export const HeroSection = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="text-center py-16 px-8 shadow-medium gradient-card border-0">
      <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
        {t('hero.title')}
        <span className="block bg-gradient-primary bg-clip-text text-transparent">
          {t('hero.together')}
        </span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
        {t('hero.subtitle')}
      </p>
      <p className="text-muted-foreground">
        {t('hero.community')}
      </p>
    </Card>
  );
};