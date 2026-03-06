import React, { useState } from 'react';
import { api } from '../services/api';
import { Button, Card, CardContent, Input } from '../components/ui';
import { Lock, Zap, ShieldCheck, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // HARDCODED CREDENTIALS FOR QUICK ACCESS
  const ADMIN_EMAIL = 'dokoupil@skolapopulo.cz';
  const ADMIN_PASS = 'populo123';

  const handleQuickAdminLogin = async () => {
    setLoading(true);
    setError('');
    setMessage('Ověřování admin účtu...');
    
    // Visually fill the form
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASS);

    // FIX: Auth functions (e.g., signInWithEmail) were removed from api.ts. This component is no longer used in the app.
    // The following logic is commented out to resolve build errors.
    /*
    try {
        // 1. Try to Login
        try {
            await api.signInWithEmail(ADMIN_EMAIL, ADMIN_PASS);
            window.location.reload();
            return;
        } catch (loginError: any) {
            // 2. If Login fails (likely user doesn't exist), try to Register
            console.log("Login failed, trying auto-registration...", loginError.message);
            
            if (loginError.message.includes('Invalid login credentials') || loginError.message.includes('not found')) {
                 await api.signUpWithEmail(ADMIN_EMAIL, ADMIN_PASS);
                 
                 // 3. Try Login again after registration
                 // Note: If Supabase requires email confirmation, this might fail unless "Confirm Email" is disabled in Supabase console.
                 try {
                    await api.signInWithEmail(ADMIN_EMAIL, ADMIN_PASS);
                    window.location.reload();
                 } catch (reLoginError) {
                    setMessage('Účet vytvořen! Pokud máte v Supabase zapnuté potvrzování emailů, potvrďte prosím email. Jinak klikněte znovu.');
                    setLoading(false);
                 }
            } else {
                throw loginError;
            }
        }
    } catch (e: any) {
        setError(e.message || 'Chyba rychlého přihlášení.');
        setLoading(false);
    }
    */
    setMessage('Přihlašování bylo odstraněno. Použijte admin přepínač.');
    setLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email || !password) return;
    
    setLoading(true);
    setError('');
    setMessage('');

    // FIX: Auth functions (e.g., signUpWithEmail) were removed from api.ts. This component is no longer used in the app.
    // The following logic is commented out to resolve build errors.
    /*
    try {
        if (isSignUp) {
            await api.signUpWithEmail(email, password);
            setMessage('Registrace úspěšná! Zkontrolujte svůj email pro potvrzení.');
            setIsSignUp(false);
        } else {
            await api.signInWithEmail(email, password);
            window.location.reload();
        }
    } catch (e: any) {
        setError(e.message || 'Chyba autentizace.');
    } finally {
        setLoading(false);
    }
    */
    setMessage('Přihlašování bylo odstraněno. Použijte admin přepínač.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.4))] -z-10"></div>
      
      <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-xl shadow-lg shadow-primary/30 text-primary-foreground mb-6">
                 <span className="font-bold text-2xl tracking-tighter">SP</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">IT Knowledge Base</h2>
            <p className="mt-2 text-muted-foreground">Interní dokumentace Škola Populo</p>
      </div>

      <Card className="w-full max-w-md border-border/60 shadow-xl">
          <CardContent className="pt-8 pb-8 px-8 space-y-6">
              
              {/* --- QUICK ADMIN LOGIN BUTTON --- */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-primary/20 mb-6">
                <Button 
                    onClick={handleQuickAdminLogin} 
                    disabled={loading}
                    className="w-full py-6 text-base font-bold shadow-md relative overflow-hidden group"
                    size="lg"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <ShieldCheck className="mr-2" size={20} />
                    Vstoupit jako ADMIN
                </Button>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                    Automaticky přihlásí/zaregistruje účet <strong>dokoupil@skolapopulo.cz</strong>
                </p>
              </div>

              <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Nebo ručně</span>
                  </div>
              </div>
              
              {/* Error / Success Messages */}
              {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start">
                      <AlertCircle size={16} className="mr-2 mt-0.5 shrink-0" />
                      {error}
                  </div>
              )}
              {message && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm p-3 rounded-md">
                      {message}
                  </div>
              )}

              {/* Standard Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input 
                        type="email" 
                        placeholder="jmeno@skolapopulo.cz" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Heslo</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                  </div>
                  <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                      {loading ? 'Zpracování...' : (isSignUp ? 'Zaregistrovat se' : 'Přihlásit se')}
                  </Button>
              </form>

              <div className="text-center text-sm">
                  <button 
                    type="button" 
                    onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
                    className="text-primary hover:underline"
                  >
                      {isSignUp ? 'Již máte účet? Přihlaste se' : 'Nemáte účet? Zaregistrujte se'}
                  </button>
              </div>
              
              <div className="flex justify-center mt-4">
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Lock size={12} className="mr-1" />
                    Zabezpečeno šifrováním Supabase
                  </p>
              </div>
          </CardContent>
      </Card>
    </div>
  );
};
