'use client'
import { useRef, useState } from "react"
import { createChallenge } from "../scripts/data_fetch"
import "../styles/createChallenge.css"
import SearchBar from "./searchBar"
import { useRouter } from "next/navigation"
import { getGenres } from "../scripts/data_client"

export default function CreateChallenge() {
    const [results, setResults] = useState([])
    const [idPlaying, setIdPlaying] = useState(null)
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [challengeName, setChallengeName] = useState("")
    const [selectedGenre, setSelectedGenre] = useState("mistureba")
    const router = useRouter()
    const genres = getGenres()
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

    const handleCreate = async () => {
        if (results.length < 4) { alert("Selecione pelo menos 4 músicas") }
        else {
            let challenges = []
            let titles = results.map((song) => song.title)
            for (let i = 0; i < titles.length; i++) {
                let choices = []
                while (choices.length < 3) {
                    let choice = titles[Math.floor(Math.floor(Math.random() * titles.length))]
                    if (choice != titles[i] && !choices.includes(choice)) choices.push(choice)
                }
                choices.push(titles[i])
                let options = embaralharArray(choices)
                challenges.push({ track: results[i].id, type: "title", false_options: options })
            }
            const challengeSet = { name: challengeName, category: "title", genre: selectedGenre, challenges: challenges }
            console.log(JSON.stringify(challengeSet))
            await createChallenge(challengeSet)
                .then(() => { alert("Playlist Criada com sucesso"); router.replace("/perfil") })

        }
    }

    const handleChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    function embaralharArray(array) {
        const arrayEmbaralhado = array.slice(); // cria uma cópia do array original
        for (let i = arrayEmbaralhado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // índice aleatório entre 0 e i
            [arrayEmbaralhado[i], arrayEmbaralhado[j]] = [arrayEmbaralhado[j], arrayEmbaralhado[i]]; // troca os elementos
        }
        return arrayEmbaralhado;
    }

    return (
        <div className="create-container">
            <audio ref={audioRef} />
            <SearchBar onClick={(song) => addOption(song)} />
            <div>
                <ul className="challenges-container">
                    {results ?
                        results.map((song) =>
                            <li key={song.id} className="challenge-item">
                                <div>{song.title}<br />{song.artist}</div>
                                <button onClick={() => { playSound(song.song); handlePlay(song.id) }}
                                    className={`icon-button ${idPlaying === song.id ? 'pause' : 'play'}`}
                                />
                                <button onClick={() => deleteOption(song)}
                                    className="icon-button"
                                    style={{
                                        backgroundImage: "url(/images/trash.png)", backgroundSize: "contain"

                                    }} />
                            </li>
                        ) : <></>}
                </ul>
                {results.length !== 0 &&
                    <div style={{ margin: "10px" }}>
                        <div>Selecione um gênero</div>
                        <select value={selectedGenre} className="genre-select" onChange={handleChange}>
                            {genres.map(genre => <option value={genre} key={genre}>{genre}</option>)}
                        </select>
                        <input type="text" placeholder="Nome do Desafio" style={{ margin: '10px' }}
                            value={challengeName} onChange={(e) => setChallengeName(e.target.value)} />
                        <button onClick={handleCreate}
                            style={{ all: 'unset', padding: '10px', borderRadius: '10px', backgroundColor: 'var(--color-three)', cursor: 'pointer' }}
                        >create</button>
                    </div>}
            </div>
        </div>
    )
}