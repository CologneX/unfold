import { Container, Paper, Alert, Title } from "@mantine/core";
import {
  fetchAvailableRoles,
  fetchAvailableTechnologies,
  fetchProject,
} from "@/app/actions";
import PortfolioEditForm from "./form";

export default async function PortfolioEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectSlug = id;

  try {
    const [project, availableTechnologies, availabelRoles] = await Promise.all([
      fetchProject(projectSlug),
      fetchAvailableTechnologies(),
      fetchAvailableRoles(),
    ]);

    if (!projectSlug) {
      return (
        <Container size="md" py="xl">
          <Alert color="red" title="Error">
            No project slug provided. Please access this page from a project
            page.
          </Alert>
        </Container>
      );
    }

    if (!project) {
      return (
        <Container size="md" py="xl">
          <Alert color="red" title="Project Not Found">
            The project you&apos;re trying to edit could not be found.
          </Alert>
        </Container>
      );
    }

    return (
      <Container size="md" py="xl">
        <Title order={1} mb="xl">
          Edit Project: {project.title}
        </Title>

        <Paper pos="relative">
          <PortfolioEditForm
            {...{
              projectSlug,
              project,
              technologies: availableTechnologies,
              roles: availabelRoles,
            }}
          />
        </Paper>
      </Container>
    );
  } catch (error) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Error">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </Alert>
      </Container>
    );
  }
}
