import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useTranslation, Language } from '@/lib/translations';
import { CheckCircle2, Languages, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type CommunicationMethod = 'app' | 'sms' | 'voice' | 'whatsapp';

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<Language>(
    (searchParams.get('lang') as Language) || profile?.preferred_language || 'english'
  );
  const [communication, setCommunication] = useState<CommunicationMethod>(
    profile?.communication_preference || 'app'
  );
  const { t } = useTranslation(language);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleComplete = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          preferred_language: language,
          communication_preference: communication,
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: 'Welcome!',
        description: 'Your account is ready to use.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete onboarding',
        variant: 'destructive',
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="border-2">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Languages className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">{t('onboarding.language')}</CardTitle>
              <CardDescription className="text-center text-base">
                Select your preferred language for the app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <Button onClick={() => setStep(2)} className="w-full h-12 text-lg">
                {t('common.next')}
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="border-2">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">{t('onboarding.communication')}</CardTitle>
              <CardDescription className="text-center text-base">
                How would you like to receive updates?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(['app', 'sms', 'voice', 'whatsapp'] as CommunicationMethod[]).map((method) => (
                  <Button
                    key={method}
                    variant={communication === method ? 'default' : 'outline'}
                    onClick={() => setCommunication(method)}
                    className="h-20 text-base"
                  >
                    {t(`comm.${method}`)}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 text-lg">
                  {t('common.back')}
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 h-12 text-lg">
                  {t('common.next')}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="border-2">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">{t('onboarding.complete')}</CardTitle>
              <CardDescription className="text-center text-base">
                {t('onboarding.readyToStart')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 text-center">
                <p className="text-base"><strong>{t('auth.selectLanguage')}:</strong> {language}</p>
                <p className="text-base"><strong>{t('auth.selectCommunication')}:</strong> {t(`comm.${communication}`)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 text-lg">
                  {t('common.back')}
                </Button>
                <Button onClick={handleComplete} className="flex-1 h-12 text-lg">
                  {t('common.continue')}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{t('onboarding.welcome')}</h1>
          <p className="text-lg text-muted-foreground">{t('onboarding.setup')}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {renderStep()}
      </div>
    </div>
  );
}