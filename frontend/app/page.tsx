'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { userAPI } from '@/app/api/client'
import Image from 'next/image'


export default function HomePage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEnterContest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      toast.error('Please enter a username')
      return
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters')
      return
    }

    setIsLoading(true)

    try {
      // Create or get existing user
      const user = await userAPI.loginOrCreate(username.trim())

      // Store user data in localStorage
      localStorage.setItem('username', user.username)
      localStorage.setItem('userId', user.id.toString())
      localStorage.setItem('userEmail', user.email)

      toast.success(`Welcome, ${user.username}!`)

      // Navigate to contest
      router.push('/contests/1')
    } catch (error) {
      toast.error('Failed to login. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-10">
          <Image
            src="/Frame1.svg"  // Path relative to public folder
            alt="Contest Judge Logo"
            width={320}
            height={120}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">
            Online Code Judge
          </h2>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleEnterContest} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
                maxLength={20}
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-gray-500">
                New user? We&apos;ll create an account for you automatically!
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Enter Contest</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Ready to test your coding skills?
        </p>
      </div>
    </div>
  )
}