import StudentForm from "@/components/StudentForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-6 py-12 flex items-center justify-center">
      <div className="max-w-md w-full">
        <header className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--ochre)] mb-2">
            Candidate review system
          </p>
          <h1 className="font-display text-4xl text-[var(--ink)] italic">Shortlister</h1>
        </header>
        <StudentForm />
      </div>
    </main>
  );
}