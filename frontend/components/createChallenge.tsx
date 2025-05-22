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
    const [search, setSearch] = useState("")
    const [results, setResult] = useState([])
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const handleSearch = async () => {
        const data: responseType[] = await getSongsByName(search)
        setResult(data)
    }

    const playSound = (song) => {
        if (!audioRef.current || audioRef.current !== song) { // Primeiro click ou clicou em outro filho
            audioRef.current.src = song
            audioRef.current.play()
        }
        else if (audioRef.current === song) { // Cliquei no mesmo filho
            if (audioRef.current.currentTime === 0)
                audioRef.current.play()
            else {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }


    }
    return (
        <div className="create-container">
            <div>
                <SearchBar onClick={() => console.log("clique")} />
                <ul>
                    {results ?
                        results.map((song) =>
                            <li>
                                <div>{song.title}</div>
                                <div>{song.artist}</div>
                                <button onClick={() => playSound(song.song)}>play</button>
                            </li>
                        ) : <></>}
                </ul>
            </div>
            <form>


            </form>
        </div>
    )
}