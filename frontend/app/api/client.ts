import axios from 'axios'
import { Contest, Submission, LeaderboardEntry, User } from '@/app/lib/types'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:8080/api`
        : 'http://localhost:8080/api')

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
})


export const userAPI = {
    loginOrCreate: async (username: string): Promise<User> => {
        const params = new URLSearchParams()
        params.append('username', username)

        const { data } = await api.post('/users/login', params)
        return data
    },

    getByUsername: async (username: string): Promise<User> => {
        const { data } = await api.get(`/users/by-username/${username}`)
        return data
    },
}

export const contestAPI = {
    getContest: async (id: number): Promise<Contest> => {
        const { data } = await api.get(`/contests/${id}`)
        return data
    },


    submitSolution: async (
        code: string,
        language: string,
        userId: number,
        problemId: number
    ): Promise<Submission> => {
        const params = new URLSearchParams()
        params.append('code', code)
        params.append('language', language)
        params.append('userId', userId.toString())
        params.append('problemId', problemId.toString())

        const { data } = await api.post('/submissions', params)
        return data
    },
    getSubmission: async (id: number): Promise<Submission> => {
        const { data } = await api.get(`/submissions/${id}`)
        return data
    },

    getLeaderboard: async (contestId: number): Promise<LeaderboardEntry[]> => {
        const { data } = await api.get(`/contests/${contestId}/leaderboard`)
        return data
    },
}