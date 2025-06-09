"use client";

import {
  Box,
  Burger,
  Button,
  Container,
  Group,
  Stack,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { usePathname } from "next/navigation";
import CVDownloadPDFButton from "@/components/CVDownloadPDFButton";
import {
  EditOutlined,
  HomeOutlined,
  ProfileOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { isAppDevMode } from "@/lib/utils";

const mainLinks = [
  { link: "/", label: <HomeOutlined /> },
  { link: "/portfolio", label: "Portfolio" },
  { link: "/curriculum-vitae", label: "CV" },
];

function MobileMenu({
  activeLink,
}: {
  activeLink: (typeof mainLinks)[number];
}) {
  const [opened, { close, toggle }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.3,
          blur: 10,
        }}
        shadow="none"
        styles={{
          content: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <Stack>
          <Link href="/" onClick={close}>
            <Button
              variant={activeLink.link === "/" ? "filled" : "subtle"}
              size="xl"
              data-active={activeLink.link === "/" ? true : undefined}
              leftSection={<HomeOutlined />}
            >
              Home
            </Button>
          </Link>
          <Link href="/portfolio" onClick={close}>
            <Button
              variant={activeLink.link === "/portfolio" ? "filled" : "subtle"}
              size="xl"
              data-active={activeLink.link === "/portfolio" ? true : undefined}
              leftSection={<ProjectOutlined />}
            >
              Portfolio
            </Button>
          </Link>
          <Link href="/curriculum-vitae" onClick={close}>
            <Button
              variant={
                activeLink.link === "/curriculum-vitae" ? "filled" : "subtle"
              }
              size="xl"
              data-active={
                activeLink.link === "/curriculum-vitae" ? true : undefined
              }
              leftSection={<ProfileOutlined />}
            >
              CV
            </Button>
          </Link>
        </Stack>
      </Modal>

      <Burger
        opened={opened}
        onClick={toggle}
        size="sm"
        hiddenFrom="sm"
      />
    </>
  );
}
export default function AppHeader() {
  const pathname = usePathname();

  const activeLink = mainLinks.find((link) => {
    const firstPart = "/" + pathname.split("/")[1];
    return firstPart === link.link;
  });

  const mainItems = mainLinks.map((item, index) => (
    <Button
      component={Link}
      href={item.link}
      variant="subtle"
      size="sm"
      key={index}
      data-active={item.link === activeLink?.link || undefined}
      className={classes.mainLink}
    >
      {item.label}
    </Button>
  ));

  return (
    <>
      <Container>
        <Group
          gap={0}
          justify="space-between"
        >
          <MobileMenu activeLink={activeLink || mainLinks[0]} />

          <Box visibleFrom="sm">{mainItems}</Box>
          <Group>
            {isAppDevMode() && (
              <Button
                component={Link}
                href="/curriculum-vitae/edit"
                variant="subtle"
                size="xs"
                leftSection={<EditOutlined />}
              >
                CV / Profile
              </Button>
            )}
            <CVDownloadPDFButton />
          </Group>
        </Group>
      </Container>
    </>
  );
}
