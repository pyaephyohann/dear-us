"use client";

interface BasicInfoFormProps {
  recipientName: string;
  creatorName: string;
  title: string;
  introMessage: string;
  errors: Record<string, string | undefined>;
  onChange: (field: string, value: string) => void;
}

export function BasicInfoForm({
  recipientName,
  creatorName,
  title,
  introMessage,
  errors,
  onChange,
}: BasicInfoFormProps) {
  return (
    <section className="space-y-6">
      {/* Recipient name */}
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="recipientName">
          Who is this little thing for? 💕
        </label>
        <input
          id="recipientName"
          type="text"
          value={recipientName}
          onChange={(e) => onChange("recipientName", e.target.value)}
          placeholder="My Love"
          className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder-foreground-subtle outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Creator name */}
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="creatorName">
          And who made it? 🫶
        </label>
        <input
          id="creatorName"
          type="text"
          value={creatorName}
          onChange={(e) => onChange("creatorName", e.target.value)}
          placeholder="Your name"
          className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder-foreground-subtle outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="title">
          Give your little thing a name ✨
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="A Little Something For You 💌"
          className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder-foreground-subtle outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-primary">{errors.title}</p>
        )}
      </div>

      {/* Intro message */}
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="introMessage">
          Add a sweet intro message <span className="text-foreground-subtle">(optional)</span>
        </label>
        <textarea
          id="introMessage"
          value={introMessage}
          onChange={(e) => onChange("introMessage", e.target.value)}
          placeholder="I made this just for you. Answer honestly, okay? 🥹"
          rows={2}
          className="mt-2 w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder-foreground-subtle outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {errors.introMessage && (
          <p className="mt-1.5 text-xs text-primary">{errors.introMessage}</p>
        )}
      </div>
    </section>
  );
}
