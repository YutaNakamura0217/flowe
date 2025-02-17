import { Header } from "@/components/header"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">ログイン</h1>
          <LoginForm />
        </div>
      </main>
    </div>
  )
}

