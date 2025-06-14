"use client";

import { Title, Transition } from "@mantine/core";
import { useEffect, useState } from "react";

const ROLE_TEXT_STRING = [
  "Software Engineer",
  "Full-stack Developer",
  "Computer Vision Engineer",
];

const ROLE_TEXT_INTERVAL = 2500;

export function RoleText() {
  const [TextIndex, setTextIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMounted(false);
    }, ROLE_TEXT_INTERVAL);

    setIsMounted(true);
    return () => clearInterval(interval);
  }, []);

  const onExited = () => {
    setTextIndex((current) => (current + 1) % ROLE_TEXT_STRING.length);
    setIsMounted(true);
  };

  return (
    <Transition
      transition="fade-down"
      mounted={isMounted}
      duration={500}
      onExited={onExited}
    >
      {(style) => (
        <Title style={style} c="dimmed" fz={"6vmin"} fw={700}>
          {ROLE_TEXT_STRING[TextIndex]}
        </Title>
      )}
    </Transition>
  );
}

export function MovingGradient() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "50vw",
            height: "50vw",
            maxWidth: "500px",
            maxHeight: "500px",
            minWidth: "300px",
            minHeight: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--mantine-color-violet-6) 0%, var(--mantine-color-blue-4) 100%)",
            filter: "blur(100px)",
            animation: "move 25s infinite alternate",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "40vw",
            height: "40vw",
            maxWidth: "400px",
            maxHeight: "400px",
            minWidth: "200px",
            minHeight: "200px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--mantine-color-violet-6) 0%, var(--mantine-color-blue-4) 100%)",
            filter: "blur(80px)",
            animation: "move2 30s infinite alternate",
            animationDelay: "-5s",
            bottom: 0,
            right: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "30vw",
            height: "30vw",
            maxWidth: "300px",
            maxHeight: "300px",
            minWidth: "150px",
            minHeight: "150px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--mantine-color-purple-6) 0%, var(--mantine-color-blue-3) 100%)",
            filter: "blur(70px)",
            animation: "move3 28s infinite alternate",
            animationDelay: "-10s",
            top: "10%",
            left: "20%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "35vw",
            height: "35vw",
            maxWidth: "350px",
            maxHeight: "350px",
            minWidth: "180px",
            minHeight: "180px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--mantine-color-indigo-6) 0%, var(--mantine-color-cyan-4) 100%)",
            filter: "blur(90px)",
            animation: "move4 32s infinite alternate",
            animationDelay: "-15s",
            bottom: "20%",
            right: "30%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "25vw",
            height: "25vw",
            maxWidth: "250px",
            maxHeight: "250px",
            minWidth: "120px",
            minHeight: "120px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--mantine-color-grape-6) 0%, var(--mantine-color-teal-4) 100%)",
            filter: "blur(60px)",
            animation: "move5 26s infinite alternate",
            animationDelay: "-20s",
            top: "30%",
            right: "10%",
          }}
        />
      </div>
    </>
  );
}
