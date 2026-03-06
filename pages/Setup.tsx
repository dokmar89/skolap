import React, { useState } from 'react';
import { configureSupabase, resetConfiguration } from '../lib/supabase';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { Server, RotateCcw } from 'lucide-react';

export const Setup = () => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    let finalUrl = url.trim();
    const finalKey = key.trim();

    if (!finalUrl || !finalKey) return alert('Vyplňte obě pole');
    
    // Auto-fix missing protocol
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
    }

    // Validate URL
    try {
        new URL(finalUrl);
    } catch (e) {
        return alert('Zadaná URL adresa není platná.');
    }

    setLoading(true);
    configureSupabase(finalUrl, finalKey);
    setTimeout(() => {
        window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <Server size={24} />
          </div>
          <CardTitle className="text-2xl">Připojení k Backend</CardTitle>
          <p className="text-muted-foreground mt-2 text-sm">
            Tato aplikace vyžaduje Supabase backend.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Supabase Project URL</label>
            <Input 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                placeholder="https://xyz.supabase.co" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Supabase Anon Key</label>
            <Input 
                value={key} 
                onChange={e => setKey(e.target.value)} 
                type="password" 
                placeholder="eyJhbGciOiJIUzI1NiIsInR5..." 
            />
          </div>
          
          <div className="bg-muted p-4 rounded-md text-xs text-muted-foreground border border-border">
             <strong>1. SQL Setup:</strong> Spusťte obsah souboru <code>db_schema.sql</code> v Supabase SQL Editoru.<br/>
             <strong>2. Admin:</strong> První uživatel je 'user'. Změňte roli na 'admin' ručně v databázi.
          </div>

          <Button className="w-full" onClick={handleSave} disabled={loading}>
            {loading ? 'Připojování...' : 'Uložit a Restartovat'}
          </Button>

          <div className="pt-4 border-t text-center">
            <Button variant="ghost" size="sm" onClick={resetConfiguration} className="text-muted-foreground">
                <RotateCcw size={14} className="mr-2" />
                Resetovat existující konfiguraci
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};