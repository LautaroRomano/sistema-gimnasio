export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex  flex-col items-center justify-center gap-4">
      <div className="inline-block w-screen text-center justify-center max-w-xl">
        {children}
      </div>
    </section>
  );
}
