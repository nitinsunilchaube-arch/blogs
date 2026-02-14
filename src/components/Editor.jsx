import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Typography from '@tiptap/extension-typography';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { useState, useCallback } from 'react';
import { uploadImage, isImageConfigured } from '../services/imageUpload';
import ImageUploadModal from './ImageUploadModal';
import toast from 'react-hot-toast';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Minus,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  ImageIcon,
  Highlighter,
  Table as TableIcon,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  CodeSquare,
  Palette,
  Plus,
  Trash2,
  RowsIcon,
  ColumnsIcon,
} from 'lucide-react';

const MenuBar = ({ editor, onImageClick }) => {
  if (!editor) return null;

  const addLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  return (
    <div className="editor-menubar">
      <div className="menu-group">
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo" className="menu-btn">
          <Undo2 size={16} />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo" className="menu-btn">
          <Redo2 size={16} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`menu-btn ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`} title="Heading 1">
          <Heading1 size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`menu-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`} title="Heading 2">
          <Heading2 size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`menu-btn ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`} title="Heading 3">
          <Heading3 size={16} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`menu-btn ${editor.isActive('bold') ? 'is-active' : ''}`} title="Bold">
          <Bold size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`menu-btn ${editor.isActive('italic') ? 'is-active' : ''}`} title="Italic">
          <Italic size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`menu-btn ${editor.isActive('underline') ? 'is-active' : ''}`} title="Underline">
          <UnderlineIcon size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`menu-btn ${editor.isActive('strike') ? 'is-active' : ''}`} title="Strikethrough">
          <Strikethrough size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={`menu-btn ${editor.isActive('highlight') ? 'is-active' : ''}`} title="Highlight">
          <Highlighter size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleSuperscript().run()} className={`menu-btn ${editor.isActive('superscript') ? 'is-active' : ''}`} title="Superscript">
          <SuperscriptIcon size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleSubscript().run()} className={`menu-btn ${editor.isActive('subscript') ? 'is-active' : ''}`} title="Subscript">
          <SubscriptIcon size={16} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          title="Text Color"
          className="color-input"
        />
        <button onClick={() => editor.chain().focus().unsetColor().run()} className="menu-btn" title="Reset Color">
          <Palette size={16} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`menu-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`} title="Align Left">
          <AlignLeft size={16} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`menu-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`} title="Align Center">
          <AlignCenter size={16} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`menu-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`} title="Align Right">
          <AlignRight size={16} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`menu-btn ${editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}`} title="Justify">
          <AlignJustify size={16} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`menu-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`} title="Bullet List">
          <List size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`menu-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`} title="Ordered List">
          <ListOrdered size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`menu-btn ${editor.isActive('taskList') ? 'is-active' : ''}`} title="Task List">
          <ListChecks size={16} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`menu-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`} title="Blockquote">
          <Quote size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleCode().run()} className={`menu-btn ${editor.isActive('code') ? 'is-active' : ''}`} title="Inline Code">
          <Code size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`menu-btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`} title="Code Block">
          <CodeSquare size={16} />
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="menu-btn" title="Horizontal Rule">
          <Minus size={16} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button onClick={addLink} className={`menu-btn ${editor.isActive('link') ? 'is-active' : ''}`} title="Add Link">
          <LinkIcon size={16} />
        </button>
        {editor.isActive('link') && (
          <button onClick={() => editor.chain().focus().unsetLink().run()} className="menu-btn" title="Remove Link">
            <Unlink size={16} />
          </button>
        )}
        <button onClick={onImageClick} className="menu-btn" title="Insert Image">
          <ImageIcon size={16} />
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button onClick={addTable} className="menu-btn" title="Insert Table">
          <TableIcon size={16} />
        </button>
        {editor.isActive('table') && (
          <>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="menu-btn" title="Add Column">
              <ColumnsIcon size={14} /><Plus size={10} />
            </button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()} className="menu-btn" title="Add Row">
              <RowsIcon size={14} /><Plus size={10} />
            </button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} className="menu-btn danger" title="Delete Table">
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function Editor({ content, onChange, placeholder }) {
  const [showImageModal, setShowImageModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your story...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'editor-image' },
        allowBase64: true,
      }),
      Highlight.configure({ multicolor: true }),
      Color,
      TextStyle,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Typography,
      Superscript,
      Subscript,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: { class: 'prose-editor' },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (files?.length && files[0].type.startsWith('image/')) {
          event.preventDefault();
          handleDroppedImage(files[0], view, event);
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) handleDroppedImage(file, view);
            return true;
          }
        }
        return false;
      },
    },
  });

  const handleDroppedImage = async (file, view, event) => {
    if (!isImageConfigured()) {
      toast.error('Configure image hosting in Settings first');
      return;
    }
    const toastId = toast.loading('Uploading image...');
    try {
      const url = await uploadImage(file);
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      toast.success('Image uploaded!', { id: toastId });
    } catch (err) {
      toast.error(err.message || 'Upload failed', { id: toastId });
    }
  };

  const handleImageInsert = (url) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="editor-wrapper">
      <MenuBar editor={editor} onImageClick={() => setShowImageModal(true)} />
      <EditorContent editor={editor} className="editor-content" />
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsert={handleImageInsert}
      />
    </div>
  );
}
