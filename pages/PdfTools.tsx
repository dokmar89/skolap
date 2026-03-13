import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Printer } from 'lucide-react';
import { Article } from '../types';
import { Button, Card } from '../components/ui';

interface PdfToolsProps {
  articles: Article[];
}

export const PdfTools: React.FC<PdfToolsProps> = ({ articles }) => {
  return (
    <div className="w-full">
      <div className="mb-8 rounded-[2rem] border border-border/60 bg-white/70 p-8 shadow-sm dark:bg-card/70">
        <h1 className="mb-2 text-3xl font-bold">Export do PDF</h1>
        <p className="max-w-2xl text-muted-foreground">Vyberte článek, který chcete vytisknout nebo uložit jako PDF.</p>
      </div>

      <Card className="max-w-5xl divide-y border-border shadow-md">
        {articles.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">Nejsou k dispozici žádné články k exportu.</p>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent/50">
              <div className="flex min-w-0 items-center">
                <FileText className="mr-4 shrink-0 text-primary" size={20} />
                <span className="truncate font-medium">{article.title}</span>
              </div>
              <Link to={`/article/${article.id}?print=true`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Printer size={16} className="mr-2" />
                  Exportovat
                </Button>
              </Link>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
