import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { adminApi } from '../../lib/api';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Video, Lock } from 'lucide-react';
import { APP_NAME } from '../../constants/app.constants';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const setAuth = useAdminStore((state) => state.setAuth);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await adminApi.login({ username, password });
      setAuth(user);
      toast.success('Access granted.');
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgDark px-6 py-12 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(99,102,241,0.1),rgba(255,255,255,0))]">
      <Card className="max-w-md w-full p-8 border border-borderDark/60 bg-bgSurface/60 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-primary/20 rounded-2xl text-primary border border-primary/25 mb-4">
            <Video className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-textLight">{APP_NAME} Admin Panel</h3>
          <p className="text-xs text-textMuted mt-1">Please enter your credentials to authenticate.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-semibold text-textMuted select-none">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg bg-bgDark border border-borderDark px-3 py-2 text-sm text-textLight placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
              placeholder="Enter username"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-textMuted select-none">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-bgDark border border-borderDark px-3 py-2 text-sm text-textLight placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <Lock className="h-4 w-4 shrink-0" />
            <span>Authenticate</span>
          </Button>
        </form>
      </Card>
    </div>
  );
};
