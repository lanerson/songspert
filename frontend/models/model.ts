import { setConfig } from "next/config"

enum categoriesEnum {
    Rock,
    Pop,
    MPB,
}

interface challengeInterface {
    id: number,
    name: string,
    categories: categoriesEnum[],
    songs: string[]
}


type songType = {
    id: number,
    src: string,
    answers: string[],
    correctAnswer: string
}

type userType = {
    username: string,
    rank: number,
    totalPoints: number
}


export type { challengeInterface, songType, userType }
export { categoriesEnum }