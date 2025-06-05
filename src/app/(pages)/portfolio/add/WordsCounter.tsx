import { type Editor } from "@tiptap/react";
import React from "react";

export default function WordsCounter({ editor }: { editor: Editor }) {
  return (
    <>
      <div className="character-count">
        {editor.storage.characterCount.characters()} characters |{" "}
        {editor.storage?.characterCount.words()} words
      </div>
    </>
  );
}
