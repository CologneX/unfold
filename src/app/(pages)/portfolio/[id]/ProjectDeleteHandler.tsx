"use client";

import { deleteProject } from "@/app/actions";
import DeleteButton from "@/components/DeleteButton";
import { Project } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProjectDeleteHandler({
  project,
}: {
  project: Project;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (projectToDelete: Project) => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteProject(projectToDelete.slug);

      // Redirect to portfolio page
      router.push("/portfolio");
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
      // In a real app, you might want to show an error message here
      alert("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DeleteButton
      project={project}
      onDelete={handleDelete}
      loading={isDeleting}
    />
  );
}
