// src/api/auth.ts
import useApi from '@/shared/lib/api/use-api'

export function getLeaderboard() {
 return useApi('get', '/leaderboard')
}