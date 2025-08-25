import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const expectedPasscode = import.meta.env.VITE_ADMIN_PASSCODE;
    
    if (passcode === expectedPasscode) {
      // Store session in localStorage
      localStorage.setItem('recipe-admin-session', Date.now().toString());
      onLogin(true);
    } else {
      setError('Invalid passcode. Please try again.');
      setPasscode('');
      onLogin(false);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Recipe Admin</CardTitle>
          <p className="text-muted-foreground text-sm">
            Enter the admin passcode to manage recipes
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passcode">Admin Passcode</Label>
              <div className="relative">
                <Input
                  id="passcode"
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasscode(!showPasscode)}
                  disabled={loading}
                >
                  {showPasscode ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || !passcode.trim()}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Admin access for recipe management</p>
            <p>Development mode: {import.meta.env.DEV ? 'ON' : 'OFF'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}