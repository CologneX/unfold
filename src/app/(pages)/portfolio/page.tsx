import { fetchPortfolio } from "@/app/actions";
import {
  Card,
  Text,
  Badge,
  Group,
  SimpleGrid,
  CardSection,
  Title,
  Flex,
  Center,
  Stack,
  Box,
} from "@mantine/core";
import Link from "next/link";
import { CloseSquareFilled, PlusOutlined } from "@ant-design/icons";
import { isAppDevMode } from "@/lib/utils";
import { EnhancedImage } from "@/components/Image/Image";

export default async function PortfolioPage() {
  const data = await fetchPortfolio();
  return (
    <>
      {/* Empty project UI */}
      {/* If not isAppEditable, otherwise it will show both the empty state and the add project button */}
      {data.length === 0 && !isAppDevMode() && (
        <Center h={"100%"}>
          <Stack ta={"center"} gap={0}>
            <Box
              style={{
                textAlign: "center",
              }}
            >
              <CloseSquareFilled
                style={{
                  fontSize: "6rem",
                  color: "var(--mantine-color-red-4)",
                }}
              />
            </Box>
            <Title order={1} ta={"center"} pt="xl">
              Oh no!
            </Title>
            <Text size="xl" c="dimmed" ta={"center"}>
              No Projects Found
            </Text>
          </Stack>
        </Center>
      )}

      {/* Project Cards */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="sm" verticalSpacing="sm">
        {data.map((project) => (
          <Card
            component={Link}
            href={`/portfolio/${project.slug}`}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            key={project.slug}
            style={{
              cursor: "pointer",
            }}
          >
            <CardSection>
              <EnhancedImage
                src={project.thumbnailImageUrl}
                alt={project.title}
                width={400}
                height={160}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "160px",
                }}
                showPlaceholderOnError={true}
              />
            </CardSection>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>{project.title}</Text>
              <Badge color="pink">{project.status}</Badge>
            </Group>

            <Text size="sm" c="dimmed">
              {project.shortDescription}
            </Text>
          </Card>
        ))}
        {isAppDevMode() && (
          <Card
            component={Link}
            href="/portfolio/add"
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            key="add"
            style={{
              cursor: "pointer",
              border: "dashed",
              backgroundColor: "transparent",
            }}
          >
            <Flex justify="center" align="center" direction="column" h="100%">
              <Flex justify="center" align="center" direction="row" gap="xs">
                <PlusOutlined style={{ fontSize: 20 }} />
                <Title order={4}>Add Project</Title>
              </Flex>
              <Text size="sm" c="dimmed">
                Click to add a new project
              </Text>
            </Flex>
          </Card>
        )}
      </SimpleGrid>
    </>
  );
}
