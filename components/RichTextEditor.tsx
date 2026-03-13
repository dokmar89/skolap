import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  RotateCw,
  Eraser,
  Minus,
  Code,
  Type,
  PanelTop,
  Table2,
  ImagePlus,
} from 'lucide-react';

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
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, onClick, onMouseDown, disabled }) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className="h-8 w-8"
    title={label}
    disabled={disabled}
    onMouseDown={(e) => {
      onMouseDown?.(e);
      e.preventDefault();
    }}
    onClick={onClick}
  >
    {icon}
  </Button>
);

const BLOCK_TAGS = ['P', 'DIV', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'PRE', 'LI'];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onUploadImage,
  placeholder = 'Začněte psát článek...',
  minHeight = 360,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [fontColor, setFontColor] = useState('#1e293b');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  useEffect(() => {
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('defaultParagraphSeparator', false, 'p');
  }, []);

  const updateValue = () => {
    onChange(editorRef.current?.innerHTML || '');
  };

  const saveSelection = (_event?: unknown) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return;
    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;
    savedRangeRef.current = range.cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !savedRangeRef.current) return;
    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  };

  const findEditableBlock = (node: Node | null): HTMLElement | null => {
    if (!node || !editorRef.current) return null;

    let current: Node | null = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
    while (current && current !== editorRef.current) {
      if (current instanceof HTMLElement && BLOCK_TAGS.includes(current.tagName)) {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  };

  const manualBlockWrap = (tagName: 'h1' | 'h2' | 'h3' | 'p' | 'blockquote' | 'pre') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const block = findEditableBlock(range.commonAncestorContainer);

    if (block) {
      if (block.tagName.toLowerCase() === tagName) {
        return;
      }
      const replacement = document.createElement(tagName);
      replacement.innerHTML = block.innerHTML || '<br>';
      block.replaceWith(replacement);
      const newRange = document.createRange();
      newRange.selectNodeContents(replacement);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();
      return;
    }

    const wrapper = document.createElement(tagName);
    if (range.collapsed) {
      wrapper.innerHTML = '<br>';
      range.insertNode(wrapper);
    } else {
      const selectedContent = range.extractContents();
      wrapper.appendChild(selectedContent);
      range.insertNode(wrapper);
    }
    const newRange = document.createRange();
    newRange.selectNodeContents(wrapper);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
    savedRangeRef.current = newRange.cloneRange();
  };

  const runCommand = (command: string, commandValue?: string): boolean => {
    restoreSelection();
    editorRef.current?.focus();
    const worked = document.execCommand(command, false, commandValue);
    saveSelection();
    updateValue();
    return worked;
  };

  const runBlockCommand = (tagName: 'h1' | 'h2' | 'h3' | 'p' | 'blockquote' | 'pre') => {
    restoreSelection();
    editorRef.current?.focus();
    manualBlockWrap(tagName);
    saveSelection();
    updateValue();
  };

  const insertHtmlAtCursor = (html: string) => {
    restoreSelection();
    editorRef.current?.focus();
    const worked = document.execCommand('insertHTML', false, html);
    if (!worked) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const fragment = range.createContextualFragment(html);
      range.deleteContents();
      range.insertNode(fragment);
      range.collapse(false);
    }
    saveSelection();
    updateValue();
  };

  const insertLink = () => {
    restoreSelection();
    const url = window.prompt('Vložte URL odkazu (např. https://example.com):');
    if (!url) return;
    runCommand('createLink', url);
  };

  const insertInfoBox = () => {
    insertHtmlAtCursor(
      '<div style="border:1px solid #cbd5e1;padding:12px;border-radius:8px;background:#f8fafc;"><strong>Poznámka:</strong> </div><p><br></p>'
    );
  };

  const insertTable = () => {
    const rowsRaw = window.prompt('Počet řádků tabulky:', '3');
    const colsRaw = window.prompt('Počet sloupců tabulky:', '3');
    if (!rowsRaw || !colsRaw) return;

    const rows = Math.max(1, Math.min(20, Number(rowsRaw)));
    const cols = Math.max(1, Math.min(10, Number(colsRaw)));
    if (!Number.isFinite(rows) || !Number.isFinite(cols)) {
      alert('Neplatný počet řádků/sloupců.');
      return;
    }

    let tableHtml =
      '<table style="width:100%;border-collapse:collapse;margin:16px 0;"><tbody>';
    for (let r = 0; r < rows; r += 1) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c += 1) {
        const isHeader = r === 0;
        const cellTag = isHeader ? 'th' : 'td';
        const cellStyle = isHeader
          ? 'border:1px solid #cbd5e1;padding:8px;background:#f1f5f9;text-align:left;'
          : 'border:1px solid #cbd5e1;padding:8px;';
        tableHtml += `<${cellTag} style="${cellStyle}">${isHeader ? `Nadpis ${c + 1}` : '&nbsp;'}</${cellTag}>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';
    insertHtmlAtCursor(tableHtml);
  };

  const insertImageByUrl = (url: string) => {
    const imageHtml = `<figure style="margin:20px 0;"><img src="${url}" alt="Obrázek v článku" style="max-width:100%;height:auto;border-radius:8px;" /><figcaption style="font-size:12px;color:#64748b;margin-top:6px;">Popisek obrázku</figcaption></figure><p><br></p>`;
    insertHtmlAtCursor(imageHtml);
  };

  const uploadAndInsertImage = async (file: File) => {
    if (!onUploadImage) {
      alert('Upload obrázku není nakonfigurován.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Podporované jsou pouze obrázky.');
      return;
    }

    try {
      setIsUploading(true);
      const imageUrl = await onUploadImage(file);
      insertImageByUrl(imageUrl);
    } catch (e: any) {
      alert(`Upload obrázku selhal: ${e.message || 'Neznámá chyba'}`);
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

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    saveSelection();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadAndInsertImage(file);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const files = e.clipboardData.files;
    if (!files || files.length === 0) return;
    const image = Array.from(files).find((file) => file.type.startsWith('image/'));
    if (!image) return;
    e.preventDefault();
    saveSelection();
    await uploadAndInsertImage(image);
  };

  return (
    <div className="rounded-md border border-input bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        <ToolButton icon={<Heading1 size={15} />} label="Nadpis 1" onClick={() => runBlockCommand('h1')} onMouseDown={saveSelection} />
        <ToolButton icon={<Heading2 size={15} />} label="Nadpis 2" onClick={() => runBlockCommand('h2')} onMouseDown={saveSelection} />
        <ToolButton icon={<Heading3 size={15} />} label="Nadpis 3" onClick={() => runBlockCommand('h3')} onMouseDown={saveSelection} />
        <ToolButton icon={<Type size={15} />} label="Odstavec" onClick={() => runBlockCommand('p')} onMouseDown={saveSelection} />

        <div className="mx-1 h-5 w-px bg-border" />

        <ToolButton icon={<Bold size={15} />} label="Tučně" onClick={() => runCommand('bold')} onMouseDown={saveSelection} />
        <ToolButton icon={<Italic size={15} />} label="Kurzíva" onClick={() => runCommand('italic')} onMouseDown={saveSelection} />
        <ToolButton icon={<Underline size={15} />} label="Podtržení" onClick={() => runCommand('underline')} onMouseDown={saveSelection} />
        <ToolButton icon={<Strikethrough size={15} />} label="Přeškrtnutí" onClick={() => runCommand('strikeThrough')} onMouseDown={saveSelection} />

        <div className="mx-1 h-5 w-px bg-border" />

        <div className="flex items-center gap-1 rounded-md border px-2 py-1">
          <span className="text-xs text-muted-foreground">A</span>
          <input
            type="color"
            value={fontColor}
            onMouseDown={saveSelection}
            onChange={(e) => {
              setFontColor(e.target.value);
              runCommand('foreColor', e.target.value);
            }}
            className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
            title="Barva písma"
          />
        </div>

        <div className="flex items-center gap-1 rounded-md border px-2 py-1">
          <Highlighter size={14} />
          <input
            type="color"
            value={highlightColor}
            onMouseDown={saveSelection}
            onChange={(e) => {
              setHighlightColor(e.target.value);
              const worked = runCommand('hiliteColor', e.target.value);
              if (!worked) {
                runCommand('backColor', e.target.value);
              }
            }}
            className="h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
            title="Zvýraznění textu"
          />
        </div>

        <div className="mx-1 h-5 w-px bg-border" />

        <ToolButton icon={<List size={15} />} label="Odrážky" onClick={() => runCommand('insertUnorderedList')} onMouseDown={saveSelection} />
        <ToolButton icon={<ListOrdered size={15} />} label="Číslování" onClick={() => runCommand('insertOrderedList')} onMouseDown={saveSelection} />
        <ToolButton icon={<Quote size={15} />} label="Citace" onClick={() => runBlockCommand('blockquote')} onMouseDown={saveSelection} />
        <ToolButton icon={<Code size={15} />} label="Kód" onClick={() => runBlockCommand('pre')} onMouseDown={saveSelection} />
        <ToolButton icon={<PanelTop size={15} />} label="Rámeček" onClick={insertInfoBox} onMouseDown={saveSelection} />
        <ToolButton icon={<Table2 size={15} />} label="Tabulka" onClick={insertTable} onMouseDown={saveSelection} />
        <ToolButton icon={<Minus size={15} />} label="Oddělovač" onClick={() => runCommand('insertHorizontalRule')} onMouseDown={saveSelection} />

        <div className="mx-1 h-5 w-px bg-border" />

        <ToolButton icon={<AlignLeft size={15} />} label="Zarovnat vlevo" onClick={() => runCommand('justifyLeft')} onMouseDown={saveSelection} />
        <ToolButton icon={<AlignCenter size={15} />} label="Zarovnat na střed" onClick={() => runCommand('justifyCenter')} onMouseDown={saveSelection} />
        <ToolButton icon={<AlignRight size={15} />} label="Zarovnat vpravo" onClick={() => runCommand('justifyRight')} onMouseDown={saveSelection} />
        <ToolButton icon={<LinkIcon size={15} />} label="Vložit odkaz" onClick={insertLink} onMouseDown={saveSelection} />
        <ToolButton
          icon={<ImagePlus size={15} />}
          label="Vložit obrázek"
          onClick={() => fileInputRef.current?.click()}
          onMouseDown={saveSelection}
          disabled={isUploading || !onUploadImage}
        />
        <ToolButton
          icon={<Eraser size={15} />}
          label="Smazat formátování"
          onClick={() => {
            runCommand('removeFormat');
            runCommand('unlink');
          }}
          onMouseDown={saveSelection}
        />
        <ToolButton icon={<RotateCcw size={15} />} label="Zpět" onClick={() => runCommand('undo')} onMouseDown={saveSelection} />
        <ToolButton icon={<RotateCw size={15} />} label="Znovu" onClick={() => runCommand('redo')} onMouseDown={saveSelection} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onFocus={saveSelection}
        onBlur={saveSelection}
        onPaste={handlePaste}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          setIsDraggingOver(false);
        }}
        onDrop={handleDrop}
        onInput={() => {
          updateValue();
          saveSelection();
        }}
        className="rich-editor prose prose-slate dark:prose-invert max-w-none p-4 focus:outline-none"
        style={{
          minHeight,
          outline: isDraggingOver ? '2px dashed hsl(var(--primary))' : undefined,
          outlineOffset: isDraggingOver ? '-8px' : undefined,
          background: isDraggingOver ? 'rgba(59,130,246,0.06)' : undefined,
        }}
        data-placeholder={isUploading ? 'Nahrávám obrázek…' : placeholder}
      />
    </div>
  );
};
