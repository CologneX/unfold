"use client";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { CharacterCount } from "@tiptap/extension-character-count";
import WordsCounter from "./WordsCounter";
import { Divider } from "@mantine/core";

interface TextAreaEditorProps {
  content?: JSONContent;
  onChange?: (content: JSONContent) => void;
  placeholder?: string;
  error?: string;
}

export function TextAreaEditor({ content, onChange }: TextAreaEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CharacterCount.configure({
        wordCounter: (text) =>
          text.split(/\s+/).filter((word) => word !== "").length,
      }),
    ],
    content: content || "<p>Enter your project description here...</p>",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  return (
    <div>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)" >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
        <Divider my={3} />
        {editor && <WordsCounter editor={editor} />}
      </RichTextEditor>
    </div>
  );
}
