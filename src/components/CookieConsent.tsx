"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "cookie-consent-preferences";

interface ConsentState {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  timestamp: number;
}

function getStoredConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

function saveConsent(state: ConsentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const state: ConsentState = {
      necessary: true,
      preferences: true,
      analytics: true,
      timestamp: Date.now(),
    };
    saveConsent(state);
    setConsent(state);
    setShowBanner(false);
    setShowDialog(false);
  }, []);

  const acceptNecessary = useCallback(() => {
    const state: ConsentState = {
      necessary: true,
      preferences: false,
      analytics: false,
      timestamp: Date.now(),
    };
    saveConsent(state);
    setConsent(state);
    setShowBanner(false);
    setShowDialog(false);
  }, []);

  const savePreferences = useCallback((prefs: Pick<ConsentState, "preferences" | "analytics">) => {
    const state: ConsentState = {
      necessary: true,
      preferences: prefs.preferences,
      analytics: prefs.analytics,
      timestamp: Date.now(),
    };
    saveConsent(state);
    setConsent(state);
    setShowBanner(false);
    setShowDialog(false);
  }, []);

  const openDialog = useCallback(() => {
    setShowDialog(true);
  }, []);

  const closeDialog = useCallback(() => {
    setShowDialog(false);
  }, []);

  return {
    consent,
    showBanner,
    showDialog,
    acceptAll,
    acceptNecessary,
    savePreferences,
    openDialog,
    closeDialog,
  };
}

export function CookieConsent() {
  const {
    consent,
    showBanner,
    showDialog,
    acceptAll,
    openDialog,
    closeDialog,
    savePreferences,
  } = useCookieConsent();

  const [prefs, setPrefs] = useState({ preferences: false, analytics: false });

  useEffect(() => {
    if (consent) {
      setPrefs({
        preferences: consent.preferences,
        analytics: consent.analytics,
      });
    }
  }, [consent, showDialog]);

  if (!showBanner && !showDialog) return null;

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              We use cookies to improve your experience, analyze site traffic, and personalize content. You can manage your preferences or accept all cookies.
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" size="sm" onClick={openDialog}>
                Manage preferences
              </Button>
              <Button size="sm" onClick={acceptAll}>
                Accept all
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Choose which cookies you allow. Necessary cookies are always active.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Strictly necessary</h4>
                <p className="text-xs text-muted-foreground">
                  Required for the site to function. Cannot be disabled.
                </p>
              </div>
              <Switch checked disabled aria-label="Strictly necessary cookies always on" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Preferences</h4>
                <p className="text-xs text-muted-foreground">
                  Remember your settings and preferences for a better experience.
                </p>
              </div>
              <Switch
                checked={prefs.preferences}
                onCheckedChange={(checked) =>
                  setPrefs((p) => ({ ...p, preferences: checked }))
                }
                aria-label="Toggle preference cookies"
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium">Analytics</h4>
                <p className="text-xs text-muted-foreground">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <Switch
                checked={prefs.analytics}
                onCheckedChange={(checked) =>
                  setPrefs((p) => ({ ...p, analytics: checked }))
                }
                aria-label="Toggle analytics cookies"
              />
            </div>
          </div>

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                savePreferences({
                  preferences: prefs.preferences,
                  analytics: prefs.analytics,
                })
              }
            >
              Save preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
