export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'user';
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category_id: string; // Changed to match DB column snake_case
  created_at: string;
  updated_at: string;
  author_email: string;
}

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  icon?: string;
}

// Database Schema helper for Supabase
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: User;
        // FIX: Expanded Partial<User> to prevent type inference issues.
        Insert: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          role?: 'admin' | 'user';
        };
        // FIX: Expanded Partial<User> to prevent type inference issues.
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          role?: 'admin' | 'user';
        };
      };
      articles: {
        Row: Article;
        // FIX: Expanded Partial<Article> to prevent type inference issues.
        Insert: {
          id?: string;
          title?: string;
          content?: string;
          category_id?: string;
          created_at?: string;
          updated_at?: string;
          author_email?: string;
        };
        // FIX: Expanded Partial<Article> to prevent type inference issues.
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category_id?: string;
          created_at?: string;
          updated_at?: string;
          author_email?: string;
        };
      };
      categories: {
        Row: Category;
        // FIX: Expanded Omit<Category, 'id'> to prevent type inference issues.
        Insert: {
          name: string;
          parent_id: string | null;
          icon?: string;
        };
        // FIX: Expanded Partial<Category> to prevent type inference issues.
        Update: {
          id?: string;
          name?: string;
          parent_id?: string | null;
          icon?: string;
        };
      };
    };
  };
};
