import { Project } from "@/types/types";
import { DeleteOutlined } from "@ant-design/icons";
import { Dialog, Group, Button, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function DeleteButton({
  project,
  onDelete,
  loading = false,
}: {
  project: Project;
  onDelete: (project: Project) => void;
  loading?: boolean;
}) {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <Button
        variant="light"
        color="red"
        aria-label="Delete Project"
        onClick={toggle}
        disabled={loading}
        leftSection={<DeleteOutlined />}
      >
        Delete
      </Button>
      <Dialog
        opened={opened}
        withCloseButton
        position={{ bottom: 50, right: 50 }}
        onClose={close}
        size="lg"
        radius="md"
      >
        <Text size="sm" mb="xs" fw={500}>
          Are you sure you want to delete project {project.title}?
        </Text>
        <Text size="xs" c="dimmed" mb="md">
          This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button
            color="red"
            loading={loading}
            onClick={() => {
              onDelete(project);
              close();
            }}
          >
            Delete
          </Button>
        </Group>
      </Dialog>
    </>
  );
}
