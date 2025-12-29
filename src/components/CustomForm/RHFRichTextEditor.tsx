import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Label } from "../ui/Label";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { useEffect, useState } from "react";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  rows?: number;
};

export function RHFRichTextEditor<T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
  error,
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const [isFocused, setIsFocused] = useState(false);
        const editor = useEditor({
          extensions: [
            StarterKit.configure({
              bulletList: false,
              orderedList: false,
            }),
            UnderlineExtension,
            BulletList,
            OrderedList,
            ListItem,
          ],
          content: value || '',
          editable: !disabled,
          onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
          },
          onFocus: () => setIsFocused(true),
          onBlur: () => setIsFocused(false),
          editorProps: {
            attributes: {
              class: 'prose prose-invert max-w-none focus:outline-none px-4 py-3 min-h-[100px]',
            },
          },
        });

        // Actualizar contenido cuando cambia externamente
        useEffect(() => {
          if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
          }
        }, [value, editor]);

        return (
          <div className="space-y-2">
            {label && (
              <Label htmlFor={name} className="text-gray-300">
                {label}
              </Label>
            )}
            
            <div className="border border-gray-700 rounded-lg bg-[#1a1a1a] overflow-hidden focus-within:ring-2 focus-within:ring-purple-600 transition-all">
              {/* Toolbar */}
              {isFocused && (
                <div className="flex items-center gap-1 p-2 bg-[#0f0f0f] border-b border-gray-700 animate-slide-down">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  disabled={disabled || !editor}
                  className={`p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    editor?.isActive('bold') ? 'bg-purple-600/30 text-purple-300' : 'hover:bg-purple-600/20 text-gray-300'
                  }`}
                  title="Negrita"
                >
                  <Bold className="w-4 h-4" />
                </button>
                
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  disabled={disabled || !editor}
                  className={`p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    editor?.isActive('italic') ? 'bg-purple-600/30 text-purple-300' : 'hover:bg-purple-600/20 text-gray-300'
                  }`}
                  title="Cursiva"
                >
                  <Italic className="w-4 h-4" />
                </button>
                
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  disabled={disabled || !editor}
                  className={`p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    editor?.isActive('underline') ? 'bg-purple-600/30 text-purple-300' : 'hover:bg-purple-600/20 text-gray-300'
                  }`}
                  title="Subrayado"
                >
                  <Underline className="w-4 h-4" />
                </button>
                
                <div className="w-px h-6 bg-gray-700 mx-1" />
                
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  disabled={disabled || !editor}
                  className={`p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    editor?.isActive('bulletList') ? 'bg-purple-600/30 text-purple-300' : 'hover:bg-purple-600/20 text-gray-300'
                  }`}
                  title="Lista con viñetas"
                >
                  <List className="w-4 h-4" />
                </button>
                
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  disabled={disabled || !editor}
                  className={`p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    editor?.isActive('orderedList') ? 'bg-purple-600/30 text-purple-300' : 'hover:bg-purple-600/20 text-gray-300'
                  }`}
                  title="Lista numerada"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>
              )}

              {/* Editor */}
              {editor && (
                <EditorContent 
                  editor={editor}
                  className="text-white [&_.ProseMirror]:min-h-[100px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:text-white [&_.ProseMirror_p]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_ol]:my-2 [&_.ProseMirror_strong]:font-bold [&_.ProseMirror_em]:italic [&_.ProseMirror_u]:underline"
                />
              )}
            </div>
            
            {error && (
              <p className="text-rose-400 text-sm">{error}</p>
            )}
            
          </div>
        );
      }}
    />
  );
}
