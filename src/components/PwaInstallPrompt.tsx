import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const wasDismissed = localStorage.getItem("pwa_install_dismissed");
      if (!wasDismissed) setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem("pwa_install_dismissed", "true");
  };

  if (!showBanner || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-lg animate-in slide-in-from-bottom-4">
      <div className="rounded-2xl bg-card border border-border shadow-xl p-4 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3">
          <Download className="text-primary" size={24} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Install Cloth Calculator</p>
          <p className="text-xs text-muted-foreground">Add to home screen for quick access</p>
        </div>
        <Button onClick={handleInstall} size="sm" className="rounded-xl font-bold">Install</Button>
        <button onClick={handleDismiss} className="text-muted-foreground p-1"><X size={18} /></button>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
