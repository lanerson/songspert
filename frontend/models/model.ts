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
    src: string,
    answers: string[],
    correctAnswer: string
}


export type { challengeInterface, songType }
export { categoriesEnum }