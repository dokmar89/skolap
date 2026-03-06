import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Article, Category } from '../types';
import { Card, Button } from '../components/ui';
import { Book, ChevronRight, Folder, AlertCircle } from 'lucide-react';

interface CategoryViewProps {
  articles: Article[];
  categories: Category[];
}

export const CategoryView: React.FC<CategoryViewProps> = ({ articles, categories }) => {
  const { id } = useParams<{ id: string }>();
  const category = categories.find(c => c.id === id);
  const articlesInCategory = articles.filter(a => a.category_id === id);

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
             <AlertCircle size={40} className="text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Kategorie nenalezena</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">Tato kategorie neexistuje.</p>
        <Link to="/">
            <Button size="lg" className="rounded-full px-8">Zpět na přehled</Button>
        </Link>
      </div>
    );
  }

  const getExcerpt = (html: string, maxLength = 120) => {
    const text = html.replace(/<[^>]*>/g, '');
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center mb-2">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mr-6">
          <Folder className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Kategorie</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {category.name}
          </h1>
        </div>
      </div>

      {articlesInCategory.length === 0 ? (
        <Card className="p-16 text-center shadow-lg border-0">
          <p className="text-muted-foreground font-medium">
            V této kategorii zatím nejsou žádné články.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {articlesInCategory.map(article => (
            <Link key={article.id} to={`/article/${article.id}`} className="group">
              <Card className="h-full p-6 hover:shadow-lg transition-shadow border-border/60 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Book size={20} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {getExcerpt(article.content)}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Upraveno {new Date(article.updated_at).toLocaleDateString()}</span>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};