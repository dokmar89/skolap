import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { Button, Card } from '../components/ui';
import { Printer, FileText } from 'lucide-react';

interface PdfToolsProps {
    articles: Article[];
}

export const PdfTools: React.FC<PdfToolsProps> = ({ articles }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Export do PDF</h1>
                <p className="text-muted-foreground">Vyberte článek, který chcete vytisknout nebo uložit jako PDF.</p>
            </div>
            <Card className="divide-y border-border shadow-md">
                {articles.length === 0 ? (
                    <p className="p-8 text-center text-muted-foreground">Nejsou k dispozici žádné články k exportu.</p>
                ) : (
                    articles.map(article => (
                        <div key={article.id} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex items-center min-w-0">
                                <FileText className="mr-4 text-primary shrink-0" size={20}/>
                                <span className="font-medium truncate">{article.title}</span>
                            </div>
                            <Link to={`/article/${article.id}?print=true`} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                    <Printer size={16} className="mr-2"/>
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
