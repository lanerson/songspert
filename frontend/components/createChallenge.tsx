'use client'
import { useRef, useState } from "react"
import { getSongsByName } from "../scripts/data_fetch"
import "../styles/createChallenge.css"
import SearchBar from "./searchBar"

type responseType = {
    id: string,
    title: string,
    song: string,
    artist: string
}

export default function CreateChallenge() {
    const [results, setResults] = useState([])
    const [idPlaying, setIdPlaying] = useState(null)
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = (id) => {
        if (idPlaying === id) {
            setIdPlaying(null)
        } else {
            setIdPlaying(id)
        }
    }

    const playSound = (song) => {

        if (audioRef.current === null || audioRef.current.src !== song) {
            audioRef.current.src = song
        }
        if (audioRef.current.paused) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }
    const addOption = (song) => {
        deleteOption(song)
        setResults([...results, song])
    }


    const deleteOption = (song) => {
        if (audioRef.current && audioRef.current.src === song.song) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        let _results = results.filter(item => item != song)
        setResults(_results)
    }

    const handleCreate = () => {
        // Criar lógica para embaralhar as alternativas
        if (results.length < 4) { alert("Selecione pelo menos 4 músicas") }
        else {
            let challenges = []
            let titles = results.map((song) => song.title)
            for (let i = 0; i < titles.length; i++) {
                let choices = []
                while (choices.length < 3) {
                    let choice = titles[Math.floor(Math.floor(Math.random() * titles.length))]
                    if (choice != titles[i]) choices.push(choice)
                }
                challenges.push({ track: results[i].song, correct_answer: results[i].title, genre: "", type: "title", false_options: choices })
            }
            console.log(challenges)
        }
    }

    return (
        <div className="create-container">
            <audio ref={audioRef} />
            <SearchBar onClick={(song) => addOption(song)} />
            <div>
                <ul className="challenges-container">
                    {results ?
                        results.map((song) =>
                            <li key={song.id}>
                                <div>{song.title}</div>
                                <div>{song.artist}</div>
                                <button onClick={() => { playSound(song.song); handlePlay(song.id) }}>
                                    {(idPlaying === song.id ? 'Pausar' : 'Play')}
                                </button>
                                <button onClick={() => deleteOption(song)}>excluir</button>
                            </li>
                        ) : <></>}
                </ul>
                {results.length !== 0 &&
                    <div>
                        <input type="text" placeholder="Nome do Desafio" />
                        <button onClick={handleCreate}>create</button>
                    </div>}
            </div>
        </div>
    )
}