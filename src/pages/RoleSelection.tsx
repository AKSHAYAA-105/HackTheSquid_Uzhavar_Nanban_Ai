import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Store, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation, Language } from '@/lib/translations';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('english');
  const { t } = useTranslation(language);

  const roles = [
    {
      id: 'farmer',
      icon: Sprout,
      title: t('auth.farmer'),
      description: t('auth.farmer.desc'),
      theme: 'theme-farmer',
    },
    {
      id: 'vendor',
      icon: Store,
      title: t('auth.vendor'),
      description: t('auth.vendor.desc'),
      theme: 'theme-vendor',
    },
    {
      id: 'buyer',
      icon: ShoppingCart,
      title: t('auth.buyer'),
      description: t('auth.buyer.desc'),
      theme: 'theme-vendor',
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    navigate(`/auth/signup?role=${roleId}&lang=${language}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">{t('app.name')}</h1>
          <p className="text-xl text-muted-foreground">{t('app.tagline')}</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">{t('auth.selectLanguage')}</CardTitle>
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger className="w-full text-lg h-14">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="english" className="text-lg py-3">English</SelectItem>
                <SelectItem value="tamil" className="text-lg py-3">தமிழ்</SelectItem>
                <SelectItem value="hindi" className="text-lg py-3">हिन्दी</SelectItem>
                <SelectItem value="telugu" className="text-lg py-3">తెలుగు</SelectItem>
                <SelectItem value="kannada" className="text-lg py-3">ಕನ್ನಡ</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">{t('auth.selectRole')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {roles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 ${role.theme}`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <role.icon className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-base mt-2">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full h-12 text-lg" size="lg">
                    {t('common.continue')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">{t('auth.haveAccount')}</p>
          <Button variant="link" onClick={() => navigate(`/auth/login?lang=${language}`)} className="text-lg">
            {t('auth.login')}
          </Button>
        </div>
      </div>
    </div>
  );
}