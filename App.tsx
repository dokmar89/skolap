import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Layout } from './components/Layout';
import { ArticleView } from './pages/ArticleView';
import { AdminEditor } from './pages/AdminEditor';
import { CategoryView } from './pages/CategoryView';
import { Dashboard } from './pages/Dashboard';
import { Navody } from './pages/Navody';
import { PdfTools } from './pages/PdfTools';
import { SignatureGenerator } from './pages/SignatureGenerator';
import { Stazeni } from './pages/Stazeni';
import { Templates } from './pages/Templates';
import { fetchAdminSession, loginAdmin, logoutAdmin } from './lib/adminApi';
import { isConfigured } from './lib/supabase';
import { api } from './services/api';
import { Article, Category } from './types';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAdminLogin = async () => {
    const pass = prompt('Zadejte heslo pro admin rezim:');
    if (!pass) return;

    try {
      await loginAdmin(pass);
      setIsAdmin(true);
      alert('Admin rezim aktivovan.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Chybne heslo.');
    }
  };

  const handleAdminLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error('Admin logout failed', error);
    } finally {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!isConfigured()) {
        console.error('Supabase is not configured.');
        setLoading(false);
        return;
      }

      try {
        const [session, cats, arts] = await Promise.all([
          fetchAdminSession().catch((error) => {
            console.error('Admin session check failed', error);
            return false;
          }),
          api.getCategories(),
          api.getArticles(),
        ]);

        setIsAdmin(session);
        setCategories(cats);
        setArticles(arts);
      } catch (error) {
        console.error('Initialization error', error);
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
        <p className="text-sm font-medium">Nacitani systemu...</p>
      </div>
    );
  }

  if (!isConfigured()) {
    return (
      <div className="h-screen flex items-center justify-center">
        Chyba: Supabase neni nakonfigurovan v <code>lib/supabase.ts</code>.
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout
        isAdmin={isAdmin}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        articles={articles}
        categories={categories}
      >
        <Routes>
          <Route path="/" element={<Dashboard isAdmin={isAdmin} articles={articles} categories={categories} />} />
          <Route path="/navody" element={<Navody articles={articles} categories={categories} />} />
          <Route path="/navody/:categorySlug/:guideSlug" element={<Navigate to="/navody" replace />} />

          <Route path="/sablony/1" element={<Templates />} />
          <Route path="/sablony/2" element={<Templates />} />

          <Route path="/stazeni" element={<Stazeni articles={articles} />} />
          <Route path="/stazeni/ovladace-tiskaren" element={<Stazeni articles={articles} />} />
          <Route path="/stazeni/soubory-1" element={<Stazeni articles={articles} />} />
          <Route path="/stazeni/soubory-2" element={<Stazeni articles={articles} />} />
          <Route path="/article/:id" element={<ArticleView isAdmin={isAdmin} />} />
          <Route path="/category/:id" element={<CategoryView articles={articles} categories={categories} />} />

          <Route path="/tools/generator" element={<SignatureGenerator />} />
          <Route path="/tools/pdf" element={<PdfTools articles={articles} />} />
          <Route path="/nastroje/podpis" element={<SignatureGenerator />} />
          <Route path="/nastroje/pdf" element={<PdfTools articles={articles} />} />
          <Route path="/nastroje/nastroj-3" element={<PdfTools articles={articles} />} />

          {isAdmin && (
            <>
              <Route path="/admin/new" element={<AdminEditor />} />
              <Route path="/admin/edit/:id" element={<AdminEditor />} />
            </>
          )}

          <Route path="/admin/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
