"use client";

import React, { useState, useEffect } from "react";
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Grid,
  GridCol,
  TextInput,
  Button,
  Avatar,
  Card,
  ActionIcon,
  Divider,
  Box,
  ThemeIcon,
  Textarea,
  TagsInput,
  Badge,
} from "@mantine/core";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  LinkedinOutlined,
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined,
  BookOutlined,
  CarryOutOutlined,
  BulbOutlined,
  FileTextOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useForm } from "@mantine/form";
import {
  UserProfile,
  SocialLink,
  CV,
  Education,
  WorkExperience,
  SkillCategory,
  Publication,
  Award,
  Project,
  UUID,
} from "@/types/types";
import {
  updateUserProfile,
  updateCV,
  deleteEducation,
  deleteWorkExperience,
  deletePublication,
  deleteAward,
  fetchPortfolio,
} from "@/app/actions";
import { ImageInput } from "@/components/ImageInput/ImageInput";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

const SOCIAL_PLATFORMS = [
  {
    name: "LinkedIn",
    icon: LinkedinOutlined,
    slug: "linkedin",
    color: "#0077B5",
  },
  { name: "GitHub", icon: GithubOutlined, slug: "github", color: "#333" },
  { name: "Twitter", icon: TwitterOutlined, slug: "twitter", color: "#1DA1F2" },
  {
    name: "Instagram",
    icon: InstagramOutlined,
    slug: "instagram",
    color: "#E4405F",
  },
  {
    name: "Other",
    icon: GlobalOutlined,
    slug: "other",
    color: "#888",
  },
];

interface ProfileEditorForm {
  name: string;
  tagline: string;
  email: string;
  phone?: string;
  location?: string;
  websiteUrl: string;
  profilePictureUrl: string;
  socialLinks: SocialLink[];
  // CV fields
  cvTitle: string;
  cvSummary: string;
  cvContactEmail: string;
  cvPhone: string;
  cvLinkedinUrl: string;
  cvPortfolioUrl: string;
  // CV arrays in form
  education: Education[];
  workExperience: WorkExperience[];
  skills: SkillCategory[];
  projects: UUID[]; // Project slugs to include in CV
  publications: Publication[];
  awards: Award[];
}

interface ProfileEditFormProps {
  initialProfile: UserProfile;
  initialCV: CV;
}

export function ProfileEditForm({
  initialProfile,
  initialCV,
}: ProfileEditFormProps) {
  const [saving, setSaving] = useState(false);
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>([]);
  const router = useRouter();

  const form = useForm<ProfileEditorForm>({
    initialValues: {
      name: initialProfile.name || "",
      tagline: initialProfile.tagline || "",
      email: initialProfile.email || "",
      phone: initialProfile.phone || undefined,
      location: initialProfile.location || undefined,
      websiteUrl: initialProfile.websiteUrl || "",
      profilePictureUrl: initialProfile.profilePictureUrl || "",
      socialLinks: initialProfile.socialLinks || [],
      // CV fields
      cvTitle: initialCV.title || "Curriculum Vitae",
      cvSummary: initialCV.summary || "",
      cvContactEmail: initialCV.contactInformation?.email || "",
      cvPhone: initialCV.contactInformation?.phone || "",
      cvLinkedinUrl: initialCV.contactInformation?.linkedinUrl || "",
      cvPortfolioUrl: initialCV.contactInformation?.portfolioUrl || "",
      // CV arrays
      education: initialCV.education || [],
      workExperience: initialCV.workExperience || [],
      skills: initialCV.skills || [],
      projects: initialCV.projects || [],
      publications: initialCV.publications || [],
      awards: initialCV.awardsAndHonors || [],
    },
    validate: {
      name: (value) => (value.trim() ? null : "Name is required"),
      tagline: (value) => (value.trim() ? null : "Tagline is required"),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      websiteUrl: (value) =>
        !value || /^https?:\/\/.+/.test(value) ? null : "Invalid URL format",
      cvContactEmail: (value) =>
        !value || /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format",
      cvLinkedinUrl: (value) =>
        !value || /^https?:\/\/.+/.test(value) ? null : "Invalid URL format",
      cvPortfolioUrl: (value) =>
        !value || /^https?:\/\/.+/.test(value) ? null : "Invalid URL format",
      socialLinks: {
        url: (value) => (/^https?:\/\/.+/.test(value) ? null : "Invalid URL"),
      },
      education: {
        institution: (value) =>
          value.trim() ? null : "Institution is required",
        degree: (value) => (value.trim() ? null : "Degree is required"),
      },
      workExperience: {
        company: (value) => (value.trim() ? null : "Company is required"),
        jobTitle: (value) => (value.trim() ? null : "Job title is required"),
      },
      publications: {
        title: (value) => (value.trim() ? null : "Title is required"),
        url: (value) =>
          !value || /^https?:\/\/.+/.test(value) ? null : "Invalid URL format",
      },
      awards: {
        name: (value) => (value.trim() ? null : "Award name is required"),
      },
    },
  });

  // Fetch portfolio projects for selection
  useEffect(() => {
    const loadPortfolioProjects = async () => {
      try {
        const projects = await fetchPortfolio();
        setPortfolioProjects(projects || []);
      } catch (error) {
        console.error("Failed to fetch portfolio projects:", error);
      }
    };

    loadPortfolioProjects();
  }, []);

  const handleSave = async (values: ProfileEditorForm) => {
    try {
      setSaving(true);

      // Update profile
      await updateUserProfile(values);

      // Update CV with basic info and arrays
      const updatedCV: CV = {
        ...initialCV,
        title: values.cvTitle,
        summary: values.cvSummary,
        contactInformation: {
          email: values.cvContactEmail,
          phone: values.cvPhone,
          linkedinUrl: values.cvLinkedinUrl,
          portfolioUrl: values.cvPortfolioUrl,
        },
        education: values.education,
        workExperience: values.workExperience,
        skills: values.skills,
        publications: values.publications,
        awardsAndHonors: values.awards,
      };

      await updateCV(updatedCV);

      notifications.show({
        title: "Success",
        message: "Profile and CV updated successfully!",
        color: "green",
      });

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error",
        message: "Failed to save profile and CV. Please try again.",
        color: "red",
      });
    } finally {
      setSaving(false);
      form.resetDirty();
    }
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: `social_${Date.now()}`,
      platformName: "",
      url: "",
      iconSlug: "",
    };
    form.setFieldValue("socialLinks", [...form.values.socialLinks, newLink]);
  };

  const removeSocialLink = (index: number) => {
    form.setFieldValue(
      "socialLinks",
      form.values.socialLinks.filter((_, i) => i !== index)
    );
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const updatedLinks = [...form.values.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    form.setFieldValue("socialLinks", updatedLinks);
  };

  const selectPlatform = (
    index: number,
    platform: (typeof SOCIAL_PLATFORMS)[0]
  ) => {
    updateSocialLink(index, "platformName", platform.name);
    updateSocialLink(index, "iconSlug", platform.slug);
  };

  const getSocialPlatform = (iconSlug: string) =>
    SOCIAL_PLATFORMS.find((p) => p.slug === iconSlug);

  // CV Management Functions
  const addEducation = () => {
    const newEducation: Education = {
      id: `edu_${Date.now()}`,
      institution: "",
      degree: "",
      location: "",
      graduationDate: "",
      details: [],
    };
    form.setFieldValue("education", [...form.values.education, newEducation]);
  };

  const updateEducationField = (
    index: number,
    field: keyof Education,
    value: string | string[]
  ) => {
    const updated = [...form.values.education];
    updated[index] = { ...updated[index], [field]: value };
    form.setFieldValue("education", updated);
  };

  const removeEducation = async (index: number) => {
    const eduToRemove = form.values.education[index];
    if (eduToRemove.id && !eduToRemove.id.startsWith("edu_")) {
      await deleteEducation(eduToRemove.id);
    }
    form.setFieldValue(
      "education",
      form.values.education.filter((_, i) => i !== index)
    );
  };

  const addWorkExperience = () => {
    const newWork: WorkExperience = {
      id: `work_${Date.now()}`,
      company: "",
      jobTitle: "",
      location: "",
      startDate: "",
      endDate: "",
      responsibilities: [],
      technologiesUsed: [],
    };
    form.setFieldValue("workExperience", [
      ...form.values.workExperience,
      newWork,
    ]);
  };

  const updateWorkField = (
    index: number,
    field: keyof WorkExperience,
    value: string | string[]
  ) => {
    const updated = [...form.values.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    form.setFieldValue("workExperience", updated);
  };

  const removeWorkExperience = async (index: number) => {
    const workToRemove = form.values.workExperience[index];
    if (workToRemove.id && !workToRemove.id.startsWith("work_")) {
      await deleteWorkExperience(workToRemove.id);
    }
    form.setFieldValue(
      "workExperience",
      form.values.workExperience.filter((_, i) => i !== index)
    );
  };

  const addSkillCategory = () => {
    const newSkill: SkillCategory = {
      category: "",
      items: [],
    };
    form.setFieldValue("skills", [...form.values.skills, newSkill]);
  };

  const updateSkillCategory = (
    index: number,
    field: keyof SkillCategory,
    value: string | string[]
  ) => {
    const updated = [...form.values.skills];
    updated[index] = { ...updated[index], [field]: value };
    form.setFieldValue("skills", updated);
  };

  const removeSkillCategory = (index: number) => {
    form.setFieldValue(
      "skills",
      form.values.skills.filter((_, i) => i !== index)
    );
  };

  const addPublication = () => {
    const newPub: Publication = {
      id: `pub_${Date.now()}`,
      title: "",
      authors: "",
      conferenceOrJournal: "",
      date: "",
      url: "",
    };
    form.setFieldValue("publications", [...form.values.publications, newPub]);
  };

  const updatePublicationField = (
    index: number,
    field: keyof Publication,
    value: string
  ) => {
    const updated = [...form.values.publications];
    updated[index] = { ...updated[index], [field]: value };
    form.setFieldValue("publications", updated);
  };

  const removePublication = async (index: number) => {
    const pubToRemove = form.values.publications[index];
    if (pubToRemove.id && !pubToRemove.id.startsWith("pub_")) {
      await deletePublication(pubToRemove.id);
    }
    form.setFieldValue(
      "publications",
      form.values.publications.filter((_, i) => i !== index)
    );
  };

  // Project management functions
  const toggleProjectSelection = (projectSlug: UUID) => {
    const currentProjects = form.values.projects;
    const isSelected = currentProjects.includes(projectSlug);

    if (isSelected) {
      form.setFieldValue(
        "projects",
        currentProjects.filter((slug) => slug !== projectSlug)
      );
    } else {
      form.setFieldValue("projects", [...currentProjects, projectSlug]);
    }
  };

  const addAward = () => {
    const newAward: Award = {
      id: `award_${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      description: "",
    };
    form.setFieldValue("awards", [...form.values.awards, newAward]);
  };

  const updateAwardField = (
    index: number,
    field: keyof Award,
    value: string
  ) => {
    const updated = [...form.values.awards];
    updated[index] = { ...updated[index], [field]: value };
    form.setFieldValue("awards", updated);
  };

  const removeAward = async (index: number) => {
    const awardToRemove = form.values.awards[index];
    if (awardToRemove.id && !awardToRemove.id.startsWith("award_")) {
      await deleteAward(awardToRemove.id);
    }
    form.setFieldValue(
      "awards",
      form.values.awards.filter((_, i) => i !== index)
    );
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSave)}>
        <Grid>
          {/* Left Column - Basic Info */}
          <GridCol span={{ base: 12, md: 8 }}>
            <Stack gap="xl">
              {/* Basic Information */}
              <Stack gap="lg">
                <Group>
                  <ThemeIcon variant="light" size="lg">
                    <UserOutlined />
                  </ThemeIcon>
                  <Title order={2} size="h3">
                    Basic Information
                  </Title>
                </Group>

                <Stack gap="md">
                  <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    leftSection={<UserOutlined style={{ fontSize: 16 }} />}
                    {...form.getInputProps("name")}
                    required
                  />

                  <TextInput
                    label="Professional Tagline"
                    placeholder="e.g., Full Stack Developer passionate about AI"
                    description="A brief description of your professional identity"
                    {...form.getInputProps("tagline")}
                    required
                  />

                  <Group grow>
                    <TextInput
                      label="Email"
                      placeholder="your.email@example.com"
                      leftSection={<MailOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("email")}
                      required
                    />

                    <TextInput
                      label="Phone"
                      placeholder="+1 (555) 123-4567"
                      leftSection={<PhoneOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("phone")}
                    />
                  </Group>

                  <Group grow>
                    <TextInput
                      label="Location"
                      placeholder="City, Country"
                      leftSection={
                        <EnvironmentOutlined style={{ fontSize: 16 }} />
                      }
                      {...form.getInputProps("location")}
                    />

                    <TextInput
                      label="Website URL"
                      placeholder="https://yourdomain.com"
                      leftSection={<GlobalOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("websiteUrl")}
                    />
                  </Group>
                </Stack>
              </Stack>
              <Divider />
              {/* Social Links */}
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg">
                      <LinkedinOutlined />
                    </ThemeIcon>
                    <Title order={2} size="h3">
                      Social Links
                    </Title>
                  </Group>

                  <Button
                    leftSection={<PlusOutlined />}
                    variant="light"
                    onClick={addSocialLink}
                    size="sm"
                  >
                    Add Link
                  </Button>
                </Group>

                <Stack gap="md">
                  {form.values.socialLinks.map((link, index) => {
                    const platform = getSocialPlatform(link.iconSlug);
                    const PlatformIcon = platform?.icon || GlobalOutlined;

                    return (
                      <Card
                        key={link.id || index}
                        padding="md"
                        radius="md"
                        withBorder
                      >
                        <Group justify="space-between" align="flex-start">
                          <Stack gap="xs" style={{ flex: 1 }}>
                            <Group gap="xs">
                              <Text size="sm" fw={500} c="dimmed">
                                Platform
                              </Text>
                              <Group gap="xs">
                                {SOCIAL_PLATFORMS.map((platform) => (
                                  <ActionIcon
                                    key={platform.slug}
                                    variant={
                                      link.iconSlug === platform.slug
                                        ? "filled"
                                        : "light"
                                    }
                                    color={
                                      link.iconSlug === platform.slug
                                        ? platform.color
                                        : "gray"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      selectPlatform(index, platform)
                                    }
                                  >
                                    <platform.icon style={{ fontSize: 12 }} />
                                  </ActionIcon>
                                ))}
                              </Group>
                            </Group>

                            <TextInput
                              placeholder="https://..."
                              value={link.url}
                              onChange={(e) =>
                                updateSocialLink(index, "url", e.target.value)
                              }
                              leftSection={
                                <PlatformIcon style={{ fontSize: 16 }} />
                              }
                              error={
                                link.url && !/^https?:\/\/.+/.test(link.url)
                                  ? "Invalid URL format"
                                  : null
                              }
                            />
                          </Stack>

                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => removeSocialLink(index)}
                          >
                            <DeleteOutlined />
                          </ActionIcon>
                        </Group>
                      </Card>
                    );
                  })}

                  {form.values.socialLinks.length === 0 && (
                    <Text c="dimmed" ta="center" py="xl">
                      No social links added yet. Click &quot;Add Link&quot; to
                      get started.
                    </Text>
                  )}
                </Stack>
              </Stack>

              <Divider />

              {/* CV Basic Information */}
              <Stack gap="lg">
                <Group>
                  <ThemeIcon variant="light" size="lg">
                    <FileTextOutlined />
                  </ThemeIcon>
                  <Title order={2} size="h3">
                    CV Information
                  </Title>
                </Group>

                <Stack gap="md">
                  <TextInput
                    label="CV Title"
                    placeholder="e.g., Curriculum Vitae"
                    {...form.getInputProps("cvTitle")}
                  />

                  <Textarea
                    label="Professional Summary"
                    placeholder="Write a brief summary of your professional background and career objectives..."
                    rows={4}
                    {...form.getInputProps("cvSummary")}
                  />

                  <Group grow>
                    <TextInput
                      label="CV Contact Email"
                      placeholder="cv.email@example.com"
                      leftSection={<MailOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("cvContactEmail")}
                    />

                    <TextInput
                      label="CV Phone"
                      placeholder="+1 (555) 123-4567"
                      leftSection={<PhoneOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("cvPhone")}
                    />
                  </Group>

                  <Group grow>
                    <TextInput
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/yourprofile"
                      leftSection={
                        <LinkedinOutlined style={{ fontSize: 16 }} />
                      }
                      {...form.getInputProps("cvLinkedinUrl")}
                    />

                    <TextInput
                      label="Portfolio URL"
                      placeholder="https://yourportfolio.com"
                      leftSection={<GlobalOutlined style={{ fontSize: 16 }} />}
                      {...form.getInputProps("cvPortfolioUrl")}
                    />
                  </Group>
                </Stack>
              </Stack>

              <Divider />

              {/* Education */}
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg">
                      <BookOutlined />
                    </ThemeIcon>
                    <Title order={2} size="h3">
                      Education
                    </Title>
                  </Group>

                  <Button
                    leftSection={<PlusOutlined />}
                    variant="light"
                    onClick={addEducation}
                    size="sm"
                  >
                    Add Education
                  </Button>
                </Group>

                <Stack gap="md">
                  {form.values.education.map((edu, index) => (
                    <Card
                      key={edu.id || index}
                      padding="md"
                      radius="md"
                      withBorder
                    >
                      <Group justify="space-between" align="flex-start" mb="md">
                        <Text fw={500} size="sm" c="dimmed">
                          Education Entry #{index + 1}
                        </Text>
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => removeEducation(index)}
                        >
                          <DeleteOutlined />
                        </ActionIcon>
                      </Group>

                      <Stack gap="xs">
                        <Group grow>
                          <TextInput
                            label="Institution"
                            placeholder="University Name"
                            value={edu.institution}
                            onChange={(e) =>
                              updateEducationField(
                                index,
                                "institution",
                                e.target.value
                              )
                            }
                          />
                          <TextInput
                            label="Degree"
                            placeholder="Bachelor of Science"
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducationField(
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                          />
                        </Group>

                        <Group grow>
                          <TextInput
                            label="Location"
                            placeholder="City, Country"
                            value={edu.location}
                            onChange={(e) =>
                              updateEducationField(
                                index,
                                "location",
                                e.target.value
                              )
                            }
                          />
                          <TextInput
                            label="Graduation Date"
                            placeholder="May 2024"
                            value={edu.graduationDate}
                            onChange={(e) =>
                              updateEducationField(
                                index,
                                "graduationDate",
                                e.target.value
                              )
                            }
                          />
                        </Group>

                        <TagsInput
                          label="Details"
                          placeholder="Type achievement and press Enter"
                          value={edu.details || []}
                          onChange={(value) =>
                            updateEducationField(index, "details", value)
                          }
                          data={[]}
                        />
                      </Stack>
                    </Card>
                  ))}

                  {form.values.education.length === 0 && (
                    <Text c="dimmed" ta="center" py="xl">
                      No education entries added yet. Click &quot;Add
                      Education&quot; to get started.
                    </Text>
                  )}
                </Stack>
              </Stack>

              <Divider />

              {/* Work Experience */}
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg">
                      <CarryOutOutlined />
                    </ThemeIcon>
                    <Title order={2} size="h3">
                      Work Experience
                    </Title>
                  </Group>

                  <Button
                    leftSection={<PlusOutlined />}
                    variant="light"
                    onClick={addWorkExperience}
                    size="sm"
                  >
                    Add Experience
                  </Button>
                </Group>

                <Stack gap="md">
                  {form.values.workExperience.map((work, index) => (
                    <Card
                      key={work.id || index}
                      padding="md"
                      radius="md"
                      withBorder
                    >
                      <Group justify="space-between" align="flex-start" mb="md">
                        <Text fw={500} size="sm" c="dimmed">
                          Experience #{index + 1}
                        </Text>
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => removeWorkExperience(index)}
                        >
                          <DeleteOutlined />
                        </ActionIcon>
                      </Group>

                      <Stack gap="xs">
                        <Group grow>
                          <TextInput
                            label="Company"
                            placeholder="Company Name"
                            value={work.company}
                            onChange={(e) =>
                              updateWorkField(index, "company", e.target.value)
                            }
                          />
                          <TextInput
                            label="Job Title"
                            placeholder="Software Developer"
                            value={work.jobTitle}
                            onChange={(e) =>
                              updateWorkField(index, "jobTitle", e.target.value)
                            }
                          />
                        </Group>

                        <Group grow>
                          <TextInput
                            label="Location"
                            placeholder="City, Country"
                            value={work.location}
                            onChange={(e) =>
                              updateWorkField(index, "location", e.target.value)
                            }
                          />
                          <TextInput
                            label="Company URL"
                            placeholder="https://company.com"
                            value={work.companyUrl || ""}
                            onChange={(e) =>
                              updateWorkField(
                                index,
                                "companyUrl",
                                e.target.value
                              )
                            }
                          />
                        </Group>

                        <Group grow>
                          <TextInput
                            label="Start Date"
                            placeholder="Jan 2023"
                            value={work.startDate}
                            onChange={(e) =>
                              updateWorkField(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                          <TextInput
                            label="End Date"
                            placeholder="Present"
                            value={work.endDate}
                            onChange={(e) =>
                              updateWorkField(index, "endDate", e.target.value)
                            }
                          />
                        </Group>

                        <TagsInput
                          label="Responsibilities"
                          placeholder="Type responsibility and press Enter"
                          value={work.responsibilities}
                          onChange={(value) =>
                            updateWorkField(index, "responsibilities", value)
                          }
                          data={[]}
                        />

                        <TagsInput
                          label="Technologies Used"
                          placeholder="Type technology and press Enter"
                          value={work.technologiesUsed || []}
                          onChange={(value) =>
                            updateWorkField(index, "technologiesUsed", value)
                          }
                          data={[]}
                        />
                      </Stack>
                    </Card>
                  ))}

                  {form.values.workExperience.length === 0 && (
                    <Text c="dimmed" ta="center" py="xl">
                      No work experience added yet. Click &quot;Add
                      Experience&quot; to get started.
                    </Text>
                  )}
                </Stack>
              </Stack>

              <Divider />

              {/* Skills */}
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg">
                      <BulbOutlined />
                    </ThemeIcon>
                    <Title order={2} size="h3">
                      Skills
                    </Title>
                  </Group>

                  <Button
                    leftSection={<PlusOutlined />}
                    variant="light"
                    onClick={addSkillCategory}
                    size="sm"
                  >
                    Add Category
                  </Button>
                </Group>

                <Stack gap="md">
                  {form.values.skills.map((skillCat, index) => (
                    <Card key={index} padding="md" radius="md" withBorder>
                      <Group justify="space-between" align="flex-start" mb="md">
                        <Text fw={500} size="sm" c="dimmed">
                          Skill Category #{index + 1}
                        </Text>
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => removeSkillCategory(index)}
                        >
                          <DeleteOutlined />
                        </ActionIcon>
                      </Group>

                      <Stack gap="xs">
                        <TextInput
                          label="Category"
                          placeholder="Programming Languages"
                          value={skillCat.category}
                          onChange={(e) =>
                            updateSkillCategory(
                              index,
                              "category",
                              e.target.value
                            )
                          }
                        />

                        <TagsInput
                          label="Skills"
                          placeholder="Type a skill and press Enter"
                          value={skillCat.items}
                          onChange={(value) =>
                            updateSkillCategory(index, "items", value)
                          }
                          data={[]}
                        />
                      </Stack>
                    </Card>
                  ))}

                  {form.values.skills.length === 0 && (
                    <Text c="dimmed" ta="center" py="xl">
                      No skill categories added yet. Click &quot;Add
                      Category&quot; to get started.
                    </Text>
                  )}
                </Stack>
              </Stack>

              <Divider />

              {/* Selected Projects */}
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg">
                      <CarryOutOutlined />
                    </ThemeIcon>
                    <Title order={2} size="h3">
                      Selected Projects
                    </Title>
                  </Group>
                </Group>

                <Text size="sm" c="dimmed" mb="md">
                  Choose portfolio projects to include in your CV. Click on
                  projects to toggle selection.
                </Text>

                <Stack gap="md">
                  {portfolioProjects.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      {portfolioProjects.map((project) => {
                        const isSelected = form.values.projects.includes(
                          project.slug
                        );
                        return (
                          <Card
                            key={project.slug}
                            padding="md"
                            radius="md"
                            withBorder
                            style={{
                              cursor: "pointer",
                              backgroundColor: isSelected
                                ? "var(--mantine-color-blue-0)"
                                : undefined,
                              borderColor: isSelected
                                ? "var(--mantine-color-blue-4)"
                                : undefined,
                              borderWidth: isSelected ? "2px" : "1px",
                            }}
                            onClick={() => toggleProjectSelection(project.slug)}
                          >
                            <Group
                              justify="space-between"
                              align="flex-start"
                              mb="xs"
                            >
                              <Text fw={500} size="sm" style={{ flex: 1 }}>
                                {project.title}
                              </Text>
                              <Badge
                                color={isSelected ? "blue" : "gray"}
                                variant={isSelected ? "filled" : "light"}
                                size="sm"
                              >
                                {isSelected ? "Selected" : "Not Selected"}
                              </Badge>
                            </Group>

                            {project.subtitle && (
                              <Text size="xs" c="dimmed" mb="xs">
                                {project.subtitle}
                              </Text>
                            )}

                            <Text size="xs" c="dimmed" mb="sm">
                              {project.shortDescription}
                            </Text>

                            <Group gap="xs" mb="xs">
                              <Text size="xs" c="dimmed">
                                Date:
                              </Text>
                              <Text size="xs">{project.date}</Text>
                            </Group>

                            <Group gap="xs">
                              <Text size="xs" c="dimmed">
                                Status:
                              </Text>
                              <Badge size="xs" variant="outline">
                                {project.status}
                              </Badge>
                            </Group>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <Text c="dimmed" ta="center" py="xl">
                      No portfolio projects found. Add some projects to your
                      portfolio first.
                    </Text>
                  )}

                  {form.values.projects.length > 0 && (
                    <Text size="sm" c="blue">
                      {form.values.projects.length} project
                      {form.values.projects.length === 1 ? "" : "s"} selected
                      for CV
                    </Text>
                  )}
                </Stack>
              </Stack>

              <Divider />

              {/* Publications */}
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg">
                      <FileTextOutlined />
                    </ThemeIcon>
                    <Title order={2} size="h3">
                      Publications
                    </Title>
                  </Group>

                  <Button
                    leftSection={<PlusOutlined />}
                    variant="light"
                    onClick={addPublication}
                    size="sm"
                  >
                    Add Publication
                  </Button>
                </Group>

                <Stack gap="md">
                  {form.values.publications.map((pub, index) => (
                    <Card
                      key={pub.id || index}
                      padding="md"
                      radius="md"
                      withBorder
                    >
                      <Group justify="space-between" align="flex-start" mb="md">
                        <Text fw={500} size="sm" c="dimmed">
                          Publication #{index + 1}
                        </Text>
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => removePublication(index)}
                        >
                          <DeleteOutlined />
                        </ActionIcon>
                      </Group>

                      <Stack gap="xs">
                        <TextInput
                          label="Title"
                          placeholder="Publication Title"
                          value={pub.title}
                          onChange={(e) =>
                            updatePublicationField(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                        />

                        <Group grow>
                          <TextInput
                            label="Authors"
                            placeholder="Author 1, Author 2, et al."
                            value={pub.authors || ""}
                            onChange={(e) =>
                              updatePublicationField(
                                index,
                                "authors",
                                e.target.value
                              )
                            }
                          />
                          <TextInput
                            label="Date"
                            placeholder="2024"
                            value={pub.date}
                            onChange={(e) =>
                              updatePublicationField(
                                index,
                                "date",
                                e.target.value
                              )
                            }
                          />
                        </Group>

                        <Group grow>
                          <TextInput
                            label="Conference/Journal"
                            placeholder="Journal Name"
                            value={pub.conferenceOrJournal || ""}
                            onChange={(e) =>
                              updatePublicationField(
                                index,
                                "conferenceOrJournal",
                                e.target.value
                              )
                            }
                          />
                          <TextInput
                            label="URL"
                            placeholder="https://doi.org/..."
                            value={pub.url || ""}
                            onChange={(e) =>
                              updatePublicationField(
                                index,
                                "url",
                                e.target.value
                              )
                            }
                          />
                        </Group>
                      </Stack>
                    </Card>
                  ))}

                  {form.values.publications.length === 0 && (
                    <Text c="dimmed" ta="center" py="xl">
                      No publications added yet. Click &quot;Add
                      Publication&quot; to get started.
                    </Text>
                  )}
                </Stack>
              </Stack>

              <Divider />

              {/* Awards & Honors */}
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon variant="light" size="lg">
                      <TrophyOutlined />
                    </ThemeIcon>
                    <Title order={2} size="h3">
                      Awards &amp; Honors
                    </Title>
                  </Group>

                  <Button
                    leftSection={<PlusOutlined />}
                    variant="light"
                    onClick={addAward}
                    size="sm"
                  >
                    Add Award
                  </Button>
                </Group>

                <Stack gap="md">
                  {form.values.awards.map((award, index) => (
                    <Card
                      key={award.id || index}
                      padding="md"
                      radius="md"
                      withBorder
                    >
                      <Group justify="space-between" align="flex-start" mb="md">
                        <Text fw={500} size="sm" c="dimmed">
                          Award #{index + 1}
                        </Text>
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => removeAward(index)}
                        >
                          <DeleteOutlined />
                        </ActionIcon>
                      </Group>

                      <Stack gap="xs">
                        <Group grow>
                          <TextInput
                            label="Name"
                            placeholder="Award Title"
                            value={award.name}
                            onChange={(e) =>
                              updateAwardField(index, "name", e.target.value)
                            }
                          />
                          <TextInput
                            label="Issuer"
                            placeholder="Organization/Institution"
                            value={award.issuer || ""}
                            onChange={(e) =>
                              updateAwardField(index, "issuer", e.target.value)
                            }
                          />
                        </Group>

                        <TextInput
                          label="Date"
                          placeholder="2024"
                          value={award.date}
                          onChange={(e) =>
                            updateAwardField(index, "date", e.target.value)
                          }
                        />

                        <Textarea
                          label="Description"
                          placeholder="Description of the award or achievement..."
                          rows={3}
                          value={award.description || ""}
                          onChange={(e) =>
                            updateAwardField(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </Stack>
                    </Card>
                  ))}

                  {form.values.awards.length === 0 && (
                    <Text c="dimmed" ta="center" py="xl">
                      No awards added yet. Click &quot;Add Award&quot; to get
                      started.
                    </Text>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </GridCol>

          {/* Right Column - Profile Picture */}
          <GridCol
            span={{ base: 12, md: 4 }}
            style={{ position: "sticky", top: 65, height: "100%" }}
          >
            <Box>
              <Paper shadow="xs" p="xl" radius="lg" withBorder>
                <Stack align="center" gap="lg">
                  <Title order={3} ta="center">
                    Profile Picture
                  </Title>

                  <Avatar
                    src={form.values.profilePictureUrl}
                    size={120}
                    radius="md"
                    style={{
                      border: "3px solid var(--mantine-color-blue-1)",
                    }}
                  />

                  <ImageInput
                    value={form.values.profilePictureUrl}
                    onChange={(url) =>
                      form.setFieldValue("profilePictureUrl", url)
                    }
                    label="Upload Photo"
                  />
                </Stack>
              </Paper>
            </Box>
            {/* Save Button */}
            <Button
              type="submit"
              leftSection={<SaveOutlined />}
              loading={saving}
              fullWidth
              size="md"
              disabled={!form.isValid() || !form.isDirty()}
              mt="md"
            >
              Save Changes
            </Button>
          </GridCol>
        </Grid>
      </form>
    </>
  );
}
