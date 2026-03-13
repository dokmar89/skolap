import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Article } from '../types';
import { api } from '../services/api';
import { Button, Badge } from '../components/ui';
import { Edit2, Clock, Calendar, ChevronLeft, Trash2, Loader2, AlertCircle, Printer } from 'lucide-react';
import { sanitizeArticleHtml } from '../lib/html';

interface ArticleViewProps {
  isAdmin: boolean;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ isAdmin }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getArticle(id)
        .then(setArticle)
        .finally(() => setLoading(false));
  }, [id]);
  
  useEffect(() => {
    if (searchParams.get('print') === 'true' && !loading && article) {
      setTimeout(() => {
        window.print();
      }, 500); // Short delay to ensure content renders
    }
  }, [loading, article, searchParams]);

  const handleDelete = async () => {
    if(confirm('Opravdu smazat tento článek?')) {
        await api.deleteArticle(article!.id);
        navigate('/');
        window.location.reload(); 
    }
  }

  // Calculate approximate read time
  const getReadTime = (html: string) => {
      const text = html.replace(/<[^>]*>/g, '');
      const wordsPerMinute = 200;
      const minutes = Math.ceil(text.split(/\s+/).length / wordsPerMinute);
      return minutes < 1 ? '1 min čtení' : `${minutes} min čtení`;
  }

  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="animate-spin text-primary h-12 w-12 mb-4" />
            <p className="text-muted-foreground font-medium">Načítání článku...</p>
        </div>
      );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
             <AlertCircle size={40} className="text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Stránka nenalezena</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">Tento návod buď neexistuje, nebo k němu nemáte oprávnění.</p>
        <Link to="/">
            <Button size="lg" className="rounded-full px-8">Zpět na přehled</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none pb-20 animate-fade-in">
      {/* Navigation & Actions Header */}
      <div className="mb-10 flex items-center justify-between">
         <Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center font-medium">
            <ChevronLeft size={18} className="mr-1" />
            Dashboard
         </Link>
         
         <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => window.print()} title="Vytisknout">
                <Printer size={18} />
            </Button>
            {isAdmin && (
              <div className="flex items-center space-x-2 ml-4">
                 <Link to={`/admin/edit/${article.id}`}>
                    <Button variant="outline" size="sm" className="font-bold border-2">
                        <Edit2 size={16} className="mr-2" /> Upravit
                    </Button>
                 </Link>
                 <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:bg-destructive/10">
                    <Trash2 size={16} />
                 </Button>
              </div>
            )}
         </div>
      </div>

      <article>
          {/* Article Meta */}
          <div className="mb-10">
             <div className="flex items-center space-x-3 mb-6">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-bold uppercase tracking-wider text-[10px]">
                    Návod / Dokumentace
                </Badge>
                <div className="h-4 w-px bg-slate-300"></div>
                <div className="flex items-center text-slate-500 text-sm font-medium">
                    <Clock size={14} className="mr-1.5" />
                    {getReadTime(article.content)}
                </div>
             </div>

             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1] mb-8">
                {article.title}
             </h1>

             <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mr-4 shadow-lg shadow-primary/20">
                    {article.author_email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{article.author_email}</p>
                    <div className="flex items-center mt-1 text-xs text-slate-500 font-medium">
                        <Calendar size={12} className="mr-1" />
                        Aktualizováno {new Date(article.updated_at).toLocaleDateString()}
                    </div>
                </div>
             </div>
          </div>

          {/* Content Body */}
          <div
            className="article-content w-full"
            dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
          />
      </article>
    </div>
  );
};
