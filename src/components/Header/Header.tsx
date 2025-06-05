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
import CVDownloadPDFButton from "@/app/(pages)/curriculum-vitae/CVDownloadPDFButton";
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
        // className={classes.burger}
        size="sm"
        hiddenFrom="sm"
      />
      {/* <Popover
        position="bottom-end"
        shadow="md"
        opened={opened}
        onClose={close}
      >
        <PopoverTarget>
          <Burger
            opened={opened}
            onClick={toggle}
            // className={classes.burger}
            size="sm"
            hiddenFrom="sm"
          />
        </PopoverTarget>
        <PopoverDropdown>
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
                data-active={
                  activeLink.link === "/portfolio" ? true : undefined
                }
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
        </PopoverDropdown>
      </Popover> */}
      {/* <Drawer
        opened={opened}
        onClose={close}
        style={{
          backgroundColor: "var(--mantine-color-blue-8)",
        }}
        styles={{
          root: {
            backgroundColor: "var(--mantine-color-blue-8)",
          },
        }}
        portalProps={{
          style: {
            backgroundColor: "var(--mantine-color-blue-8)",
          },
        }}
      >
        
      </Drawer> */}
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
          // style={{
          //   padding: "0.5rem 0",
          // }}
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

      {/* {opened && (
        <div style={{backgroundColor: "var(--mantine-color-default)"}}>
          <Divider style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }} />
          <Space>
            <NavLink
              component={Link}
              href="/"
              label="Home"
              data-active={pathname === "/" ? true : undefined}
              rightSection={<HomeOutlined />}
            />
            <NavLink
              component={Link}
              href="/portfolio"
              label="Portfolio"
              data-active={pathname.startsWith("/portfolio") ? true : undefined}
              rightSection={<ProjectOutlined />}
            />
            <NavLink
              component={Link}
              href="/curriculum-vitae"
              label="CV"
              data-active={
                pathname.startsWith("/curriculum-vitae") ? true : undefined
              }
              rightSection={<ProfileOutlined />}
            />
          </Space>
        </div>
      )} */}
    </>
  );
}
