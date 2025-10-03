import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useTranslation, Language } from '@/lib/translations';
import { Loader2 } from 'lucide-react';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'farmer';
  const language = (searchParams.get('lang') || 'english') as Language;
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/onboarding?role=${role}&lang=${language}`;
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: values.fullName,
            phone_number: values.phone,
            role: role,
            preferred_language: language,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: data.user.id,
          full_name: values.fullName,
          phone_number: values.phone,
          preferred_language: language,
          onboarding_completed: false,
        });

        if (profileError) throw profileError;

        // Create user role
        const { error: roleError } = await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: role as 'farmer' | 'vendor' | 'buyer',
        });

        if (roleError) throw roleError;

        toast({
          title: 'Account created successfully!',
          description: 'Please complete your onboarding.',
        });

        navigate(`/onboarding?role=${role}&lang=${language}`);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const themeClass = role === 'farmer' ? 'theme-farmer' : 'theme-vendor';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${themeClass}`}>
      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">{t('auth.signup')}</CardTitle>
          <CardDescription className="text-center text-base">
            {t('app.name')} - {t('app.tagline')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('auth.fullName')}</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('auth.email')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('auth.phone')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('auth.password')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('auth.confirmPassword')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('auth.signup')}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">{t('auth.haveAccount')}</p>
            <Button
              variant="link"
              onClick={() => navigate(`/auth/login?role=${role}&lang=${language}`)}
              className="text-base"
            >
              {t('auth.login')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}