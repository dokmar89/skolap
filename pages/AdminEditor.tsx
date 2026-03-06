import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Article, Category } from '../types';
import { api } from '../services/api';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Save, ChevronLeft, Loader2, Plus, AlertTriangle } from 'lucide-react';

export const AdminEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCatInput, setShowCatInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  useEffect(() => {
    // Prefill title if provided in URL (e.g. from Dashboard)
    const titleParam = searchParams.get('title');
    if (titleParam && isNew) {
        setTitle(titleParam);
    }

    const loadData = async () => {
        const cats = await api.getCategories();
        setCategories(cats);
        if (cats.length > 0 && !categoryId) setCategoryId(cats[0].id);

        if (!isNew && id) {
            const existing = await api.getArticle(id);
            if (existing) {
                setTitle(existing.title);
                setContent(existing.content);
                setCategoryId(existing.category_id);
            }
        }
    }
    loadData();
  }, [id, isNew, searchParams]);

  const handleCreateCategory = async () => {
      if(!newCategoryName) return;
      try {
          const newCat = await api.createCategory(newCategoryName);
          if(newCat) {
              setCategories([...categories, newCat]);
              setCategoryId(newCat.id);
              setShowCatInput(false);
              setNewCategoryName('');
          }
      } catch (e) {
          alert('Chyba vytvoření kategorie: ' + (e as any).message);
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
        alert("Musíte vybrat nebo vytvořit kategorii.");
        return;
    }

    setSaving(true);
    setErrorMsg('');
    
    try {
        await api.saveArticle({
            title,
            content,
            category_id: categoryId
        }, isNew ? undefined : id);
        
        navigate('/');
        window.location.reload(); 
    } catch (e: any) {
        console.error(e);
        if (e.message.includes('policy') || e.message.includes('permission')) {
            setErrorMsg("CHYBA OPRÁVNĚNÍ: Supabase databáze odmítla uložení. Spusťte prosím znovu aktualizovaný 'db_schema.sql' script v Supabase SQL editoru.");
        } else {
            setErrorMsg("Chyba při ukládání: " + e.message);
        }
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
         <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-primary">
            <ChevronLeft size={16} className="mr-1" />
            Zrušit
         </Button>
      </div>

      <Card>
        <CardHeader>
             <CardTitle>{isNew ? 'Nový článek' : 'Upravit článek'}</CardTitle>
        </CardHeader>
        <CardContent>
            {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200 flex items-start">
                    <AlertTriangle className="mr-2 shrink-0 mt-0.5" size={18} />
                    <div>
                        <p className="font-bold">Nastala chyba</p>
                        <p className="text-sm">{errorMsg}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nadpis</label>
                        <Input
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Jak nastavit..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Kategorie</label>
                        {!showCatInput ? (
                            <div className="flex gap-2">
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {categories.length === 0 && <option value="">-- Žádné kategorie --</option>}
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <Button type="button" variant="outline" size="icon" onClick={() => setShowCatInput(true)} title="Nová kategorie">
                                    <Plus size={16} />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Název kategorie..." 
                                    value={newCategoryName} 
                                    onChange={e => setNewCategoryName(e.target.value)}
                                />
                                <Button type="button" size="sm" onClick={handleCreateCategory}>OK</Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCatInput(false)}>X</Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Obsah (HTML)</label>
                <div className="relative">
                    <textarea
                        required
                        rows={15}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                        placeholder="<p>Text článku...</p>"
                    />
                </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saving ? 'Ukládání...' : 'Publikovat'}
                    {!saving && <Save size={16} className="ml-2" />}
                </Button>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
};