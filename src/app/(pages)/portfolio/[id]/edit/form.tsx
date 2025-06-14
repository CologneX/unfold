"use client";

import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextInput,
  Textarea,
  Select,
  Button,
  Stack,
  Group,
  Grid,
  Text,
  Divider,
  Box,
  Alert,
  TagsInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { updateProject, addTechnology, addRole } from "@/app/actions";
import { isValidImageUrl } from "@/lib/imageUtils";
import { ImageInput } from "@/components/ImageInput/ImageInput";
import { TextAreaEditor } from "@/app/(pages)/portfolio/add/RichTextEditor";
import { JSONContent } from "@tiptap/react";
import { Project } from "@/types/types";
import { notifications } from "@mantine/notifications";

const STATUS_OPTIONS = [
  { value: "Completed", label: "Completed" },
  { value: "In Progress", label: "In Progress" },
  { value: "Planned", label: "Planned" },
  { value: "On Hold", label: "On Hold" },
];


interface ProjectFormData {
  title: string;
  subtitle: string;
  date: string;
  status: string;
  thumbnailImageUrl: string;
  headerImageUrl: string;
  shortDescription: string;
  longDescription: JSONContent;
  technologies: string[];
  roles: string[];
  liveProjectUrl: string;
  sourceCodeUrl: string;
  keyFeatures: string[];
  galleryImageUrls: string[];
}

export default function PortfolioEditForm({
  projectSlug,
  project,
  technologies,
  roles,
}: {
  projectSlug: string;
  project: Project;
  technologies: string[];
  roles: string[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [availableTechnologies, setAvailableTechnologies] =
    useState<string[]>(technologies);
  const [availableRoles, setAvailableRoles] = useState<string[]>(roles);

  const form = useForm<ProjectFormData>({
    initialValues: {
      title: project.title,
      subtitle: project.subtitle || "",
      date: project.date,
      status: project.status,
      thumbnailImageUrl: project.thumbnailImageUrl,
      headerImageUrl: project.headerImageUrl,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription,
      technologies: project.technologies,
      roles: project.roles,
      liveProjectUrl: project.liveProjectUrl ?? "",
      sourceCodeUrl: project.sourceCodeUrl ?? "",
      keyFeatures: project.keyFeatures ?? [],
      galleryImageUrls: project.galleryImageUrls ?? [],
    },

    validate: {
      title: (value) => (!value.trim() ? "Title is required" : null),
      date: (value) => (!value ? "Date is required" : null),
      status: (value) => (!value ? "Status is required" : null),
      thumbnailImageUrl: (value) => {
        if (!value.trim()) return "Thumbnail image URL is required";
        if (!isValidImageUrl(value))
          return "Please enter a valid image URL or path";
        return null;
      },
      headerImageUrl: (value) => {
        if (!value.trim()) return "Header image URL is required";
        if (!isValidImageUrl(value))
          return "Please enter a valid image URL or path";
        return null;
      },
      shortDescription: (value) => {
        if (!value.trim()) return "Short description is required";
        if (value.length > 200)
          return "Short description should be 200 characters or less";
        return null;
      },
      longDescription: (value) => {
        if (!value) return "Long description is required";

        if (value.content && Array.isArray(value.content)) {
          const hasContent = value.content.some((node: JSONContent) => {
            if (node.type === "paragraph" && node.content) {
              return node.content.some(
                (textNode: JSONContent) =>
                  textNode.type === "text" &&
                  textNode.text &&
                  textNode.text.trim() !== ""
              );
            }
            return (
              node.type !== "paragraph" ||
              (node.content && node.content.length > 0)
            );
          });

          if (!hasContent) return "Long description is required";
        }

        return null;
      },
      technologies: (value) =>
        value.length === 0 ? "At least one technology is required" : null,
      roles: (value) =>
        value.length === 0 ? "At least one role is required" : null,
    },
  });

  const handleSubmit = async (values: ProjectFormData) => {
    setLoading(true);
    try {
      // Filter out empty strings from array fields
      const cleanedValues = {
        ...values,
        subtitle: values.subtitle || undefined,
        liveProjectUrl: values.liveProjectUrl || undefined,
        sourceCodeUrl: values.sourceCodeUrl || undefined,
        keyFeatures: values.keyFeatures.filter(
          (feature) => feature.trim() !== ""
        ),
        galleryImageUrls: values.galleryImageUrls.filter(
          (url) => url.trim() !== ""
        ),
      };

      await updateProject(projectSlug, cleanedValues);

      setTimeout(() => {
        router.push(`/portfolio/${projectSlug}`);
      }, 2000);
    } catch (err) {
      notifications.show({
        title: "Error",
        message:
          err instanceof Error ? err.message : "Failed to update project",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const addKeyFeature = () => {
    form.setFieldValue("keyFeatures", [...form.values.keyFeatures, ""]);
  };

  const updateKeyFeature = (index: number, value: string) => {
    const newFeatures = [...form.values.keyFeatures];
    newFeatures[index] = value;
    form.setFieldValue("keyFeatures", newFeatures);
  };

  const removeKeyFeature = (index: number) => {
    const newFeatures = form.values.keyFeatures.filter((_, i) => i !== index);
    form.setFieldValue("keyFeatures", newFeatures);
  };

  const addGalleryImage = () => {
    form.setFieldValue("galleryImageUrls", [
      ...form.values.galleryImageUrls,
      "",
    ]);
  };

  const updateGalleryImage = (index: number, value: string) => {
    const newUrls = [...form.values.galleryImageUrls];
    newUrls[index] = value;
    form.setFieldValue("galleryImageUrls", newUrls);
  };

  const removeGalleryImage = (index: number) => {
    const newUrls = form.values.galleryImageUrls.filter((_, i) => i !== index);
    form.setFieldValue("galleryImageUrls", newUrls);
  };

  if (!projectSlug) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Error">
          No project slug provided. Please access this page from a project page.
        </Alert>
      </Container>
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        {/* Basic Information */}
        <div>
          <Text fw={500} size="lg" mb="sm">
            Basic Information
          </Text>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Project Title"
                placeholder="Enter project title"
                required
                {...form.getInputProps("title")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Subtitle"
                placeholder="Brief subtitle (optional)"
                {...form.getInputProps("subtitle")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DatePickerInput
                label="Date"
                required
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps("date")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Status"
                placeholder="Select project status"
                required
                data={STATUS_OPTIONS}
                {...form.getInputProps("status")}
              />
            </Grid.Col>
          </Grid>
        </div>

        <Divider />

        {/* Images */}
        <div>
          <Text fw={500} size="lg" mb="sm">
            Images
          </Text>
          <Alert color="blue" variant="light" style={{ marginBottom: "1rem" }}>
            <Text size="xs">
              <strong>Upload Guidelines:</strong>
              <br />
              • Supported formats: JPG, PNG, WebP, SVG, GIF
              <br />• Maximum file size: 5MB
            </Text>
          </Alert>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <ImageInput
                label="Thumbnail Image"
                placeholder="https://example.com/thumbnail.jpg"
                required
                description="Square image recommended (e.g., 400x400px)"
                value={form.values.thumbnailImageUrl}
                onChange={(value) =>
                  form.setFieldValue("thumbnailImageUrl", value)
                }
                error={
                  typeof form.errors.thumbnailImageUrl === "string"
                    ? form.errors.thumbnailImageUrl
                    : undefined
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <ImageInput
                label="Header Image"
                placeholder="https://example.com/header.jpg"
                required
                description="Wide aspect ratio recommended (e.g., 1200x600px)"
                value={form.values.headerImageUrl}
                onChange={(value) =>
                  form.setFieldValue("headerImageUrl", value)
                }
                error={
                  typeof form.errors.headerImageUrl === "string"
                    ? form.errors.headerImageUrl
                    : undefined
                }
              />
            </Grid.Col>
          </Grid>
        </div>

        <Divider />

        {/* Description */}
        <div>
          <Text fw={500} size="lg" mb="sm">
            Description
          </Text>
          <Stack gap="sm">
            <div>
              <Text size="sm" fw={500} mb="xs">
                Long Description <span style={{ color: "red" }}>*</span>
              </Text>
              <TextAreaEditor
                content={form.values.longDescription}
                onChange={(content) =>
                  form.setFieldValue("longDescription", content)
                }
                error={
                  typeof form.errors.longDescription === "string"
                    ? form.errors.longDescription
                    : undefined
                }
              />
            </div>
            <Textarea
              label="Short Description"
              placeholder="Brief description for previews and listings"
              required
              minRows={3}
              maxRows={5}
              {...form.getInputProps("shortDescription")}
            />
          </Stack>
        </div>

        <Divider />

        {/* Technologies and Roles */}
        <div>
          <Text fw={500} size="lg" mb="sm">
            Technologies &amp; Roles
          </Text>
          <Text size="sm" c="dimmed" mb="md">
            Don&apos;t see a technology or role you need? You can add new ones
            by typing them and selecting them from the dropdown.
          </Text>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TagsInput
                label="Technologies"
                placeholder="Select or type to add new technologies"
                required
                data={availableTechnologies}
                value={form.values.technologies}
                onChange={async (values) => {
                  const newTechs = values.filter(
                    (tech) => !availableTechnologies.includes(tech)
                  );
                  form.setFieldValue("technologies", values);
                  for (const newTech of newTechs) {
                    try {
                      await addTechnology(newTech);
                      setAvailableTechnologies((prev) =>
                        [...prev, newTech].sort()
                      );
                    } catch (error) {
                      console.error("Failed to add technology:", error);
                    }
                  }
                }}
                error={form.errors.technologies}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TagsInput
                label="Roles"
                placeholder="Select or type to add new roles"
                required
                data={availableRoles}
                value={form.values.roles}
                onChange={async (values) => {
                  const newRoles = values.filter(
                    (role) => !availableRoles.includes(role)
                  );
                  form.setFieldValue("roles", values);
                  for (const newRole of newRoles) {
                    try {
                      await addRole(newRole);
                      setAvailableRoles((prev) => [...prev, newRole].sort());
                    } catch (error) {
                      console.error("Failed to add role:", error);
                    }
                  }
                }}
                error={form.errors.roles}
              />
            </Grid.Col>
          </Grid>
        </div>

        <Divider />

        {/* Project Links */}
        <div>
          <Text fw={500} size="lg" mb="sm">
            Project Links
          </Text>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Live Project URL"
                placeholder="https://myproject.com"
                {...form.getInputProps("liveProjectUrl")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Source Code URL"
                placeholder="https://github.com/username/repo"
                {...form.getInputProps("sourceCodeUrl")}
              />
            </Grid.Col>
          </Grid>
        </div>

        <Divider />

        {/* Key Features */}
        <div>
          <Text fw={500} size="lg" mb="sm">
            Key Features
          </Text>
          <Stack gap="xs">
            {form.values.keyFeatures.map((feature, index) => (
              <Group key={index}>
                <TextInput
                  placeholder={`Key feature ${index + 1}`}
                  value={feature}
                  onChange={(e) =>
                    updateKeyFeature(index, e.currentTarget.value)
                  }
                  style={{ flex: 1 }}
                  error={
                    form.errors.keyFeatures && index === 0
                      ? form.errors.keyFeatures
                      : undefined
                  }
                />
                <Button
                  variant="outline"
                  color="red"
                  size="sm"
                  onClick={() => removeKeyFeature(index)}
                >
                  Remove
                </Button>
              </Group>
            ))}
            <Button variant="outline" onClick={addKeyFeature} size="sm">
              Add Key Feature
            </Button>
          </Stack>
        </div>

        <Divider />

        {/* Gallery Images */}
        <div>
          <Text fw={500} size="lg" mb="sm">
            Gallery Images (Optional)
          </Text>
          <Text size="sm" c="dimmed" mb="md">
            Add additional images to showcase your project. You can use either
            external URLs or upload files locally.
          </Text>
          <Stack gap="xs">
            {form.values.galleryImageUrls.map((url, index) => (
              <Group key={index} align="flex-start">
                <Box style={{ flex: 1 }}>
                  <ImageInput
                    label={`Gallery Image ${index + 1}`}
                    placeholder={`https://example.com/gallery${index + 1}.jpg`}
                    value={url}
                    onChange={(value) => updateGalleryImage(index, value)}
                  />
                </Box>
                <Button
                  variant="outline"
                  color="red"
                  size="sm"
                  onClick={() => removeGalleryImage(index)}
                  mt="xl"
                >
                  Remove
                </Button>
              </Group>
            ))}
            <Button variant="outline" onClick={addGalleryImage} size="sm">
              Add Gallery Image
            </Button>
          </Stack>
        </div>

        {/* Submit Button */}
        <Group justify="center" mt="xl">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => router.push(`/portfolio/${projectSlug}`)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} size="md">
            Update Project
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
