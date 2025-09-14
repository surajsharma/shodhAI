'use client'

import { contestAPI } from '@/app/api/client'
import CodeEditor from '@/app/components/CodeEditor'
import Leaderboard, { LeaderboardHandle } from '@/app/components/Leaderboard'
import SubmissionStatus from '@/app/components/SubmissionStatus'
import { Contest } from '@/app/lib/types'
import { ArrowLeft, Code2, Trophy } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function ContestPage() {
    const params = useParams()
    const router = useRouter()
    const contestId = Number(params.id)
    const [contest, setContest] = useState<Contest | null>(null)
    const [selectedProblem, setSelectedProblem] = useState<number>(0)
    const [submissionId, setSubmissionId] = useState<number | null>(null)
    const [username, setUsername] = useState<string>('')
    const [userId, setUserId] = useState<number | null>(null)

    // Ref to control leaderboard
    const leaderboardRef = useRef<LeaderboardHandle>(null)

    useEffect(() => {
        // Get user data from localStorage
        const storedUsername = localStorage.getItem('username')
        const storedUserId = localStorage.getItem('userId')

        if (!storedUsername || !storedUserId) {
            router.push('/')
            return
        }

        setUsername(storedUsername)
        setUserId(parseInt(storedUserId))

        // Fetch contest
        const fetchContest = async () => {
            try {
                const data = await contestAPI.getContest(contestId)
                setContest(data)
            } catch (error) {
                console.error('Failed to fetch contest:', error)
            }
        }

        fetchContest()
    }, [contestId, router])

    const handleSubmission = (newSubmissionId: number) => {

        if (userId === null) {
            router.push('/')
            return
        }
        setSubmissionId(newSubmissionId)

        // Refresh leaderboard after a short delay to allow processing
        setTimeout(() => {
            leaderboardRef.current?.refresh()
        }, 2000)
    }

    if (!contest) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-gray-400">Loading contest...</div>
            </div>
        )
    }

    const currentProblem = contest.problems?.[selectedProblem]

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/')}
                                className="text-gray-400 hover:text-white"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold">{contest.title}</h1>
                                <p className="text-sm text-gray-400">Welcome, {username}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Trophy size={20} />
                            <span className="text-sm">Contest #{contestId}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Problems & Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Problem Tabs */}
                        <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
                            {contest.problems?.map((problem, index) => (
                                <button
                                    key={problem.id}
                                    onClick={() => setSelectedProblem(index)}
                                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedProblem === index
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                        }`}
                                >
                                    {problem.title}
                                </button>
                            ))}
                        </div>

                        {/* Problem Description */}
                        {currentProblem && (
                            <div className="bg-gray-800 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Code2 size={20} className="text-blue-500" />
                                    <h2 className="text-lg font-semibold">{currentProblem.title}</h2>
                                </div>
                                <p className="text-gray-300 leading-relaxed">{currentProblem.description}</p>
                            </div>
                        )}

                        {/* Code Editor */}
                        {currentProblem && (
                            <div className="bg-gray-800 rounded-lg overflow-hidden">
                                <CodeEditor
                                    problemId={currentProblem.id}
                                    onSubmit={handleSubmission}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right: Status & Leaderboard */}
                    <div className="space-y-6">
                        <Leaderboard ref={leaderboardRef} contestId={contestId} />
                        {submissionId && (
                            <SubmissionStatus
                                submissionId={submissionId}
                                onStatusChange={(status) => {
                                    // Refresh leaderboard when submission is accepted
                                    if (status === 'ACCEPTED') {
                                        leaderboardRef.current?.refresh()
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}