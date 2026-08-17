import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../store/sessionStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft } from 'lucide-react';

export const GenderPage: React.FC = () => {
  const navigate = useNavigate();
  const setGender = useSessionStore((state) => state.setGender);
  const currentGender = useSessionStore((state) => state.gender);

  const [selected, setSelected] = useState<'male' | 'female' | null>(currentGender);

  const handleContinue = () => {
    if (selected) {
      setGender(selected);
      navigate('/waiting');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bgDark px-6 py-8">
      {/* Header bar */}
      <header className="max-w-xl w-full mx-auto flex items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-sm text-textMuted hover:text-textLight transition-colors gap-1.5 focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </header>

      {/* Main choice card */}
      <main className="max-w-md w-full mx-auto flex flex-col items-center my-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-glow tracking-tight text-center">
          Choose Your Gender
        </h2>
        <p className="text-sm text-textMuted mt-2 text-center max-w-xs leading-relaxed">
          Select one option to find an opposite-gender stranger.
        </p>

        {/* Selection Cards */}
        <div className="grid grid-cols-2 gap-4 mt-8 w-full">
          {/* Male Selector */}
          <button
            type="button"
            onClick={() => setSelected('male')}
            className="focus:outline-none text-left w-full"
          >
            <Card
              className={`p-6 flex flex-col items-center justify-center text-center cursor-pointer border-2 transition-all duration-300 w-full ${
                selected === 'male'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                  : 'border-borderDark hover:border-slate-700 bg-bgSurface/40'
              }`}
            >
              <span className="text-5xl mb-3 block select-none text-indigo-400">♂</span>
              <span className="font-semibold text-textLight">Male</span>
            </Card>
          </button>

          {/* Female Selector */}
          <button
            type="button"
            onClick={() => setSelected('female')}
            className="focus:outline-none text-left w-full"
          >
            <Card
              className={`p-6 flex flex-col items-center justify-center text-center cursor-pointer border-2 transition-all duration-300 w-full ${
                selected === 'female'
                  ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/10 scale-[1.02]'
                  : 'border-borderDark hover:border-slate-700 bg-bgSurface/40'
              }`}
            >
              <span className="text-5xl mb-3 block select-none text-pink-400">♀</span>
              <span className="font-semibold text-textLight">Female</span>
            </Card>
          </button>
        </div>

        {/* Navigation Action */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selected}
          className={`mt-8 font-semibold tracking-wide transition-colors ${
            selected === 'female' ? 'bg-pink-600 hover:bg-pink-500 hover:shadow-pink-500/20' : ''
          }`}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </main>

      <footer className="text-center text-xs text-textMuted max-w-sm w-full mx-auto leading-relaxed">
        Your gender preference is only used for temporary matchmaking queue sorting. It is not permanently persisted.
      </footer>
    </div>
  );
};
