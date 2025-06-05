import React from "react";
import { Container } from "@mantine/core";
import { fetchUserProfile, fetchCV } from "@/app/actions";
import { ProfileEditForm } from "./ProfileEditForm";
import { isAppDevMode } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function ProfileEditPage() {
  const [userProfile, cvData] = await Promise.all([
    fetchUserProfile(),
    fetchCV()
  ]);

  if (!isAppDevMode()) {
    return notFound();
  }

  return (
    <Container size="lg" py="xl">
      <ProfileEditForm initialProfile={userProfile} initialCV={cvData} />
    </Container>
  );
}
