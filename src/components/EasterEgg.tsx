import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
}

interface EasterEggProps {
  isActive: boolean;
  onClose: () => void;
}

const COLORS = [
  "hsl(199 89% 48%)", // primary
  "hsl(280 100% 65%)", // accent
  "hsl(330 100% 60%)", // pink
  "hsl(45 100% 60%)", // gold
  "hsl(120 70% 50%)", // green
];

export function EasterEgg({ isActive, onClose }: EasterEggProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      }));
      setConfetti(pieces);
      
      // Show modal after confetti has mostly fallen (2.5 seconds)
      setTimeout(() => setShowModal(true), 2500);

      // Clean up confetti after animation
      const cleanup = setTimeout(() => {
        setConfetti([]);
      }, 4000);

      return () => clearTimeout(cleanup);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* Confetti Layer */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-3 h-3 animate-confetti"
            style={{
              left: `${piece.x}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              borderRadius: Math.random() > 0.5 ? "50%" : "0",
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Secret Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false);
              onClose();
            }}
          />
          <div className="relative bg-card border border-border rounded-2xl p-8 max-w-md w-full animate-scale-in shadow-elevated">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => {
                setShowModal(false);
                onClose();
              }}
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>

              <h2 className="font-display text-2xl font-bold mb-4 text-gradient">
                You Found the Secret! 🎉
              </h2>

              <p className="text-muted-foreground mb-6">
                You know the Konami Code! Here's a fun fact about me:
              </p>

              <div className="bg-secondary/50 rounded-xl p-4 mb-6 border border-border">
                <p className="text-foreground italic">
                  "I once debugged a production issue at 3 AM while on vacation in Bali. 
                  The fix? A missing semicolon. Worth it for the sunrise view though! 🌅"
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Thanks for exploring! You're the kind of curious mind I'd love to work with.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
