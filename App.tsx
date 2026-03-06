import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
// Login a Setup stránky se již nepoužívají
import { Dashboard } from './pages/Dashboard';
import { ArticleView } from './pages/ArticleView';
import { AdminEditor } from './pages/AdminEditor';
import { SignatureGenerator } from './pages/SignatureGenerator';
import { PdfTools } from './pages/PdfTools';
import { CategoryView } from './pages/CategoryView';
import { Navody } from './pages/Navody';
import { Templates } from './pages/Templates';
import { Stazeni } from './pages/Stazeni';
import { api } from './services/api';
import { isConfigured } from './lib/supabase';
import { Article, Category } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false); // Nový stav pro admin mód
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Funkce pro "přihlášení" admina
  const handleAdminLogin = () => {
    const pass = prompt('Zadejte heslo pro admin režim:');
    if (pass === 'admin') {
      setIsAdmin(true);
      alert('Admin režim aktivován.');
    } else if (pass) {
      alert('Chybné heslo.');
    }
  };
  
  const handleAdminLogout = () => {
      setIsAdmin(false);
  }

  useEffect(() => {
    // Načtení dat hned po startu, bez ohledu na uživatele
    const init = async () => {
        if (!isConfigured()) {
            // Teoreticky by se sem kód neměl dostat, pokud jsou údaje v supabase.ts
            console.error("Supabase není nakonfigurován!");
            setLoading(false);
            return;
        }
        try {
            const [cats, arts] = await Promise.all([
                api.getCategories(),
                api.getArticles()
            ]);
            setCategories(cats);
            setArticles(arts);
        } catch (e) {
            console.error("Initialization error", e);
        } finally {
            setLoading(false);
        }
    };
    init();
  }, []);


  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background text-muted-foreground">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-sm font-medium">Načítání systému...</p>
      </div>
    );
  }
  
  // Setup obrazovka se už nezobrazuje, předpokládá se konfigurace v lib/supabase.ts
  if (!isConfigured()) {
      return <div className="h-screen flex items-center justify-center">Chyba: Supabase není nakonfigurován v <code>lib/supabase.ts</code>.</div>
  }


  return (
    <HashRouter>
      {/* Layout se zobrazuje vždy, přihlášení se neřeší */}
      <Layout isAdmin={isAdmin} onAdminLogin={handleAdminLogin} onAdminLogout={handleAdminLogout} articles={articles} categories={categories}>
        <Routes>
          <Route path="/" element={<Dashboard isAdmin={isAdmin} articles={articles} categories={categories} />} />
          <Route path="/navody" element={<Navody articles={articles} categories={categories} />} />
          <Route path="/navody/:categorySlug/:guideSlug" element={<Navigate to="/navody" replace />} />

          {/* Šablony */}
          <Route path="/sablony/1" element={<Templates />} />
          <Route path="/sablony/2" element={<Templates />} />

          <Route path="/stazeni" element={<Stazeni articles={articles} />} />
          <Route path="/stazeni/ovladace-tiskaren" element={<Stazeni articles={articles} />} />
          <Route path="/stazeni/soubory-1" element={<Stazeni articles={articles} />} />
          <Route path="/stazeni/soubory-2" element={<Stazeni articles={articles} />} />
          <Route path="/article/:id" element={<ArticleView isAdmin={isAdmin} />} />
          <Route path="/category/:id" element={<CategoryView articles={articles} categories={categories} />} />
          
          {/* Nástroje */}
          <Route path="/tools/generator" element={<SignatureGenerator />} />
          <Route path="/tools/pdf" element={<PdfTools articles={articles} />} />
          <Route path="/nastroje/podpis" element={<SignatureGenerator />} />
          <Route path="/nastroje/pdf" element={<PdfTools articles={articles} />} />
          <Route path="/nastroje/nastroj-3" element={<PdfTools articles={articles} />} />
          
          {/* Chráněné admin routy */}
          {isAdmin && (
            <>
              <Route path="/admin/new" element={<AdminEditor />} />
              <Route path="/admin/edit/:id" element={<AdminEditor />} />
            </>
          )}
          {/* Pokud není admin, přesměruj z admin URL pryč */}
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
          
          {/* Fallback pro neexistující routy */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
