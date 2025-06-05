import { fetchProject } from "@/app/actions";
import { EnhancedImage } from "@/components/Image/Image";
import { isAppDevMode } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichDescriptionDisplay } from "./TextDisplay";
import ProjectDeleteHandler from "./ProjectDeleteHandler";
import {
  Container,
  Title,
  Text,
  Divider,
  Group,
  Badge,
  Button,
  Flex,
  SimpleGrid,
  Box,
  Stack,
  ActionIcon,
} from "@mantine/core";
import {
  CalendarOutlined,
  ToolOutlined,
  TeamOutlined,
  LinkOutlined,
  GithubOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  PictureOutlined,
} from "@ant-design/icons";

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  try {
    const project = await fetchProject(slug);

    if (!project) {
      notFound();
    }

    return (
      <Container size="md" py="md">
        {/* Compact header with back button and actions */}
        <Flex justify="space-between" align="center" mb="lg">
          <Link href="/portfolio" passHref>
            <ActionIcon variant="subtle" size="lg">
              <ArrowLeftOutlined />
            </ActionIcon>
          </Link>

          <Group gap="xs">
            {project.liveProjectUrl && (
              <Button
                component="a"
                href={project.liveProjectUrl}
                target="_blank"
                variant="filled"
                size="xs"
                leftSection={<LinkOutlined />}
              >
                Live
              </Button>
            )}

            {project.sourceCodeUrl && (
              <Button
                component="a"
                href={project.sourceCodeUrl}
                target="_blank"
                variant="outline"
                size="xs"
                leftSection={<GithubOutlined />}
              >
                Code
              </Button>
            )}
          </Group>
        </Flex>

        {/* Compact project title and meta */}
        <Box mb="md">
          <Group justify="space-between" align="flex-start" mb="xs">
            <Box style={{ flex: 1 }}>
              <Title order={1} size="h2" mb={4}>
                {project.title}
              </Title>
              {project.subtitle && (
                <Text size="sm" c="dimmed">
                  {project.subtitle}
                </Text>
              )}
            </Box>
            <Badge
              size="sm"
              variant="light"
              color={
                project.status === "Completed"
                  ? "green"
                  : project.status === "In Progress"
                  ? "blue"
                  : project.status === "Planned"
                  ? "yellow"
                  : "gray"
              }
            >
              {project.status}
            </Badge>
          </Group>

          <Group gap="md" mb="sm">
            <Group gap={4}>
              <CalendarOutlined
                style={{ fontSize: "12px", color: "#868e96" }}
              />
              <Text size="xs" c="dimmed">
                {project.date}
              </Text>
            </Group>
          </Group>

          <Text size="sm" fw={500}>
            {project.shortDescription}
          </Text>
        </Box>

        {/* Header image - compact */}
        <Box mb="md" style={{ border: "1px solid #e9ecef" }}>
          <EnhancedImage
            src={project.headerImageUrl}
            width={400}
            height={300}
            alt={project.title}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </Box>

        {/* Technologies and roles in compact grid */}
        <SimpleGrid cols={2} spacing="md" mb="md">
          <Box>
            <Group gap={4} mb={6}>
              <ToolOutlined style={{ fontSize: "14px" }} />
              <Text size="sm" fw={600}>
                Tech Stack
              </Text>
            </Group>
            <Flex gap={4} wrap="wrap">
              {project.technologies.map((tech) => (
                <Badge key={tech} size="xs" variant="outline" color="blue">
                  {tech}
                </Badge>
              ))}
            </Flex>
          </Box>

          <Box>
            <Group gap={4} mb={6}>
              <TeamOutlined style={{ fontSize: "14px" }} />
              <Text size="sm" fw={600}>
                Role
              </Text>
            </Group>
            <Flex gap={4} wrap="wrap">
              {project.roles.map((role) => (
                <Badge key={role} size="xs" variant="outline" color="gray">
                  {role}
                </Badge>
              ))}
            </Flex>
          </Box>
        </SimpleGrid>

        <Divider my="md" />

        {/* Description */}
        <Box mb="md">
          <Text size="sm" fw={600} mb="xs">
            Description
          </Text>
          <Box
            className="rich-text-content"
            style={{ fontSize: "14px", lineHeight: 1.5 }}
          >
            <RichDescriptionDisplay project={project} />
          </Box>
        </Box>

        {/* Key features - compact list */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <>
            <Divider my="md" />
            <Box mb="md">
              <Text size="sm" fw={600} mb="xs">
                Key Features
              </Text>
              <Stack gap={4}>
                {project.keyFeatures.map((feature, index) => (
                  <Group key={index} gap={6} align="flex-start">
                    <CheckCircleOutlined
                      style={{
                        fontSize: "12px",
                        color: "#228be6",
                        marginTop: "2px",
                      }}
                    />
                    <Text size="sm" style={{ flex: 1 }}>
                      {feature}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Box>
          </>
        )}

        {/* Gallery - compact grid */}
        {project.galleryImageUrls && project.galleryImageUrls.length > 0 && (
          <>
            <Divider my="md" />
            <Box mb="md">
              <Group gap={4} mb="xs">
                <PictureOutlined style={{ fontSize: "14px" }} />
                <Text size="sm" fw={600}>
                  Gallery
                </Text>
              </Group>
              <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xs">
                {project.galleryImageUrls.map((imageUrl, index) => (
                  <Box
                    key={index}
                    style={{
                      border: "1px solid #e9ecef",
                      aspectRatio: "4/3",
                      overflow: "hidden",
                    }}
                  >
                    <EnhancedImage
                      src={imageUrl}
                      alt={`${project.title} - Gallery ${index + 1}`}
                      width={400}
                      height={300}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </>
        )}

        {/* Admin controls */}
        {isAppDevMode() && (
          <>
            <Divider my="md" />
            <Text size="sm" fw={600} mb="xs">
              Project Settings
            </Text>
            <Group>
              <ProjectDeleteHandler project={project} />
              <Link href={`/portfolio/${project.slug}/edit`} passHref>
                <Button variant="outline" leftSection={<ToolOutlined />}>
                  Edit
                </Button>
              </Link>
            </Group>
          </>
        )}
      </Container>
    );
  } catch (error) {
    console.error("Error fetching project:", error);
    notFound();
  }
}
