import React from 'react';
import { Link } from 'react-router-dom';
import { Article, Category } from '../types';
import { Card } from '../components/ui';
import { Folder, ChevronRight } from 'lucide-react';

interface NavodyProps {
  articles: Article[];
  categories: Category[];
}

export const Navody: React.FC<NavodyProps> = ({ articles, categories }) => {
  const rootCategories = categories.filter(c => c.parent_id === null);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">IT návody</h1>
        <p className="text-muted-foreground mt-2">
          Znalostní báze – vyberte kategorii a najděte návody.
        </p>
      </div>

      {rootCategories.length === 0 ? (
        <Card className="p-12 text-center">
          <Folder className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Zatím nejsou k dispozici žádné kategorie.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rootCategories.map(cat => {
            const articleCount = articles.filter(a => a.category_id === cat.id).length;
            const childCats = categories.filter(c => c.parent_id === cat.id);
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex items-center p-6 rounded-2xl bg-white dark:bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Folder size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {articleCount} článků{childCats.length > 0 ? ` · ${childCats.length} podkategorií` : ''}
                  </p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
