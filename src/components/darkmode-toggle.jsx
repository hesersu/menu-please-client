import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Switch } from "@/components/ui/switch";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize the switch state based on the current theme
  useEffect(() => {
    // Check if the theme is explicitly dark or if it's system and system prefers dark
    if (theme === "dark") {
      setIsDarkMode(true);
    } else if (theme === "light") {
      setIsDarkMode(false);
    } else if (theme === "system") {
      // When theme is "system", check system preference
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(systemPrefersDark);
    }
  }, [theme]);

  // Toggle between dark and light modes
  const toggleTheme = (checked) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    setIsDarkMode(checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
    </div>
  );
}
