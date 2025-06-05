import { JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";

export function RichDescriptionDisplay({
  project,
}: {
  project: { longDescription: JSONContent };
}) {
  const output = useMemo(() => {
    return generateHTML(project.longDescription, [StarterKit]);
  }, [project.longDescription]);

  return <output dangerouslySetInnerHTML={{ __html: output }} />;
}
