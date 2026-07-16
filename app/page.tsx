"use client";
import StudentForm from "@/components/StudentForm";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl mb-6">Shortlister</h1>
      <StudentForm />
      <button
  onClick={async () => {
    const res = await fetch("/api/stage1", { method: "POST" });
    const data = await res.json();
    alert(`Passed: ${data.passedCount}, Rejected: ${data.rejectedCount}`);
  }}
  className="mt-8 bg-blue-600 text-white p-2 rounded"
>
  Run Stage 1 Filter (test only)
</button>
    </main>
  );
}