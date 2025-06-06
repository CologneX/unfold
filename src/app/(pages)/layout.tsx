import { Container } from "@mantine/core";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Container h={"100%"}>{children}</Container>;
}
