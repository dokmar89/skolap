import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ChevronLeft, Loader2, Plus, Save } from 'lucide-react';
import { Category } from '../types';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../components/ui';
import { RichTextEditor } from '../components/RichTextEditor';
import { sanitizeArticleHtml } from '../lib/html';
import { api } from '../services/api';

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
    };

    loadData();
  }, [id, isNew, searchParams]);

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;

    try {
      const newCat = await api.createCategory(newCategoryName);
      if (newCat) {
        setCategories([...categories, newCat]);
        setCategoryId(newCat.id);
        setShowCatInput(false);
        setNewCategoryName('');
      }
    } catch (e: any) {
      alert(`Chyba vytvoření kategorie: ${e.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert('Musíte vybrat nebo vytvořit kategorii.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      await api.saveArticle(
        {
          title,
          content: sanitizeArticleHtml(content),
          category_id: categoryId,
        },
        isNew ? undefined : id,
      );

      navigate('/');
      window.location.reload();
    } catch (e: any) {
      console.error(e);
      if (e.message.includes('policy') || e.message.includes('permission')) {
        setErrorMsg("Chyba oprávnění: Supabase odmítla uložení. Spusťte znovu aktualizovaný 'db_schema.sql' script v Supabase.");
      } else {
        setErrorMsg(`Chyba při ukládání: ${e.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 text-muted-foreground hover:bg-transparent hover:pl-0 hover:text-primary">
          <ChevronLeft size={16} className="mr-1" />
          Zrušit
        </Button>
      </div>

      <Card className="overflow-hidden rounded-[2rem] border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>{isNew ? 'Nový článek' : 'Upravit článek'}</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-6 flex items-start rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
              <AlertTriangle className="mr-2 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-bold">Nastala chyba</p>
                <p className="text-sm">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
              <div className="space-y-6 rounded-2xl border border-border bg-slate-50/60 p-5 dark:bg-slate-900/20">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Nadpis</label>
                  <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Jak nastavit..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Kategorie</label>
                  {!showCatInput ? (
                    <div className="flex gap-2">
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {categories.length === 0 && <option value="">-- Žádná kategorie --</option>}
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <Button type="button" variant="outline" size="icon" onClick={() => setShowCatInput(true)} title="Nová kategorie">
                        <Plus size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input placeholder="Název kategorie..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                      <Button type="button" size="sm" onClick={handleCreateCategory}>
                        OK
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowCatInput(false)}>
                        X
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Obsah článku</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  onUploadImage={api.uploadArticleImage}
                  placeholder="Sem napište obsah článku..."
                  minHeight={520}
                />
                <p className="text-xs text-muted-foreground">
                  Editor podporuje nadpisy, seznamy, rámečky, tabulky, odkazy a obrázky.
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t pt-4">
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
