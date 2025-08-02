"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, LogIn, LogOut, Heart, Mail, Lock, UserPlus } from "lucide-react";
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  onAuthStateChange,
} from "@/lib/supabase";

interface AuthButtonProps {
  variant?: "default" | "compact";
  onAuthChange?: (user: any) => void;
}

export default function AuthButton({
  variant = "default",
  onAuthChange,
}: AuthButtonProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Kontrollera om användaren redan är inloggad
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      onAuthChange?.(currentUser);
    });

    // Lyssna på ändringar i autentiseringsstatus
    const {
      data: { subscription },
    } = onAuthStateChange((authUser) => {
      setUser(authUser);
      onAuthChange?.(authUser);
    });

    return () => subscription?.unsubscribe?.();
  }, [onAuthChange]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        setError("Konto skapat! Kontrollera din e-post för verifiering.");
      } else {
        await signIn(email, password);
        setShowAuth(false);
      }

      // Rensa formulär
      setEmail("");
      setPassword("");
      setFullName("");
    } catch (err: any) {
      setError(err.message || "Något gick fel. Försök igen.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
        {variant === "default" && (
          <div className="w-20 h-4 bg-gray-200 animate-pulse rounded" />
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 city-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowAuth(true)}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs rounded-xl"
          >
            <LogIn className="h-3 w-3 mr-1" />
            Logga in
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      {user ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 city-primary rounded-2xl flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user.user_metadata?.full_name || user.email}
              </p>
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 text-green-700"
              >
                Inloggad
              </Badge>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="rounded-xl"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logga ut
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setShowAuth(true)}
          variant="outline"
          className="rounded-2xl border-2 hover:border-primary"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Logga in
        </Button>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md city-card border-0">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {isSignUp ? (
                  <UserPlus className="h-5 w-5" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
                {isSignUp ? "Skapa konto" : "Logga in"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Fullständigt namn
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ditt namn"
                        className="pl-10 rounded-xl"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    E-postadress
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="din@email.com"
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Lösenord
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minst 6 tecken"
                      className="pl-10 rounded-xl"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div
                    className={`text-sm p-3 rounded-xl ${
                      error.includes("Konto skapat")
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {error}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={authLoading}
                    className="flex-1 city-primary hover:city-secondary rounded-xl font-semibold"
                  >
                    {authLoading
                      ? "Laddar..."
                      : isSignUp
                      ? "Skapa konto"
                      : "Logga in"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAuth(false)}
                    className="rounded-xl"
                  >
                    Avbryt
                  </Button>
                </div>
              </form>

              <div className="text-center pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  {isSignUp
                    ? "Har redan ett konto? Logga in"
                    : "Inget konto? Skapa ett"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
