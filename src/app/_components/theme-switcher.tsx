// app/components/theme-switcher.tsx
"use client";

import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };


  return (
    <div className="flex items-center gap-2">
      <Button size="lg" isIconOnly onPress={toggleTheme} variant="ghost">
        {theme === "light" ? <Moon /> : <Sun />}
      </Button>
      {/* <Button
        variant={activeTheme === "light" ? "primary" : "secondary"}
        onPress={() => setTheme("light")}
      >
        Light
      </Button>
      <Button
        variant={activeTheme === "dark" ? "primary" : "secondary"}
        onPress={() => setTheme("dark")}
      >
        Dark
      </Button>
      <Button variant={theme === "system" ? "primary" : "secondary"} onPress={() => setTheme("system")}>
        System
      </Button> */}
    </div>
  );
}
