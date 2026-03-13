import { getSupabase } from '../lib/supabase';
// FIX: Import the Database type to allow explicit casting for resolving type errors.
import { Article, Category, Database } from '../types';

export const api = {
  // --- AUTH a USER management je kompletně odstraněn ---

  // --- CONTENT ---
  async getCategories(): Promise<Category[]> {
    const sb = getSupabase();
    if (!sb) return [];
    
    const { data, error } = await sb.from('categories').select('*').order('name');
    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
    return data || [];
  },

  async createCategory(name: string): Promise<Category | null> {
      const sb = getSupabase();
      if (!sb) return null;
      
      // FIX: Explicitly type the insert payload to avoid type inference issues with the Supabase client, which were causing a 'never' type error.
      const newCategory: Database['public']['Tables']['categories']['Insert'] = { name, parent_id: null };
      const { data, error } = await sb.from('categories').insert([newCategory]).select().single();
      if(error) throw error;
      return data;
  },

  async getArticles(): Promise<Article[]> {
    const sb = getSupabase();
    if (!sb) return [];
    
    const { data, error } = await sb
        .from('articles')
        .select('*')
        .order('updated_at', { ascending: false });
        
    if (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
    return data || [];
  },

  async getArticle(id: string): Promise<Article | null> {
    const sb = getSupabase();
    if (!sb) return null;

    const { data, error } = await sb.from('articles').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  },

  async saveArticle(article: Partial<Article>, id?: string) {
    const sb = getSupabase();
    if (!sb) throw new Error("No connection");

    // Odstraněna kontrola uživatele, zapisovat může kdokoliv (dle RLS)
    const { id: _, created_at: __, ...rest } = article;

    const payload = {
        ...rest,
        updated_at: new Date().toISOString(),
        author_email: "admin@intranet" // Pevně daný autor
    };

    if (id) {
        // FIX: Explicitly type the payload to resolve the 'never' type inference issue with the Supabase client.
        const updatePayload: Database['public']['Tables']['articles']['Update'] = payload;
        const { error } = await sb.from('articles').update(updatePayload).eq('id', id);
        if (error) throw new Error(error.message);
    } else {
        // FIX: Explicitly type the insert payload to resolve the 'never' type inference issue and pass it as an array.
        const insertPayload: Database['public']['Tables']['articles']['Insert'] = {
            ...payload,
            created_at: new Date().toISOString()
        };
        const { error } = await sb.from('articles').insert([insertPayload]);
        if (error) throw new Error(error.message);
    }
  },

  async deleteArticle(id: string) {
    const sb = getSupabase();
    if (!sb) throw new Error("No connection");
    
    const { error } = await sb.from('articles').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async uploadArticleImage(file: File): Promise<string> {
    const sb = getSupabase();
    if (!sb) throw new Error("No connection");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `articles/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const bucket = 'article-images';

    const performUpload = async () =>
      sb.storage.from(bucket).upload(filePath, file, {
        upsert: false,
        cacheControl: '3600',
        contentType: file.type || 'application/octet-stream',
      });

    let { error: uploadError } = await performUpload();

    if (uploadError && uploadError.message.toLowerCase().includes('bucket')) {
      await sb.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: '5MB',
      });
      ({ error: uploadError } = await performUpload());
    }

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = sb.storage.from(bucket).getPublicUrl(filePath);
    if (!data.publicUrl) {
      throw new Error('Nepodařilo se získat veřejnou URL obrázku.');
    }

    return data.publicUrl;
  },
};
