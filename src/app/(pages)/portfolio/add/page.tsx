import { Container, Paper, Text } from "@mantine/core";
import PortfolioAddForm from "./form";
import { fetchAvailableTechnologies, fetchAvailableRoles } from "@/app/actions";

export default async function AddPortfolioPage() {
  try {
    const [technologies, roles] = await Promise.all([
      fetchAvailableTechnologies(),
      fetchAvailableRoles(),
    ]);
    return (
      <Container py="xl">
        <Paper pos="relative">
          <PortfolioAddForm
            availableTechnologiesProp={technologies}
            availableRolesProp={roles}
          />
        </Paper>
      </Container>
    );
  } catch (error) {
    return (
      <Container py="xl">
        <Paper pos="relative">
          <Text>Error fetching data</Text>
        </Paper>
      </Container>
    );
  }
}
