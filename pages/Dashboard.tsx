import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Article, Category } from '../types';
import { Card, Button, Badge } from '../components/ui';
import { 
  PenTool, Phone, Printer, Monitor, ArrowRight, 
  Book, Clock, PlusCircle, Database, Folder
} from 'lucide-react';

interface DashboardProps {
  isAdmin: boolean;
  articles: Article[];
  categories: Category[];
}

export const Dashboard: React.FC<DashboardProps> = ({ isAdmin, articles, categories }) => {
  const navigate = useNavigate();
  const recentArticles = articles.slice(0, 5);
  
  const handleLinkClick = (e: React.MouseEvent, titlePart: string) => {
    e.preventDefault();
    const art = articles.find(a => a.title.toLowerCase().includes(titlePart.toLowerCase()));
    
    if (art) {
        navigate(`/article/${art.id}`);
    } else if (isAdmin) {
        navigate(`/admin/new?title=${encodeURIComponent(titlePart + ' - návod')}`);
    } else {
        alert('Tento návod zatím nebyl vytvořen.');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 md:px-12 md:py-16 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl">
                <Badge className="bg-primary/20 text-primary-foreground border-0 mb-4 px-3 py-1">Knowledge Base v2.0</Badge>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                    Všechny návody <br/><span className="text-primary">na jednom místě.</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Centrální znalostní báze pro zaměstnance Školy Populo. 
                    Najděte odpovědi na technické dotazy během vteřiny.
                </p>
            </div>
            {isAdmin && (
                <div className="flex flex-col gap-3">
                    <Link to="/admin/new">
                        <Button size="lg" className="h-14 px-8 text-lg font-bold hover:scale-105 transition-transform">
                            <PlusCircle className="mr-2" size={20} />
                            Nový článek
                        </Button>
                    </Link>
                </div>
            )}
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full"></div>
      </section>

      {/* Database Setup Check (Small & Subtle) */}
      {categories.length === 0 && isAdmin && (
         <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 p-4 rounded-xl flex items-center justify-between text-red-800 dark:text-red-200">
             <div className="flex items-center">
                <Database className="mr-3" size={20} />
                <span className="font-medium">Chybí data! Nezapomeňte spustit SQL skript v Supabase editoru.</span>
             </div>
             <Link to="/admin/new">
                <Button size="sm" variant="destructive">Zkusit vytvořit článek</Button>
             </Link>
         </div>
      )}

      {/* Main Tools Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Klíčové nástroje</h2>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800 mx-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Signature Generator - Always Available */}
            <Card className="p-8 hover:shadow-2xl hover:-translate-y-1 transition-all border-0 bg-white dark:bg-card shadow-lg flex flex-col h-full relative group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <PenTool size={28} />
                </div>
                <h3 className="font-bold text-xl mb-2">Podpisy</h3>
                <p className="text-sm text-muted-foreground mb-8 flex-1 leading-relaxed">
                    Vytvořte si profesionální firemní podpis pro váš e-mail.
                </p>
                <Link to="/tools/generator">
                    <Button variant="outline" className="w-full font-bold group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                        Spustit <ArrowRight size={18} className="ml-2" />
                    </Button>
                </Link>
            </Card>

            {[
                { name: 'Daktela', icon: Phone, color: 'bg-green-500', text: 'Základní nastavení pro příjem hovorů a sluchátka.' },
                { name: 'Tiskárny', icon: Printer, color: 'bg-purple-500', text: 'Návod na instalaci síťové tiskárny na pobočce.' },
                { name: 'Windows', icon: Monitor, color: 'bg-blue-500', text: 'Jak zprovoznit Windows aplikace na vašem Macu.' }
            ].map(item => {
                const hasArticle = articles.find(a => a.title.toLowerCase().includes(item.name.toLowerCase()));
                return (
                    <Card key={item.name} onClick={(e) => handleLinkClick(e, item.name)} className="p-8 hover:shadow-2xl hover:-translate-y-1 transition-all border-0 bg-white dark:bg-card shadow-lg flex flex-col h-full cursor-pointer group">
                        <div className={`w-14 h-14 ${item.color}/10 rounded-2xl flex items-center justify-center text-${item.color.split('-')[1]}-600 mb-6 group-hover:${item.color} group-hover:text-white transition-colors`}>
                            <item.icon size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-8 flex-1 leading-relaxed">
                            {item.text}
                        </p>
                        <Button variant="ghost" className="w-full justify-between pl-0 font-bold group-hover:text-primary">
                            {hasArticle ? 'Zobrazit návod' : (isAdmin ? 'Vytvořit nyní' : 'Nedostupné')} <ArrowRight size={18} />
                        </Button>
                    </Card>
                )
            })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Right Column: Latest Updates */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center">
                 <Clock size={22} className="mr-3 text-primary" />
                 <h2 className="text-2xl font-bold">Poslední úpravy</h2>
            </div>
            
            <Card className="divide-y divide-border border-0 shadow-xl overflow-hidden">
                {recentArticles.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Book size={24} className="text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">Zatím nebyly publikovány žádné články.</p>
                        {isAdmin && (
                             <Link to="/admin/new">
                                <Button variant="link" className="mt-2 text-primary">Vytvořte svůj první návod →</Button>
                             </Link>
                        )}
                    </div>
                ) : (
                    recentArticles.map((article, idx) => (
                        <Link to={`/article/${article.id}`} key={article.id} className="flex items-center p-6 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-6 ${idx === 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                <Book size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">{article.title}</h4>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Upraveno {new Date(article.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                            <Badge variant={idx === 0 ? "default" : "secondary"} className="ml-4 shrink-0">
                                {idx === 0 ? 'Nové' : 'Důležité'}
                            </Badge>
                        </Link>
                    ))
                )}
            </Card>
        </div>

        {/* Left Column: Oblíbené témata - reálné kategorie */}
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Oblíbené témata</h2>
            <div className="grid gap-4">
                {categories
                    .filter(c => c.parent_id === null)
                    .slice(0, 6)
                    .map((cat) => {
                        const articleCount = articles.filter(a => a.category_id === cat.id).length;
                        return (
                            <Link
                                key={cat.id}
                                to={`/category/${cat.id}`}
                                className="flex items-center p-4 rounded-2xl bg-white dark:bg-card border border-transparent hover:border-primary/20 hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 mr-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Folder size={18} />
                                </div>
                                <span className="font-bold flex-1">{cat.name}</span>
                                {articleCount > 0 && (
                                    <span className="text-xs text-muted-foreground mr-2">{articleCount}</span>
                                )}
                                <ArrowRight size={16} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Link>
                        );
                    })}
                {categories.filter(c => c.parent_id === null).length === 0 && (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-center">
                        <p className="text-sm text-muted-foreground">Zatím nejsou k dispozici žádné kategorie.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
