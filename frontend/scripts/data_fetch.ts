"use server"
import { attemptType } from "../models/model"
import { refreshAccessCookie } from "./auth"

const base_url = "http://backend:8000/"

export async function getSongById(id) {
    try {
        const res = await fetch(base_url + `track/${id}`)
        const data = await res.json()
        return {
            title: data.title_short,
            song: data.preview,
            artist: data.artist.name,
            rank: data.rank
        }
    } catch (err) {
        console.error("Erro ao buscar música por ID:", err)
        throw err
    }
}

export async function getSongsByGenre(genre, qtdSongs = 1) {
    try {
        const res = await fetch(base_url + `genre/list?name=${genre}&n=${qtdSongs}`)
        const data = await res.json()
        return data.data.map(item => {
            const title = item.title.split(" (")[0]
            return {
                title: title,
                song: item.preview,
                artist: item.artist,
                picture: item.picture,
                rank: item.rank
            }
        })
    } catch (err) {
        console.error("Erro ao buscar músicas por gênero:", err)
        throw err
    }
}

export async function getSongsByName(songName, qtdResults = 5) {
    try {
        const res = await fetch(base_url + `search?q=${songName}`)
        const data = await res.json()
        return data.data.slice(0, qtdResults).map(item => {
            const title = item.title_short.split(" (")[0]
            return {
                id: item.id,
                title: title,
                song: item.preview,
                artist: item.artist.name,
                rank: item.rank
            }
        })
    } catch (err) {
        console.error("Erro ao buscar músicas por nome:", err)
        throw err
    }
}

export async function getUsers() {
    try {
        const res = await fetch(base_url + "users/")
        return await res.json()
    } catch (err) {
        console.error("Erro ao buscar usuários:", err)
        throw err
    }
}

export async function createChallenge(challenge_set) {
    try {
        const access = await refreshAccessCookie()
        const res = await fetch(base_url + "challenge_sets/", {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${access}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(challenge_set)
        })
        const data = await res.json()
        console.log(data)
        return data
    } catch (error) {
        console.error("Erro ao criar desafio:", error.message)
        throw error
    }
}

export async function getChallengeById(idChallenge: number) {
    try {
        const res = await fetch(base_url + `challenge_sets/${idChallenge}`)

        if (res.status === 404) {
            throw new Error(`Desafio ${idChallenge} não encontrado`)
        } else if (!res.ok) {
            throw new Error(`Erro ao procurar desafio ${idChallenge}`)
        }

        const data = await res.json()

        const challengesWithSongs = await Promise.all(
            data.challenges.map(async challenge => {
                const song = await getSongById(challenge.track)
                return { ...challenge, track: song.song, rank: song.rank }
            })
        )

        return challengesWithSongs
    } catch (err) {
        console.error("Erro ao buscar desafio: ", err)
        throw err
    }
}

export async function tryChallenge(data: attemptType) {
    try {
        const access = await refreshAccessCookie()
        const res = await fetch(base_url + "attempts/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${access}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
    } catch (err) {
        console.log("Erro ao realizar tentativa: ", err)
        throw err
    }
}