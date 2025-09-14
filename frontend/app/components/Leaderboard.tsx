'use client'

import { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react'
import { contestAPI } from '@/app/api/client'
import { LeaderboardEntry } from '@/app/lib/types'
import { Trophy, Medal, Award, RefreshCw } from 'lucide-react'

interface LeaderboardProps {
    contestId: number
}

export interface LeaderboardHandle {
    refresh: () => void
}

const Leaderboard = forwardRef<LeaderboardHandle, LeaderboardProps>(
    ({ contestId }, ref) => {
        const [entries, setEntries] = useState<LeaderboardEntry[]>([])
        const [loading, setLoading] = useState(true)
        const [isRefreshing, setIsRefreshing] = useState(false)

        const fetchLeaderboard = useCallback(async () => {
            try {
                setIsRefreshing(true)
                const data = await contestAPI.getLeaderboard(contestId)
                setEntries(data)
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error)
            } finally {
                setLoading(false)
                setIsRefreshing(false)
            }
        }, [contestId])

        useEffect(() => {
            fetchLeaderboard()

            // Auto-refresh every 30 seconds
            const interval = setInterval(fetchLeaderboard, 30000)
            return () => clearInterval(interval)
        }, [contestId])

        useEffect(() => {
            fetchLeaderboard()
            const interval = setInterval(fetchLeaderboard, 30000)
            return () => clearInterval(interval)
        }, [fetchLeaderboard])

        // Expose refresh method to parent
        useImperativeHandle(ref, () => ({
            refresh: fetchLeaderboard
        }))

        const getRankIcon = (rank: number) => {
            switch (rank) {
                case 1:
                    return <Trophy className="text-yellow-500" size={20} />
                case 2:
                    return <Medal className="text-gray-400" size={20} />
                case 3:
                    return <Award className="text-orange-600" size={20} />
                default:
                    return <span className="text-gray-500 font-mono w-5 text-center">{rank}</span>
            }
        }

        return (
            <div className="bg-blue-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Trophy size={20} />
                        Leaderboard
                    </h3>
                    <button
                        onClick={fetchLeaderboard}
                        disabled={isRefreshing}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Refresh leaderboard"
                    >
                        <RefreshCw
                            size={16}
                            className={isRefreshing ? 'animate-spin' : ''}
                        />
                    </button>
                </div>

                {loading && !isRefreshing ? (
                    <div className="animate-pulse space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-10 bg-gray-200 rounded" />
                        ))}
                    </div>
                ) : entries.length === 0 ? (
                    <p className="text-gray-500 text-sm">No submissions yet</p>
                ) : (
                    <div className="space-y-2">
                        {entries.map((entry, index) => (
                            <div
                                key={entry.username}
                                className={`flex items-center justify-between p-3 rounded transition-all ${index === 0 ? 'bg-yellow-300' : 'bg-gray-300'
                                    } ${isRefreshing ? 'opacity-50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    {getRankIcon(index + 1)}
                                    <span className="text-gray-800 font-medium">{entry.username}</span>
                                </div>
                                <span className="font-mono text-sm text-gray-800">{entry.score} pts</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }
)

Leaderboard.displayName = 'Leaderboard'

export default Leaderboard