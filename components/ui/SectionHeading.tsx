import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal
      className={`mb-12 md:mb-16 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}
    >
      <div
        className={`mb-3 flex items-center gap-2 text-sm font-medium text-violet-400 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-6 bg-gradient-to-r from-violet-500 to-transparent" />
        {eyebrow}
      </div>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-balance text-base leading-relaxed text-zinc-400">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
