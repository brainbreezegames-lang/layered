export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-[var(--color-text)] mb-6">
          About Layered
        </h1>
        <div className="prose prose-lg">
          <p className="text-[var(--color-text-soft)] text-lg leading-relaxed">
            Layered is a news platform for English learners. We adapt real news
            articles to five different proficiency levels (A1, A2, B1, B2, C1),
            making current events accessible to learners at any stage.
          </p>
          <p className="text-[var(--color-text-soft)] text-lg leading-relaxed mt-4">
            More information coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
