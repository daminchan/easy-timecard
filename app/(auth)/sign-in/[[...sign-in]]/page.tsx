import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          企業アカウントでログイン
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary-600 hover:bg-primary-500",
                footerActionLink: "text-primary-600 hover:text-primary-500",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
