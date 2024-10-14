import { useTheme } from "next-themes";
import { Action, useRegisterActions } from "kbar";

const useThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const themeActions: Action[] = [
    {
      id: "toggleTheme",
      name: "Toggle Theme",
      shortcut: ["t", "t"],
      section: "Theme",
      perform: toggleTheme,
    },
    {
      id: "setLightTheme",
      name: "Set Light Theme",
      section: "Theme",
      perform: () => setTheme("light"),
    },
    {
      id: "setDarkTheme",
      name: "Set Dark Theme",
      section: "Theme",
      perform: () => setTheme("dark"),
    },
  ];

  useRegisterActions(themeActions, [theme]);
};

export default useThemeSwitch;
