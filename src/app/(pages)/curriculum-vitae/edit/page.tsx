import React from "react";
import { Container } from "@mantine/core";
import { fetchUserProfile, fetchCV } from "@/app/actions";
import { ProfileEditForm } from "./ProfileEditForm";
import { isAppDevMode } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function ProfileEditPage() {
  const [userProfile, cvData] = await Promise.all([
    fetchUserProfile(),
    fetchCV(),
  ]);

  // Legacy CV data migration
  // // Check if migration is needed
  // if (!cvData.sections || !Array.isArray(cvData.sections)) {
  //   try {
  //     await migrateCVToSections();
  //     // Fetch the updated CV data after migration
  //     // cvData = await fetchCV();
  //   } catch (error) {
  //     console.error("Migration failed:", error);
  //   }
  // }

  if (!isAppDevMode()) {
    return notFound();
  }

  return (
    <Container size="lg" py="xl">
      <ProfileEditForm initialProfile={userProfile} initialCV={cvData} />
    </Container>
  );
}
