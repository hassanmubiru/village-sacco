'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSaccoContract } from '@/hooks/use-sacco-contract';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus, Loader2 } from 'lucide-react';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  nationalId: z.string().optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export function MemberRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerMember } = useSaccoContract();
  const { refreshMemberInfo } = useAuth();

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      nationalId: '',
    },
  });

  const onSubmit = async (data: RegistrationForm) => {
    try {
      setIsSubmitting(true);
      
      // Register on blockchain
      const tx = await registerMember({
        args: [data.name, data.email],
      });

      toast.success('Registration submitted successfully!');
      console.log('Registration transaction:', tx);

      // Also save to database via API
      try {
        const response = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            nationalId: data.nationalId,
            walletAddress: await window.ethereum?.request({ method: 'eth_accounts' }).then((accounts: string[]) => accounts[0])
          }),
        });

        if (!response.ok) {
          console.warn('Database registration failed, but blockchain registration succeeded');
        }
      } catch (dbError) {
        console.warn('Database error:', dbError);
      }

      // Refresh member info
      await refreshMemberInfo();
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <UserPlus className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Join Village SACCO</CardTitle>
          <CardDescription>
            Complete your registration to become a member of our cooperative
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  {...form.register('phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId">National ID</Label>
                <Input
                  id="nationalId"
                  placeholder="Enter your national ID"
                  {...form.register('nationalId')}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your registration will be recorded on the blockchain</li>
                <li>• A SACCO administrator will review your application</li>
                <li>• You'll be notified when your membership is approved</li>
                <li>• Once approved, you can start saving and applying for loans</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register as Member
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}