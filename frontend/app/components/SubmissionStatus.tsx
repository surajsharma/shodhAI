'use client'

import { useEffect, useState } from 'react'
import { contestAPI } from '@/app/api/client'
import { Submission } from '@/app/lib/types'
import { getStatusClasses, getStatusColor } from '@/app/lib/utils'
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface SubmissionStatusProps {
    submissionId: number
    onStatusChange?: (status: string) => void
}

const statusIcons = {
    ACCEPTED: CheckCircle,
    WRONG_ANSWER: XCircle,
    TIME_LIMIT_EXCEEDED: Clock,
    COMPILATION_ERROR: AlertCircle,
    RUNTIME_ERROR: AlertCircle,
    PENDING: RefreshCw,
    RUNNING: RefreshCw,
}

export default function SubmissionStatus({ submissionId, onStatusChange }: SubmissionStatusProps) {
    const [submission, setSubmission] = useState<Submission | null>(null)
    const [loading, setLoading] = useState(true)
    const [previousStatus, setPreviousStatus] = useState<string | null>(null)

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const data = await contestAPI.getSubmission(submissionId)
                setSubmission(data)

                // Notify parent if status changed
                if (previousStatus && previousStatus !== data.status && onStatusChange) {
                    onStatusChange(data.status)
                }
                setPreviousStatus(data.status)

                // Poll if still pending/running
                if (data.status === 'PENDING' || data.status === 'RUNNING') {
                    setTimeout(fetchSubmission, 1000)
                }
            } catch (error) {
                console.error('Failed to fetch submission:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSubmission()
    }, [submissionId, previousStatus, onStatusChange])

    if (loading) {
        return <div className="animate-pulse">Loading submission...</div>
    }

    if (!submission) {
        return <div>Submission not found</div>
    }

    const Icon = statusIcons[submission.status as keyof typeof statusIcons] || AlertCircle
    const isAnimating = submission.status === 'PENDING' || submission.status === 'RUNNING'

    return (
        <div className=" rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Submission #{submission.id}</h3>

            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Icon
                        className={`${getStatusColor(submission.status)} ${isAnimating ? 'animate-spin' : ''}`}
                        size={24}
                    />
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusClasses(submission.status)}`}>
                        {submission.status.replace(/_/g, ' ')}
                    </span>
                </div>

                <div className="text-sm text-gray-600">
                    <p>Score: {submission.score}</p>
                    <p>Language: {submission.language}</p>
                    <p>Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
                </div>

                {submission.code && (
                    <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                            View Code
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-800 rounded text-xs overflow-x-auto">
                            <code>{submission.code}</code>
                        </pre>
                    </details>
                )}
            </div>
        </div>
    )
}