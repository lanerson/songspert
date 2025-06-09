import { getSongsByGenre } from "./data_fetch"

export function getGenres() { // Deixei estático pq o método sempre retorna a mesma coisa
    return [
        "mistureba",
        "pop",
        "anime",
        "sertanejo",
        "mpb",
        "rap/funk brasileiro",
        "rap/hip hop",
        "reggaeton",
        "rock",
        "dance",
        "alternativo",
        "samba/pagode",
        "electro",
        "música religiosa",
        "axé/forró",
        "folk",
        "reggae",
        "jazz",
        "clássica",
        "metal",
        "soul & funk",
        "blues",
        "cumbia",
        "música africana",
        "música indiana",
        "música asiática",
        "r&b",
    ]
}
export function getRandomSong() {
    const genres = getGenres()
    const choice = genres[Math.floor(Math.random() * genres.length)]
    return getSongsByGenre(choice)
}


export function getDailyChallenge() {
    return { challengeID: 9, title: "MOST PLAYED SONGS IN THE 2000S" }
}
