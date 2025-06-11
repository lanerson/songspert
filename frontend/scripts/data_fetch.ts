"use server"
import { attemptRandom, attemptType } from "../models/model"
import { refreshAccessCookie } from "./auth"

const base_url = "http://backend:8000/"

export async function getSongById(id) {
    try {
        const res = await fetch(`${base_url}track/${encodeURIComponent(id)}`);
        if (!res.ok) {
            throw new Error(`Erro HTTP! Status: ${res.status}`);
        }

        const data = await res.json();

        if (!data || !data.artist || !data.preview) {
            throw new Error("Resposta incompleta ou inválida da API.");
        }

        return {
            title: data.title_short,
            song: data.preview,
            artist: data.artist.name,
            rank: data.rank
        };
    } catch (err) {
        console.error("Erro ao buscar música por ID:", err);
        throw err;
    }
}


export async function getSongsByGenre(genre, qtdSongs = 1) {
    try {
        const res = await fetch(`${base_url}genre/list?name=${encodeURIComponent(genre)}&n=${qtdSongs}`);
        if (!res.ok) {
            throw new Error(`Erro HTTP! Status: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data.data)) {
            throw new Error("Resposta inesperada: data.data não é uma lista.");
        }

        return data.data.map(({ id, title, preview, artist, picture, rank }) => ({
            id,
            title: title.split(" (")[0],
            song: preview,
            artist,
            picture,
            rank
        }));
    } catch (err) {
        console.error("Erro ao buscar músicas por gênero:", err);
        throw err;
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

export async function getUserById(id: number) {
    try {
        const res = await fetch(base_url + `users/${id}/`)
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

export async function getChallenges() {
    try {
        const res = await fetch(base_url + `challenge_sets/summary/`)

        if (!res.ok) {
            throw new Error(`Erro ao procurar desafios`)
        }
        const data = await res.json()
        return data

    } catch (err) {
        console.error("Erro ao buscar desafios", err)
        throw err
    }
}

export async function verifyAttempt(challengeId) {
    try {
        const access = await refreshAccessCookie();
        const res = await fetch(base_url + "attempts/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access}`,
            },
        });
        const data = await res.json();
        return data.filter(teste => teste.challenge_set == challengeId);
    } catch (err) {
        console.log("Erro verificar tentativas: ", err);
        throw err;
    }
}

export async function tryChallenge(data: attemptType) {
    try {
        const result = await verifyAttempt(data.challenge_set);
        const access = await refreshAccessCookie();

        if (result?.length) {
            const attempt = result[0];
            await fetch(base_url + `attempts/${attempt.id}/`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${access}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        } else {
            await fetch(base_url + "attempts/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${access}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        }
    } catch (err) {
        console.log("Erro ao realizar tentativa: ", err);
        throw err;
    }
}


export async function verifyRandomChallenge(trackId) {
    try {
        const access = await refreshAccessCookie()
        const res = await fetch(base_url + "random_attempts/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access}`,
            },

        })
        const data = await res.json()
        return data.filter(teste => teste.track == trackId)
    } catch (err) {
        console.log("Erro verificar tentativas: ", err)
        throw err
    }
}

export async function tryRandomChallenge(data: attemptRandom) {
    try {
        const result = await verifyRandomChallenge(data.track)
        const access = await refreshAccessCookie()
        if (result?.length) {
            const attempt = result[0];
            await fetch(base_url + `random_attempts/${attempt.id}/`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${access}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
        } else {
            await fetch(base_url + "random_attempts/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${access}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
        }
    } catch (err) {
        console.log("Erro ao realizar tentativa: ", err)
        throw err
    }
}