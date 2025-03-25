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