export function useThemeTokens(dark) {
    const bg = dark ? "#0b1324" : "#fff";
    const fg = dark ? "#e5e7eb" : "#111827";
    const sub = dark ? "#9ca3af" : "#555";
    const card = dark ? "#111827" : "#fff";
    const border = dark ? "#1f2937" : "#ddd";
    return { bg, fg, sub, card, border };
}
