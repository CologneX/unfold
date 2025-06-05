import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/notifications/styles.css";

import "./global.css";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import AppHeader from "@/components/Header/Header";
import { Notifications } from "@mantine/notifications";
import { Viewport } from "next";

export const metadata = {
  title: "Unfold",
  description: "Your Talents, Your Journeys, Your Crafts",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto">
          <Notifications />
          <AppShell
            transitionDuration={500}
            transitionTimingFunction="ease"
            header={{
              height: 54,
            }}
            padding="xs"
          >
            <AppShellHeader style={{ alignContent: "center" }}>
              <AppHeader />
            </AppShellHeader>
            <AppShellMain
              h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - var(--app-shell-padding) * 2)"
              // style={{
              //   padding: "var(--app-shell-header-height) 1rem",
              // }}
            >
              {children}
            </AppShellMain>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
