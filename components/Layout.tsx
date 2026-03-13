import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Menu, Sun, Moon, LogOut, ChevronRight, 
  Folder, ChevronDown, ChevronRight as ChevronRightIcon,
  PlusCircle, Settings, BookOpen, LayoutGrid, Monitor, Users, Newspaper, UserCog, ShieldCheck, X
} from 'lucide-react';
import { Category, Article } from '../types';
import { Button } from './ui';
import { cn } from './ui';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
  articles: Article[];
  categories: Category[];
}

interface SidebarItemProps {
  category: Category;
  allCategories: Category[];
  articles: Article[];
  depth?: number;
  currentPath: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  category, 
  allCategories, 
  articles, 
  depth = 0,
  currentPath
}) => {
  const childArticles = articles.filter(a => a.category_id === category.id);
  const isChildArticleActive = childArticles.some(art => currentPath === `/article/${art.id}`);

  const [isOpen, setIsOpen] = useState(false);
  const childCategories = allCategories.filter(c => c.parent_id === category.id);
  const hasChildren = childCategories.length > 0 || childArticles.length > 0;

  useEffect(() => {
    if (isChildArticleActive && !isOpen) {
      setIsOpen(true);
    }
  }, [isChildArticleActive, currentPath, isOpen]);

  const getIcon = (name: string, iconStr?: string) => {
      if (iconStr === 'Home') return <LayoutGrid size={16} />;
      if (iconStr === 'Server') return <BookOpen size={16} />;
      if (iconStr === 'Wrench') return <Settings size={16} />;
      if (iconStr === 'Monitor' || name.includes('IT')) return <Monitor size={16} />;
      if (iconStr === 'Users' || name.includes('HR')) return <Users size={16} />;
      if (iconStr === 'Newspaper' || name.includes('novinky')) return <Newspaper size={16} />;
      return <Folder size={16} />;
  }
  
  const isCategoryActive = currentPath === `/category/${category.id}`;

  return (
    <div className="select-none mb-1">
      <div 
        className={cn(
          "group flex items-center justify-between px-3 py-2 mx-2 rounded-md transition-all duration-200",
          depth === 0 ? "mt-2 mb-1" : ""
        )}
      >
        <Link 
          to={`/category/${category.id}`}
          className={cn(
            "flex items-center flex-1 min-w-0 pr-2 py-1 -my-1 -ml-1 pl-1 rounded",
            isCategoryActive ? "bg-accent" : "hover:bg-accent"
          )}
        >
          {depth === 0 && (
             <span className={cn(
               "flex items-center justify-center w-6 h-6 rounded mr-2 shrink-0",
               isCategoryActive || isOpen ? "bg-primary/10 text-primary" : "text-muted-foreground"
             )}>
                {getIcon(category.name, category.icon)}
             </span>
          )}
          <span className={cn(
            depth === 0 ? "font-medium text-sm" : "text-sm ml-6",
            "group-hover:text-foreground transition-colors truncate",
            isCategoryActive ? "text-foreground font-semibold" : "text-muted-foreground"
          )}>
            {category.name}
          </span>
        </Link>
        
        {hasChildren && (
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
            aria-label={isOpen ? "Sbalit kategorii" : "Rozbalit kategorii"}
          >
             {isOpen ? <ChevronDown size={14} /> : <ChevronRightIcon size={14} />}
          </button>
        )}
      </div>

      <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0")}>
        <div>
          {childCategories.map(cat => (
            <SidebarItem 
              key={cat.id} 
              category={cat} 
              allCategories={allCategories} 
              articles={articles} 
              depth={depth + 1}
              currentPath={currentPath}
            />
          ))}
          {childArticles.map(art => {
            const isActive = currentPath === `/article/${art.id}`;
            return (
              <Link 
                key={art.id} 
                to={`/article/${art.id}`}
                className={cn(
                  "flex items-center px-3 py-1.5 ml-9 mr-2 my-0.5 text-sm rounded-md transition-all duration-200 relative",
                  isActive 
                    ? "text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <span className="truncate">{art.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, isAdmin, onAdminLogin, onAdminLogout, articles, categories }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Theme persistence
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Click outside handler for search
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setSearchQuery('');
            setSearchResults([]);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleTheme = () => {
    if (document.documentElement.classList.toggle('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
        const lowerCaseQuery = query.toLowerCase();
        const results = articles.filter(art => {
            const contentText = art.content.replace(/<[^>]*>/g, '').toLowerCase();
            return art.title.toLowerCase().includes(lowerCaseQuery) || contentText.includes(lowerCaseQuery);
        });
        setSearchResults(results);
    } else {
        setSearchResults([]);
    }
  };

  const clearSearch = () => {
      setSearchQuery('');
      setSearchResults([]);
  };

  const rootCategories = categories.filter(c => c.parent_id === null);
  const isToolsSection = location.pathname.startsWith('/nastroje') || location.pathname.startsWith('/tools');

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside 
        className={cn(
            "fixed md:relative z-30 h-full bg-slate-50/50 dark:bg-card border-r border-border transition-all duration-300 flex flex-col",
            isSidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full overflow-hidden"
        )}
      >
        <div className="h-16 flex items-center px-6 mb-4">
          <div className="flex items-center space-x-3 mt-4">
             <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <span className="font-bold tracking-tighter">SP</span>
             </div>
             <div>
                <span className="font-bold text-base block leading-none">Škola Populo</span>
                <span className="text-xs text-muted-foreground">Knowledge Base</span>
             </div>
          </div>
        </div>

        <div className="px-4 mb-3 space-y-1">
          <Link
            to="/"
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
              location.pathname === '/'
                ? "bg-white dark:bg-accent shadow-sm font-medium text-primary border border-border/50"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <LayoutGrid size={16} className="mr-3" />
            Domů
          </Link>
          <Link
            to="/nastroje/podpis"
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
              isToolsSection
                ? "bg-white dark:bg-accent shadow-sm font-medium text-primary border border-border/50"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Settings size={16} className="mr-3" />
            Generátor podpisu
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          <div>
            <div className="px-5 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-2">
              Kategorie
            </div>
            {rootCategories.map(cat => (
              <SidebarItem 
                key={cat.id} 
                category={cat} 
                allCategories={categories} 
                articles={articles}
                currentPath={location.pathname}
              />
            ))}
          </div>

          {isAdmin && (
            <div className="mt-8 px-4">
              <Link to="/admin/new">
                  <Button className="w-full justify-start shadow-sm border" variant="secondary">
                    <PlusCircle size={16} className="mr-2" />
                    Nový článek
                  </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-white dark:bg-card">
          <div className="flex items-center p-2">
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-background",
                isAdmin ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
            )}>
                {isAdmin ? <ShieldCheck size={16} /> : 'ZM'}
            </div>
            <div className="flex-1 min-w-0 ml-3">
              <p className="text-sm font-medium truncate text-foreground">{isAdmin ? 'Admin režim' : 'Zaměstnanec'}</p>
            </div>
            {isAdmin ? (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onAdminLogout} title="Opustit admin režim">
                    <LogOut size={14} />
                </Button>
            ) : (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAdminLogin} title="Admin přihlášení">
                   <UserCog size={14} />
                </Button>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-50/30 dark:bg-background">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)} className="mr-4 -ml-2">
                <Menu size={20} />
            </Button>
            
            <nav className="hidden sm:flex items-center text-sm text-muted-foreground">
               <span>Knowledge Base</span>
               <ChevronRight size={14} className="mx-2" />
               <span className="text-foreground font-medium">
                 {location.pathname === '/' ? 'Domů' 
                   : location.pathname.startsWith('/sablony') ? 'Šablony'
                   : location.pathname.startsWith('/nastroje') || location.pathname.startsWith('/tools') ? 'Nástroje'
                   : location.pathname === '/navody' ? 'Návody'
                   : location.pathname.startsWith('/navody/') ? 'Návody'
                   : location.pathname.startsWith('/category/') ? 'Návody'
                   : location.pathname.startsWith('/article/') ? 'Návody'
                   : location.pathname.startsWith('/stazeni') ? 'Ke stažení'
                   : location.pathname.split('/')[1]}
               </span>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
             <div ref={searchContainerRef} className="relative hidden md:block mr-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Hledat..." 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {searchQuery && (
                  <Button variant="ghost" size="icon" className="absolute right-12 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground" onClick={clearSearch}>
                    <X size={16} />
                  </Button>
                )}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
                    <span className="text-[10px] text-muted-foreground border rounded px-1">⌘</span>
                    <span className="text-[10px] text-muted-foreground border rounded px-1">K</span>
                </div>
                {searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-card border rounded-md shadow-lg max-h-96 overflow-y-auto z-50 divide-y">
                        {searchResults.map(art => (
                            <Link 
                                key={art.id} 
                                to={`/article/${art.id}`} 
                                onClick={clearSearch} 
                                className="block p-3 hover:bg-accent text-sm"
                            >
                                <p className="font-semibold text-foreground truncate">{art.title}</p>
                                <p className="text-muted-foreground text-xs truncate mt-1">
                                    {art.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
             </div>
             <Button variant="ghost" size="icon" onClick={toggleTheme}>
                 <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                 <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
             </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
