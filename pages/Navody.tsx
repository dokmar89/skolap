import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Folder } from 'lucide-react';
import { Article, Category } from '../types';
import { Card } from '../components/ui';

interface NavodyProps {
  articles: Article[];
  categories: Category[];
}

export const Navody: React.FC<NavodyProps> = ({ articles, categories }) => {
  const rootCategories = categories.filter((c) => c.parent_id === null);

  return (
    <div className="w-full space-y-8">
      <div className="rounded-[2rem] border border-border/60 bg-white/70 p-8 shadow-sm dark:bg-card/70">
        <h1 className="text-3xl font-bold tracking-tight">IT návody</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Znalostní báze. Vyberte kategorii a najděte návody.</p>
      </div>

      {rootCategories.length === 0 ? (
        <Card className="p-12 text-center">
          <Folder className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">Zatím nejsou k dispozici žádné kategorie.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {rootCategories.map((cat) => {
            const articleCount = articles.filter((a) => a.category_id === cat.id).length;
            const childCats = categories.filter((c) => c.parent_id === cat.id);
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group flex items-center rounded-3xl border border-border bg-white p-6 transition-all hover:border-primary/30 hover:shadow-lg dark:bg-card"
              >
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Folder size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold transition-colors group-hover:text-primary">{cat.name}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {articleCount} článků{childCats.length > 0 ? ` · ${childCats.length} podkategorií` : ''}
                  </p>
                </div>
                <ChevronRight size={20} className="shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
