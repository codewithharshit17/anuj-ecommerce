export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto py-20">

      <h1 className="text-3xl font-bold mb-8">
        Login
      </h1>

      <form className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
        />

        <button
          className="
            w-full
            bg-red-500
            text-white
            p-3
            rounded
          "
        >
          Login
        </button>

      </form>

    </main>
  );
}