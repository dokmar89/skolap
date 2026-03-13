import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Book, Clock, Database, Folder, Monitor, PenTool, Phone, PlusCircle, Printer } from 'lucide-react';
import { Article, Category } from '../types';
import { Badge, Button, Card } from '../components/ui';

interface DashboardProps {
  isAdmin: boolean;
  articles: Article[];
  categories: Category[];
}

export const Dashboard: React.FC<DashboardProps> = ({ isAdmin, articles, categories }) => {
  const navigate = useNavigate();
  const recentArticles = articles.slice(0, 5);

  const getCategoryByNames = (names: string[]) => {
    const normalized = names.map((name) => name.toLowerCase());
    return categories.find((cat) => normalized.includes(cat.name.toLowerCase()));
  };

  const handleLinkClick = (e: React.MouseEvent, categoryNames: string[], fallbackTitle: string) => {
    e.preventDefault();
    const category = getCategoryByNames(categoryNames);

    if (category) {
      navigate(`/category/${category.id}`);
    } else if (isAdmin) {
      navigate(`/admin/new?title=${encodeURIComponent(`${fallbackTitle} - návod`)}`);
    } else {
      alert('Tato kategorie zatím není dostupná.');
    }
  };

  const toolCards = [
    {
      name: 'Daktela',
      icon: Phone,
      iconClass: 'text-emerald-600 bg-emerald-500/10',
      text: 'Základní nastavení pro příjem hovorů a sluchátka.',
      categoryNames: ['Daktela'],
    },
    {
      name: 'Tiskárny',
      icon: Printer,
      iconClass: 'text-sky-600 bg-sky-500/10',
      text: 'Návod na instalaci síťové tiskárny na pobočce.',
      categoryNames: ['Tiskárny'],
    },
    {
      name: 'Windows',
      icon: Monitor,
      iconClass: 'text-amber-600 bg-amber-500/10',
      text: 'Jak zprovoznit Windows aplikace na vašem Macu.',
      categoryNames: ['Windows', 'MacOS'],
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-8 py-10 shadow-2xl md:px-10 md:py-12">
        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_320px] xl:items-end">
          <div className="max-w-3xl">
            <Badge className="mb-4 border-0 bg-primary/20 px-3 py-1 text-primary-foreground">Knowledge Base v2.0</Badge>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
              Všechny návody
              <br />
              <span className="text-primary">na jednom místě.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-400">
              Centrální znalostní báze pro zaměstnance Školy Populo. Najděte odpovědi na technické dotazy během
              vteřiny.
            </p>
          </div>

          {isAdmin && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Admin</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Vytvářejte nové návody a udržujte obsah aktuální bez hledání v menu.
              </p>
              <Link to="/admin/new">
                <Button size="lg" className="mt-5 h-12 w-full font-bold">
                  <PlusCircle className="mr-2" size={20} />
                  Nový článek
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="absolute right-0 top-0 h-[420px] w-[420px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[260px] w-[260px] -translate-x-1/3 translate-y-1/3 rounded-full bg-sky-500/10 blur-[100px]" />
      </section>

      {categories.length === 0 && isAdmin && (
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:bg-red-950/20 dark:text-red-200">
          <div className="flex items-center">
            <Database className="mr-3" size={20} />
            <span className="font-medium">Chybí data. Spusťte SQL skript v Supabase editoru.</span>
          </div>
          <Link to="/admin/new">
            <Button size="sm" variant="destructive">
              Zkusit vytvořit článek
            </Button>
          </Link>
        </div>
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-2xl font-bold tracking-tight">Klíčové nástroje</h2>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="flex h-full flex-col rounded-3xl border-0 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-card">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PenTool size={28} />
            </div>
            <h3 className="mb-2 text-xl font-bold">Podpisy</h3>
            <p className="mb-8 flex-1 text-sm leading-relaxed text-muted-foreground">
              Vytvořte si profesionální firemní podpis pro váš e-mail.
            </p>
            <Link to="/tools/generator">
              <Button variant="outline" className="w-full font-bold">
                Spustit <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </Card>

          {toolCards.map((item) => {
            const hasCategory = getCategoryByNames(item.categoryNames);
            return (
              <Card
                key={item.name}
                onClick={(e) => handleLinkClick(e, item.categoryNames, item.name)}
                className="flex h-full cursor-pointer flex-col rounded-3xl border-0 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-card"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconClass}`}>
                  <item.icon size={28} />
                </div>
                <h3 className="mb-2 text-xl font-bold">{item.name}</h3>
                <p className="mb-8 flex-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                <Button variant="ghost" className="w-full justify-between pl-0 font-bold">
                  {hasCategory ? 'Otevřít kategorii' : isAdmin ? 'Vytvořit nyní' : 'Nedostupné'}
                  <ArrowRight size={18} />
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1.7fr)_360px]">
        <section className="space-y-6">
          <div className="flex items-center">
            <Clock size={22} className="mr-3 text-primary" />
            <h2 className="text-2xl font-bold">Poslední úpravy</h2>
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-0 shadow-xl">
            {recentArticles.length === 0 ? (
              <div className="p-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Book size={24} className="text-slate-400" />
                </div>
                <p className="font-medium text-slate-500">Zatím nebyly publikovány žádné články.</p>
                {isAdmin && (
                  <Link to="/admin/new">
                    <Button variant="link" className="mt-2 text-primary">
                      Vytvořte svůj první návod
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              recentArticles.map((article, idx) => (
                <Link
                  to={`/article/${article.id}`}
                  key={article.id}
                  className="group flex items-center gap-4 border-b border-border/70 p-6 transition-colors last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      idx === 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    }`}
                  >
                    <Book size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                      {article.title}
                    </h4>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Upraveno {new Date(article.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={idx === 0 ? 'default' : 'secondary'} className="shrink-0">
                    {idx === 0 ? 'Nové' : 'Důležité'}
                  </Badge>
                </Link>
              ))
            )}
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Oblíbená témata</h2>
          <div className="grid gap-4">
            {categories
              .filter((c) => c.parent_id === null)
              .slice(0, 6)
              .map((cat) => {
                const articleCount = articles.filter((a) => a.category_id === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className="group flex items-center rounded-2xl border border-transparent bg-white p-4 transition-all hover:border-primary/20 hover:shadow-md dark:bg-card"
                  >
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary dark:bg-slate-800">
                      <Folder size={18} />
                    </div>
                    <span className="flex-1 font-bold">{cat.name}</span>
                    {articleCount > 0 && <span className="mr-2 text-xs text-muted-foreground">{articleCount}</span>}
                    <ArrowRight size={16} className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                );
              })}

            {categories.filter((c) => c.parent_id === null).length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-6 text-center dark:bg-slate-900/50">
                <p className="text-sm text-muted-foreground">Zatím nejsou k dispozici žádné kategorie.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
