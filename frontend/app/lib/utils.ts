import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'ACCEPTED':
            return 'text-judge-green'
        case 'WRONG_ANSWER':
            return 'text-judge-red'
        case 'TIME_LIMIT_EXCEEDED':
            return 'text-judge-yellow'
        case 'COMPILATION_ERROR':
        case 'RUNTIME_ERROR':
            return 'text-red-600'
        case 'PENDING':
        case 'RUNNING':
            return 'text-judge-blue'
        default:
            return 'text-gray-500'
    }
}


export function getStatusClasses(status: string): string {
    switch (status) {
        case 'ACCEPTED':
            return 'bg-green-100 text-green-800'
        case 'WRONG_ANSWER':
            return 'bg-red-100 text-red-800'
        case 'TIME_LIMIT_EXCEEDED':
            return 'bg-yellow-100 text-yellow-800'
        case 'COMPILATION_ERROR':
            return 'bg-orange-100 text-orange-800'
        case 'RUNTIME_ERROR':
            return 'bg-pink-100 text-pink-800'
        case 'PENDING':
            return 'bg-gray-100 text-gray-800'
        case 'RUNNING':
            return 'bg-blue-100 text-blue-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}