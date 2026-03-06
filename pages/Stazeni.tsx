import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { Card, Button } from '../components/ui';
import { PenTool, FileText, ArrowRight } from 'lucide-react';

interface StazeniProps {
  articles: Article[];
}

export const Stazeni: React.FC<StazeniProps> = ({ articles }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ke stažení</h1>
        <p className="text-muted-foreground mt-2">
          Nástroje a soubory připravené ke stažení.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <PenTool size={24} className="text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">E-mailový podpis</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Vytvořte si firemní podpis a stáhněte ho jako HTML soubor nebo použijte kopírování do schránky.
          </p>
          <Link to="/tools/generator">
            <Button variant="outline" className="w-full">
              Otevřít generátor <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <FileText size={24} className="text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Export do PDF</h3>
          <p className="text-sm text-muted-foreground mb-4">
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
