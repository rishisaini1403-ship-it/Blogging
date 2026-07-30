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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-white mb-6">Admin Login</h1>

        <input
          type="password"
          placeholder="Password"
          autoFocus
          autoComplete="current-password"
          {...register('password')}
          className="w-full px-4 py-2.5 rounded-lg border border-surface-border bg-surface text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent transition-colors"
        />
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
        )}
        {error && (
          <p className="text-red-400 text-xs mt-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
