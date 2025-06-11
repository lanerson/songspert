import { setConfig } from "next/config"

enum typeChallengeEnum {
    author = "author",
    title = "title"
}

type challengeType = {
    "id": number,
    "track": string,
    "genre": string,
    "type": typeChallengeEnum,
    "correct_answer": "string"
}


type songType = {
    id: number,
    track: string,
    type: string,
    rank: number,
    false_options: string[],
    correct_answer: string
}

type userType = {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    daily_points: number,
    weekly_points: number,
    monthly_points: number,
    random_points: number,
    profile_picture: string,
}

type attemptType = {
    "challenge_set": number,
    "score": number,
    "is_correct": boolean
}

type attemptRandom = {
    "track": number,
    "score": number,
    "tips_used": number
}

export type { challengeType, songType, userType, attemptType, attemptRandom }
export { typeChallengeEnum }