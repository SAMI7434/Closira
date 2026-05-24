/**
 * Example hook skeleton for theme toggling.
 * Add useState logic and useColorScheme when connecting.
 */
import { useState, useEffect } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const subscription = (require as any)("expo-system-ui")?.getColorScheme?.();
    // no-op — leave as manual toggle
    return () => {};
  }, []);

  const toggle = () => setIsDark((p) => !p);
  return { isDark, toggle };
}
