import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/translations';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { profile, userRole, signOut } = useAuth();
  const { t } = useTranslation(profile?.preferred_language || 'english');

  const themeClass = userRole === 'farmer' ? 'theme-farmer' : 'theme-vendor';

  return (
    <div className={`min-h-screen p-6 ${themeClass}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">{t('app.name')}</h1>
            <p className="text-xl text-muted-foreground">{t('app.tagline')}</p>
          </div>
          <Button onClick={signOut} variant="outline" size="lg">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome, {profile?.full_name}!</CardTitle>
            <CardDescription className="text-base">
              Role: {userRole?.charAt(0).toUpperCase() + (userRole?.slice(1) || '')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Language</p>
                <p className="text-lg font-semibold">{profile?.preferred_language}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Communication</p>
                <p className="text-lg font-semibold">{profile?.communication_preference}</p>
              </div>
            </div>
            <div className="p-6 bg-primary/10 rounded-lg text-center">
              <p className="text-lg">Dashboard features coming soon in Phase 2!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}