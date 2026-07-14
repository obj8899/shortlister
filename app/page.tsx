import StudentForm from "@/components/StudentForm";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl mb-6">Shortlister</h1>
      <StudentForm />
    </main>
  );
}