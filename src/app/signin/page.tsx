import { SigninForm } from "@/components/SigninForm";

export default function SigninPage() {
  return (
    <main className="flex flex-col items-center pt-50 min-h-screen gap-12 font-tw-kai">
      <div className="flex flex-col items-center gap-12">
        <img src="/assets/dhsc.png" alt="logo" className="w-xl" />
        <h1 className="text-5xl font-bold">案件追蹤系統</h1>
      </div>

      <SigninForm />
    </main>
  );
}
