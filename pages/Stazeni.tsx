import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, PenTool } from 'lucide-react';
import { Article } from '../types';
import { Button, Card } from '../components/ui';

interface StazeniProps {
  articles: Article[];
}

export const Stazeni: React.FC<StazeniProps> = ({ articles: _articles }) => {
  return (
    <div className="w-full space-y-8">
      <div className="rounded-[2rem] border border-border/60 bg-white/70 p-8 shadow-sm dark:bg-card/70">
        <h1 className="text-3xl font-bold tracking-tight">Ke stažení</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Nástroje a soubory připravené ke stažení.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:max-w-5xl">
        <Card className="rounded-3xl p-6 transition-shadow hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <PenTool size={24} className="text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-bold">E-mailový podpis</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Vytvořte si firemní podpis a stáhněte ho jako HTML soubor nebo použijte kopírování do schránky.
          </p>
          <Link to="/tools/generator">
            <Button variant="outline" className="w-full">
              Otevřít generátor <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </Card>

        <Card className="rounded-3xl p-6 transition-shadow hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <FileText size={24} className="text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-bold">Export do PDF</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Stáhněte si návody ze znalostní báze ve formátu PDF pro offline použití.
          </p>
          <Link to="/tools/pdf">
            <Button variant="outline" className="w-full">
              Otevřít export <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
