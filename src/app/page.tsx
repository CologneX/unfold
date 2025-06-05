/*
  This is your Landing Page, you MUST change this on your own.
*/
import { Blockquote, Center, Space, Stack, Text } from "@mantine/core";
import Link from "next/link";

export default function LandingPage() {
  return (
    <Center style={{ textAlign: "center", height: "100%" }}>
      <Stack justify="space-between" style={{ height: "100%" }}>
        <Space />
        <div>
          <Text
            variant="gradient"
            fw="bolder"
            fz={"24vmin"}
            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            style={{
              margin: "0",
            }}
          >
            Unfold
          </Text>
          <Text fw={"bold"} fz={"3vmin"}>
            Your Talents, Your Journeys, Your Crafts
          </Text>
        </div>
        <Stack gap={0} pb={"xl"}>
          <Blockquote color="blue" mt="xl">
            This is a simple landing page. You can customize it as per your
            needs.
            <Space h={12} />
            To view your CV, navigate to the{" "}
            <Link
              href="/curriculum-vitae"
              style={{
                color: "var(--mantine-color-blue-filled)",
              }}
            >
              Curriculum Vitae
            </Link>{" "}
            page.
            <Space h={12} />
            To view your portfolio, navigate to the{" "}
            <Link
              href="/portfolio"
              style={{
                color: "var(--mantine-color-blue-filled)",
              }}
            >
              Portfolio
            </Link>{" "}
            page.
          </Blockquote>
        </Stack>
      </Stack>
    </Center>
  );
}
