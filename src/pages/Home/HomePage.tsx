import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Video, Shield, UserX, Zap } from 'lucide-react';
import { APP_NAME } from '../../constants/app.constants';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bgDark bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] px-6 py-8">
      {/* Navigation Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/20 rounded-xl border border-primary/30">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-textLight">{APP_NAME}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/safety')}>
          Safety Guidelines
        </Button>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-3xl w-full mx-auto text-center my-12 flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-indigo-300 mb-6 animate-pulse">
          <Zap className="h-3 w-3" />
          <span>No accounts. No passwords. Real-time video.</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-glow">
          Anonymous Video Chat.
          <span className="block bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent mt-2">
            Meet Someone New.
          </span>
        </h1>
        
        <p className="mt-6 text-base md:text-lg text-textMuted max-w-xl leading-relaxed">
          Instantly connect with people around the world. Secure, anonymous, and fast matchmaking. Just select your gender and start talking.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto text-base px-8 py-4 font-semibold hover:shadow-indigo-500/25 shadow-xl transition-all"
            onClick={() => navigate('/gender')}
          >
            Start Video Chat
          </Button>
        </div>

        {/* Product Pitch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl">
          <div className="p-6 rounded-2xl glass-card flex flex-col items-center text-center">
            <div className="p-3 bg-indigo-500/10 rounded-full mb-4 text-indigo-400">
              <UserX className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-textLight">100% Anonymous</h3>
            <p className="text-xs text-textMuted mt-2 leading-relaxed">
              No profiles, names, or signups. You are just "Stranger" to anyone you connect with.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl glass-card flex flex-col items-center text-center">
            <div className="p-3 bg-emerald-500/10 rounded-full mb-4 text-emerald-400">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-textLight">Protected Matchmaking</h3>
            <p className="text-xs text-textMuted mt-2 leading-relaxed">
              Matches only opposite gender preferences. Keep track of rules and report violations easily.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card flex flex-col items-center text-center">
            <div className="p-3 bg-indigo-500/10 rounded-full mb-4 text-indigo-400">
              <Video className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-textLight">P2P Connections</h3>
            <p className="text-xs text-textMuted mt-2 leading-relaxed">
              Direct peer-to-peer audio and video stream via WebRTC. Low latency, high quality.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Links */}
      <footer className="text-center text-xs text-textMuted py-4 border-t border-borderDark/20 max-w-6xl w-full mx-auto">
        <div className="flex justify-center space-x-6 mb-2">
          <a href="/safety" className="hover:text-textLight transition-colors">Community Guidelines</a>
          <a href="#" className="hover:text-textLight transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-textLight transition-colors">Terms of Service</a>
        </div>
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </footer>
    </div>
  );
};
