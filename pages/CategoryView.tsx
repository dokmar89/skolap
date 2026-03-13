import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, Book, ChevronRight, Folder } from 'lucide-react';
import { Article, Category } from '../types';
import { Button, Card } from '../components/ui';

interface CategoryViewProps {
  articles: Article[];
  categories: Category[];
}

export const CategoryView: React.FC<CategoryViewProps> = ({ articles, categories }) => {
  const { id } = useParams<{ id: string }>();
  const category = categories.find((c) => c.id === id);
  const articlesInCategory = articles.filter((a) => a.category_id === id);

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <AlertCircle size={40} className="text-slate-400" />
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Kategorie nenalezena</h2>
        <p className="mb-8 max-w-sm text-muted-foreground">Tato kategorie neexistuje.</p>
        <Link to="/">
          <Button size="lg" className="rounded-full px-8">
            Zpět na přehled
          </Button>
        </Link>
      </div>
    );
  }

  const getExcerpt = (html: string, maxLength = 120) => {
    const text = html.replace(/<[^>]*>/g, '');
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength).trim()}...`;
  };

  return (
    <div className="w-full space-y-8">
      <div className="rounded-[2rem] border border-border/60 bg-white/70 p-8 shadow-sm dark:bg-card/70">
        <div className="flex items-center">
          <div className="mr-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Folder className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Kategorie</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{category.name}</h1>
          </div>
        </div>
      </div>

      {articlesInCategory.length === 0 ? (
        <Card className="rounded-3xl border-0 p-16 text-center shadow-lg">
          <p className="font-medium text-muted-foreground">V této kategorii zatím nejsou žádné články.</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {articlesInCategory.map((article) => (
            <Link key={article.id} to={`/article/${article.id}`} className="group">
              <Card className="flex h-full flex-col justify-between rounded-3xl border-border/60 p-6 transition-shadow hover:shadow-lg">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Book size={20} className="text-primary" />
                  </div>
                  <h3 className="mb-1 line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{getExcerpt(article.content)}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Upraveno {new Date(article.updated_at).toLocaleDateString()}</span>
                  <ChevronRight size={16} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
