import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Shield, Users, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { APP_NAME } from '../../constants/app.constants';

export const SafetyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bgDark px-6 py-8">
      {/* Back Header */}
      <header className="max-w-xl w-full mx-auto flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-textMuted hover:text-textLight transition-colors gap-1.5 focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </header>

      {/* Main Page Layout */}
      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-glow tracking-tight text-textLight">
              Safety & Guidelines
            </h2>
            <p className="text-sm text-textMuted">Making {APP_NAME} safe and respectful for everyone.</p>
          </div>
        </div>

        {/* Guideline Cards */}
        <div className="space-y-4 mt-6">
          {/* Be Respectful */}
          <div className="p-5 rounded-xl border border-borderDark/60 bg-bgSurface/40 flex items-start space-x-4">
            <div className="mt-0.5 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-textLight">Be Respectful</h3>
              <p className="text-xs text-textMuted mt-1 leading-relaxed">
                Treat all strangers with respect and kindness. Do not use abusive language, insults, or behavior that makes others feel unsafe or harassed.
              </p>
            </div>
          </div>

          {/* No Sexual Content */}
          <div className="p-5 rounded-xl border border-borderDark/60 bg-bgSurface/40 flex items-start space-x-4">
            <div className="mt-0.5 text-danger">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-textLight">No Nudity or Sexual Content</h3>
              <p className="text-xs text-textMuted mt-1 leading-relaxed">
                Nudity, sexual activity, or sexually suggestive behavior is strictly prohibited. Violators will be banned from the platform.
              </p>
            </div>
          </div>

          {/* Privacy */}
          <div className="p-5 rounded-xl border border-borderDark/60 bg-bgSurface/40 flex items-start space-x-4">
            <div className="mt-0.5 text-indigo-400">
              <EyeOff className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-textLight">No Recording</h3>
              <p className="text-xs text-textMuted mt-1 leading-relaxed">
                Do not record, take screenshots, or save call feeds. Respect the privacy of your chat partners.
              </p>
            </div>
          </div>

          {/* Reporting */}
          <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 flex items-start space-x-4">
            <div className="mt-0.5 text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Moderation & Enforcement</h3>
              <p className="text-xs text-textMuted mt-1 leading-relaxed">
                If you encounter inappropriate behavior, click the "Report" control to flag the user. Reports are processed by live admin moderators.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="mt-8 font-semibold tracking-wide"
          onClick={() => navigate('/gender')}
        >
          I Agree, Continue
        </Button>
      </main>

      <footer className="text-center text-xs text-textMuted max-w-sm w-full mx-auto leading-relaxed">
        By continuing, you confirm you are at least 18 years old and agree to follow these guidelines.
      </footer>
    </div>
  );
};
