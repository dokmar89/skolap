import React, { useMemo, useRef, useState } from 'react';
import {
  Bold,
  Code,
  Eye,
  EyeOff,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  PanelTop,
  Quote,
  Table2,
  Type,
} from 'lucide-react';
import { sanitizeArticleHtml } from '../lib/html';
import { Button } from './ui';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
  placeholder?: string;
  minHeight?: number;
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, onClick, disabled }) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className="h-8 gap-2 px-2"
    title={label}
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </Button>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onUploadImage,
  placeholder = 'Sem piste HTML obsah clanku...',
  minHeight = 360,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const previewHtml = useMemo(() => sanitizeArticleHtml(value), [value]);

  const focusEditor = () => {
    textareaRef.current?.focus();
  };

  const replaceSelection = (before: string, after = '', fallback = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const selectedText = value.slice(start, end);
    const text = selectedText || fallback;
    const nextValue = `${value.slice(0, start)}${before}${text}${after}${value.slice(end)}`;
    onChange(nextValue);

    requestAnimationFrame(() => {
      focusEditor();
      const cursorStart = start + before.length;
      const cursorEnd = cursorStart + text.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const insertAtCursor = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const nextValue = `${value.slice(0, start)}${snippet}${value.slice(end)}`;
    onChange(nextValue);

    requestAnimationFrame(() => {
      focusEditor();
      const cursor = start + snippet.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const insertLink = () => {
    const url = window.prompt('Vlozte URL odkazu:', 'https://');
    if (!url) return;
    replaceSelection(`<a href="${url}" target="_blank" rel="noreferrer">`, '</a>', 'Text odkazu');
  };

  const insertTable = () => {
    const snippet = [
      '<table style="width:100%; border-collapse:collapse; margin:16px 0;">',
      '  <thead>',
      '    <tr>',
      '      <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Sloupec 1</th>',
      '      <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Sloupec 2</th>',
      '    </tr>',
      '  </thead>',
      '  <tbody>',
      '    <tr>',
      '      <td style="border:1px solid #cbd5e1; padding:8px;">Hodnota</td>',
      '      <td style="border:1px solid #cbd5e1; padding:8px;">Hodnota</td>',
      '    </tr>',
      '  </tbody>',
      '</table>',
      '',
    ].join('\n');
    insertAtCursor(snippet);
  };

  const insertInfoBox = () => {
    const snippet = [
      '<div style="border:1px solid #cbd5e1; padding:12px; border-radius:8px; background:#f8fafc; margin:16px 0;">',
      '  <strong>Poznamka:</strong> ',
      '</div>',
      '',
    ].join('\n');
    insertAtCursor(snippet);
  };

  const uploadAndInsertImage = async (file: File) => {
    if (!onUploadImage) {
      alert('Upload obrazku neni nakonfigurovan.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Podporovany jsou pouze obrazky.');
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await onUploadImage(file);
      insertAtCursor(
        [
          '<figure style="margin:20px 0;">',
          `  <img src="${imageUrl}" alt="Obrazek v clanku" style="max-width:100%; height:auto; border-radius:8px;" />`,
          '  <figcaption style="font-size:12px; color:#64748b; margin-top:6px;">Popisek obrazku</figcaption>',
          '</figure>',
          '',
        ].join('\n'),
      );
    } catch (error: any) {
      alert(`Upload obrazku selhal: ${error?.message || 'Neznama chyba'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndInsertImage(file);
    e.target.value = '';
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files: File[] = Array.from(e.clipboardData.files || []);
    const image = files.find((file) => file.type.startsWith('image/'));
    if (!image) return;

    e.preventDefault();
    await uploadAndInsertImage(image);
  };

  return (
    <div className="rounded-md border border-input bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        <ToolButton icon={<Heading2 size={15} />} label="H2" onClick={() => replaceSelection('<h2>', '</h2>', 'Nadpis sekce')} />
        <ToolButton icon={<Heading3 size={15} />} label="H3" onClick={() => replaceSelection('<h3>', '</h3>', 'Podnadpis')} />
        <ToolButton icon={<Type size={15} />} label="Odstavec" onClick={() => replaceSelection('<p>', '</p>', 'Text odstavce')} />
        <ToolButton icon={<Bold size={15} />} label="Bold" onClick={() => replaceSelection('<strong>', '</strong>', 'Zvyrazneni')} />
        <ToolButton icon={<Italic size={15} />} label="Kurziva" onClick={() => replaceSelection('<em>', '</em>', 'Kurziva')} />
        <ToolButton icon={<Quote size={15} />} label="Citace" onClick={() => replaceSelection('<blockquote>', '</blockquote>', 'Citace')} />
        <ToolButton icon={<Code size={15} />} label="Kod" onClick={() => replaceSelection('<pre><code>', '</code></pre>', 'Ukazka kodu')} />
        <ToolButton icon={<List size={15} />} label="Odrzky" onClick={() => insertAtCursor('<ul>\n  <li>Polozka</li>\n  <li>Polozka</li>\n</ul>\n')} />
        <ToolButton icon={<ListOrdered size={15} />} label="Cisla" onClick={() => insertAtCursor('<ol>\n  <li>Krok</li>\n  <li>Krok</li>\n</ol>\n')} />
        <ToolButton icon={<LinkIcon size={15} />} label="Odkaz" onClick={insertLink} />
        <ToolButton icon={<PanelTop size={15} />} label="Box" onClick={insertInfoBox} />
        <ToolButton icon={<Table2 size={15} />} label="Tabulka" onClick={insertTable} />
        <ToolButton icon={<Minus size={15} />} label="Oddelovac" onClick={() => insertAtCursor('<hr />\n')} />
        <ToolButton
          icon={<ImagePlus size={15} />}
          label="Obrazek"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || !onUploadImage}
        />
        <ToolButton
          icon={showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
          label={showPreview ? 'Skryt nahled' : 'Nahled'}
          onClick={() => setShowPreview((current) => !current)}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div className={`grid gap-0 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        <div className={showPreview ? 'border-b lg:border-b-0 lg:border-r border-border' : ''}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            placeholder={isUploading ? 'Nahravam obrazek...' : placeholder}
            className="w-full resize-y border-0 bg-transparent p-4 font-mono text-sm leading-6 focus:outline-none"
            style={{ minHeight }}
            spellCheck={false}
          />
        </div>

        {showPreview && (
          <div className="min-h-full bg-slate-50/60 p-4 dark:bg-slate-900/30" style={{ minHeight }}>
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Zivy nahled
            </div>
            <div
              className="prose prose-slate max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-muted-foreground">Nahled se zobrazi tady.</p>' }}
            />
          </div>
        )}
      </div>

      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        Editor uklada ciste HTML. Muzete psat rucne nebo pouzit tlacitka jako naseptavac pro zakladni bloky.
      </div>
    </div>
  );
};
