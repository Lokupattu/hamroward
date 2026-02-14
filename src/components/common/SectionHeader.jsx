export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  actions = null,
  theme = "light",
}) {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : align === "end"
      ? "items-end text-right"
      : "items-start text-left";

  const colorTheme =
    theme === "dark"
      ? {
          eyebrow: "text-blue-300",
          title: "text-white",
          description: "text-slate-400",
        }
      : {
          eyebrow: "text-blue-600",
          title: "text-slate-900",
          description: "text-slate-500",
        };

  return (
    <header className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow ? (
        <p className={`text-xs uppercase tracking-[0.35em] ${colorTheme.eyebrow}`}>{eyebrow}</p>
      ) : null}
      {title ? <h1 className={`text-3xl font-semibold leading-tight ${colorTheme.title}`}>{title}</h1> : null}
      {description ? <p className={`max-w-2xl text-sm ${colorTheme.description}`}>{description}</p> : null}
      {actions ? <div className="mt-2 flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

