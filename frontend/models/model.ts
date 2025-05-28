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
    src: string,
    answers: string[],
    correctAnswer: string
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
    profile_picture: string
}


export type { challengeType, songType, userType }
export { typeChallengeEnum }