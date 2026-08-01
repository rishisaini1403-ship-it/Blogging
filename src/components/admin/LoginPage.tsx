import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  password: z.string().min(1, 'Password required'),
})

type Form = z.infer<typeof schema>

export default function LoginPage({ onLogin }: { onLogin: (pw: string) => Promise<string | null> }) {
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  const submit = async (data: Form) => {
    setError('')
    const err = await onLogin(data.password)
    if (err) setError(err)
  }

  return (
    <main className="min-h-screen pt-32 px-6 flex items-center justify-center bg-bg">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-sm">
        <p className="font-mono text-xs text-muted mb-2">~/admin</p>
        <h1 className="font-display text-2xl font-semibold text-text mb-6">Sign in</h1>

        <label className="block">
          <span className="block font-mono text-xs text-muted mb-1.5">Password</span>
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            {...register('password')}
            className="w-full px-4 py-2.5 rounded-md bg-bg border border-border text-text placeholder-subtle text-sm focus:outline-none focus:border-accent transition-colors duration-150"
          />
        </label>

        {errors.password && (
          <p className="text-red-400 text-xs mt-2 font-mono">{errors.password.message}</p>
        )}
        {error && (
          <p className="text-red-400 text-xs mt-2 font-mono">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-5 bg-accent text-bg font-medium text-sm px-4 py-2.5 rounded-md hover:bg-accent/90 transition-colors duration-150 disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
