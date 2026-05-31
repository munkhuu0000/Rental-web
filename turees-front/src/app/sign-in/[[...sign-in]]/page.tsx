import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#dfffd7_0%,#d9f8ea_48%,#d7f2ff_100%)] px-4 py-10 text-[#073b44]">
      <section className="grid w-full max-w-245 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center">
          <Link href="/" className="flex w-fit items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7de85e] text-3xl font-black">
              Т
            </span>
            <span className="text-3xl font-black">Түрээс</span>
          </Link>
          <h1 className="mt-10 max-w-110 text-4xl font-bold leading-tight">
            Ажлын талбартаа нэвтэрнэ үү
          </h1>
          <p className="mt-4 max-w-105 text-base leading-7 text-[#5f7d7b]">
            Түрээс, материал, тооцоо болон тайлангаа нэг системээс удирдаарай.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-100">
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/dashboard"
              oauthFlow="redirect"
              oidcPrompt="select_account"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
