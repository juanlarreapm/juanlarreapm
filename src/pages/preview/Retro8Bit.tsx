import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Gamepad2, Trophy, Star, Heart } from "lucide-react";
import "@/styles/8bit-theme.css";

const Retro8Bit = () => {
  return (
    <div className="min-h-screen bg-black text-white pixel-grid scanlines crt-flicker">
      {/* Back to home link */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-retro-cyan hover:text-retro-magenta transition-colors font-mono text-sm"
        >
          <ArrowLeft size={16} />
          <span>← BACK TO CURRENT SITE</span>
        </Link>
      </div>

      {/* Theme indicator */}
      <div className="fixed top-4 right-4 z-50 font-['Press_Start_2P'] text-xs text-retro-yellow">
        8-BIT PREVIEW
      </div>

      {/* Main Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 crt-glow">
        {/* Pixel art decorations */}
        <div className="absolute top-20 left-10 text-retro-magenta opacity-60 animate-pulse">
          <Star size={24} className="pixel-icon" />
        </div>
        <div className="absolute top-40 right-20 text-retro-cyan opacity-60 animate-bounce">
          <Gamepad2 size={32} className="pixel-icon" />
        </div>
        <div className="absolute bottom-40 left-20 text-retro-lime opacity-60 animate-pulse">
          <Trophy size={28} className="pixel-icon" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge - Arcade Style */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border-4 border-retro-lime text-retro-lime font-['Press_Start_2P'] text-xs animate-pulse">
            <Sparkles size={16} className="pixel-icon" />
            <span>PLAYER 1 READY!</span>
            <Heart size={16} className="text-retro-magenta pixel-icon" />
          </div>

          {/* Main Title - Arcade Style */}
          <div className="space-y-4">
            <h1 className="font-['Press_Start_2P'] text-4xl md:text-6xl text-retro-cyan arcade-text leading-relaxed">
              JUAN LARREA
            </h1>
            <div className="flex items-center justify-center gap-4 font-['Press_Start_2P'] text-sm md:text-base text-retro-magenta">
              <span>★</span>
              <span>PRODUCT MANAGER</span>
              <span>★</span>
              <span>LVL 99</span>
              <span>★</span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="font-['VT323'] text-2xl md:text-3xl text-retro-yellow max-w-2xl mx-auto leading-relaxed">
            SPECIALIZING IN 0-TO-1 LAUNCHES & GROWTH OPTIMIZATION. 
            CURRENTLY CRUSHING IT AT PARTSTECH!
          </p>

          {/* Stats - Game HUD Style */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto py-8">
            <div className="bg-black border-4 border-retro-cyan p-4 space-y-2">
              <div className="font-['Press_Start_2P'] text-xs text-retro-cyan">EXP</div>
              <div className="font-['Press_Start_2P'] text-2xl text-white">8+</div>
              <div className="font-['VT323'] text-lg text-retro-cyan">YEARS</div>
            </div>
            <div className="bg-black border-4 border-retro-magenta p-4 space-y-2">
              <div className="font-['Press_Start_2P'] text-xs text-retro-magenta">WORLDS</div>
              <div className="font-['Press_Start_2P'] text-2xl text-white">5+</div>
              <div className="font-['VT323'] text-lg text-retro-magenta">INDUSTRIES</div>
            </div>
            <div className="bg-black border-4 border-retro-lime p-4 space-y-2">
              <div className="font-['Press_Start_2P'] text-xs text-retro-lime">CLASS</div>
              <div className="font-['Press_Start_2P'] text-lg text-white">B2B</div>
              <div className="font-['VT323'] text-lg text-retro-lime">SAAS</div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between font-['Press_Start_2P'] text-xs">
              <span className="text-retro-lime">SKILL LEVEL</span>
              <span className="text-retro-yellow">99/99</span>
            </div>
            <div className="h-6 bg-black border-4 border-retro-lime relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-retro-lime to-retro-cyan"
                style={{ width: '100%' }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-['Press_Start_2P'] text-xs text-black">
                MAX LEVEL!
              </div>
            </div>
          </div>

          {/* Action Buttons - Retro Game Style */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/about"
              className="retro-btn bg-retro-cyan text-black font-['Press_Start_2P'] text-sm px-8 py-4 border-4 border-white hover:bg-retro-magenta transition-colors"
            >
              VIEW STATS
            </Link>
            <Link
              to="/case-studies"
              className="retro-btn bg-black text-retro-cyan font-['Press_Start_2P'] text-sm px-8 py-4 border-4 border-retro-cyan hover:border-retro-magenta hover:text-retro-magenta transition-colors"
            >
              ACHIEVEMENTS
            </Link>
          </div>

          {/* Insert Coin prompt */}
          <div className="pt-8 font-['Press_Start_2P'] text-xs text-retro-yellow blink">
            ▼ SCROLL DOWN TO CONTINUE ▼
          </div>
        </div>
      </section>

      {/* Sample Case Study Card */}
      <section className="px-4 py-20 max-w-4xl mx-auto">
        <h2 className="font-['Press_Start_2P'] text-2xl text-retro-magenta text-center mb-12">
          QUEST LOG
        </h2>
        
        <div className="bg-black border-4 border-retro-cyan p-6 space-y-4 hover:border-retro-magenta transition-colors">
          <div className="flex items-start justify-between">
            <span className="font-['Press_Start_2P'] text-xs text-retro-lime bg-retro-lime/20 px-3 py-1">
              ★ FEATURED
            </span>
            <span className="font-['VT323'] text-xl text-retro-yellow">
              +500 XP
            </span>
          </div>
          <h3 className="font-['Press_Start_2P'] text-lg text-retro-cyan">
            ENTERPRISE ONBOARDING
          </h3>
          <p className="font-['VT323'] text-xl text-white/80">
            REDESIGNED THE ONBOARDING FLOW FOR ENTERPRISE CUSTOMERS, 
            RESULTING IN 40% FASTER ACTIVATION TIMES.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="font-['Press_Start_2P'] text-[10px] text-retro-magenta border border-retro-magenta px-2 py-1">
              UX RESEARCH
            </span>
            <span className="font-['Press_Start_2P'] text-[10px] text-retro-cyan border border-retro-cyan px-2 py-1">
              B2B SAAS
            </span>
            <span className="font-['Press_Start_2P'] text-[10px] text-retro-lime border border-retro-lime px-2 py-1">
              GROWTH
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-retro-cyan py-8 text-center">
        <p className="font-['Press_Start_2P'] text-xs text-retro-cyan">
          © 2025 JUAN LARREA • HIGH SCORE: ∞
        </p>
        <p className="font-['VT323'] text-lg text-retro-magenta mt-2">
          PRESS START TO CONNECT
        </p>
      </footer>
    </div>
  );
};

export default Retro8Bit;
