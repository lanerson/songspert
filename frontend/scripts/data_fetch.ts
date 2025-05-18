
const base_url = "http://localhost:8000/"


export async function getSongById(id) {
    const data = await fetch(base_url + `track/${id}`)
        .then(async (res) => await res.json())
        .then((data) => { return { title: data.title_short, song: data.preview, artist: data.artist.name } })
    console.log(data)
    return data
}

export function getGenres() { // Deixei estático pq o método sempre retorna a mesma coisa
    return [
        "todos",
        "pop",
        "sertanejo",
        "mpb",
        "rap/funk brasileiro",
        "rap/hip hop",
        "reggaeton",
        "rock",
        "dance",
        "r&b",
        "alternativo",
        "samba/pagode",
        "electro",
        "música religiosa",
        "axé/forró",
        "folk",
        "reggae",
        "jazz",
        "clássica",
        "filmes/games",
        "metal",
        "soul & funk",
        "blues",
        "cumbia",
        "infantil",
        "música africana",
        "música indiana",
        "música asiática"
    ]
}

export async function getSongsByGenre(genre, qtdSongs) { // dá pra colocar um numero definido na interface, quando o cara for pesquisar
    const data = await fetch(base_url + `genre/list?name=${genre}&n=${qtdSongs}`)
        .then(async (res) => res.json())
        .then((data) => data.data.map((item) => { return { title: item.title, song: item.preview, artist: item.artist } }))
    return data
}

export async function getSongsByName(songName, qtdResults = 5) { // dá pra colocar um numero definido na interface, quando o cara for pesquisar
    const data = await fetch(base_url + `search?q=${songName}`)
        .then(async (res) => res.json())
        .then((data) => data.data.slice(0, qtdResults).map((item) => { return { title: item.title_short, song: item.preview, artist: item.artist.name } }))
    return data
}

export function getDailyChallenge() {
    return { challengeID: 761220, title: "MOST PLAYED SONGS IN THE 2000S" }
}

export async function getChallengeById(idChallenge: number) {
    const challenge = [975952742, 976056152, 976068472, 1100590662]
    challenge.map(async (idSong) => await getSongById(idSong))
    return challenge
}

// getSongById(761220)