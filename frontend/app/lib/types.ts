export interface Contest {
    id: number
    title: string
    description: string
    startTime: string
    endTime: string
    problems?: Problem[]
}

export interface Problem {
    id: number
    title: string
    description: string
}

export interface Submission {
    id: number
    code: string
    language: string
    status: string
    score: number
    submittedAt: string
    user: User
    problem?: Problem
}

export interface User {
    id: number
    username: string
    email: string
}

export interface LeaderboardEntry {
    username: string
    score: number
}