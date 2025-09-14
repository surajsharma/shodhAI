'use client'

import { contestAPI } from '@/app/api/client'
import Editor from '@monaco-editor/react'
import { Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface CodeEditorProps {
    problemId: number
    userId?: number
    onSubmit?: (submissionId: number) => void
}

export default function CodeEditor({ problemId, onSubmit }: CodeEditorProps) {
    const [code, setCode] = useState(`public static void main(String[] args) {\n\t// Your code here \n}`)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userId, setUserId] = useState<number | null>(null)
    const router = useRouter()


    useEffect(() => {
        const storedUserId = localStorage.getItem('userId')
        if (storedUserId) {
            setUserId(parseInt(storedUserId))
        }
    }, [])


    const handleSubmit = async () => {
        if (!code.trim()) {
            toast.error('Please write some code first!')
            return
        }

        if (!userId) {
            toast.error('Please login first!')
            return
        }

        setIsSubmitting(true)
        try {
            const submission = await contestAPI.submitSolution(code, 'JAVA', userId, problemId)
            toast.success(`Submission ${submission.id} created!`)
            if (onSubmit) {
                onSubmit(submission.id)
            }
        } catch (error) {
            router.push('/')
            toast.error('Session expired, please login again')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
                <span className="text-sm font-mono">Main.java</span>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-judge-green hover:bg-green-600 px-4 py-1 rounded text-sm disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>Submitting...</>
                    ) : (
                        <>
                            <Send size={16} />
                            Submit
                        </>
                    )}
                </button>
            </div>
            <Editor
                height="400px"
                defaultLanguage="java"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                }}
            />
        </div>
    )
}