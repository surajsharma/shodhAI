'use client'

import { useParams } from 'next/navigation'
import SubmissionStatus from '@/app/components/SubmissionStatus'

export default function SubmissionPage() {
    const params = useParams()
    const submissionId = Number(params.id)

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <SubmissionStatus submissionId={submissionId} />
        </div>
    )
}