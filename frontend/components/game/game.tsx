'use client'
import { useState } from 'react'
import '../../styles/game.css'
import { song } from '../../models/model'
import Fase from './fase'
import useAudio from './audioController'

// Constante para teste de frontend, serão mudadas para requisições backend
const songs: song[] = [
    { src: '/music/again.mp3', answers: ['AGAIN', 'HOLOGRAM', 'GOLDEN TIME', 'RAIN'], correctAnswer: 'AGAIN' },
    { src: '/music/hologram.mp3', answers: ['GOLDEN TIME', 'AGAIN', 'HOLOGRAM', 'RAIN'], correctAnswer: 'HOLOGRAM' },
    { src: '/music/goldentime.mp3', answers: ['REWRITE', 'HOLOGRAM', 'GOLDEN TIME', 'RAIN'], correctAnswer: 'GOLDEN TIME' },
    { src: '/music/rewrite.mp3', answers: ['REWRITE', 'AGAIN', 'GOLDEN TIME', 'RAIN'], correctAnswer: 'REWRITE' },
    { src: '/music/rain.mp3', answers: ['REWRITE', 'AGAIN', 'RAIN', 'GOLDEN TIME'], correctAnswer: 'RAIN' }
]

const time: number = 200
const initialTransition: string[] = ['3', '2', '1', 'START'];


export default function Game() {
    const [toggleStart, setToggleStart] = useState<boolean>(true);
    const [toggleOptions, setToggleOptions] = useState<boolean>(false);
    const [isCounting, setIsCounting] = useState<boolean>(false); // Só pra controlar a animação e a visibilidade dos componentes
    const [song, setSong] = useState<song | null>(null);
    const [songIndex, setsongIndex] = useState<number>(0);

    const { audioRef, tocar } = useAudio(song, time);
    const [content, setContent] = useState('PRONTO?');

    // Animação inicial Para iniciar o desafio
    const handleAnimation = (words: string[]) => {
        if (isCounting) return;
        let index: number = 0;
        setToggleStart(!toggleStart)
        const interval = setInterval(() => {
            setContent(words[index]);
            index++;

            if (index === words.length) {
                clearInterval(interval);
                setTimeout(() => {
                    handleStart();
                }, 1000);
            }
        }, 1000);
    }

    const changeSong = () => {
        setSong(songs[songIndex])
        setsongIndex(songIndex + 1)
        tocar()
        setContent(`song ${songIndex + 1}`)
    }



    const handleStart = () => {
        setToggleOptions(!toggleOptions)
        setIsCounting(true);
        setSong(songs[songIndex])
        setsongIndex(songIndex + 1)
        setContent(`song ${songIndex + 1}`)
        tocar()
    }

    const handleOptions = () => {
        if (songIndex < songs.length) {
            changeSong()
        }
        else {
            handleFinish()
        }
    }

    const handleFinish = () => {
        alert("terminou")
        window.location.reload()
    }

    return (
        <div className="game-container">

            <div className='game-screen'>
                <div className='screen-content'>
                    <div className="screen-text">{content}</div>
                </div>
            </div>
            <audio ref={audioRef} />
            {
                toggleStart ? <div className="play-button" onClick={() => handleAnimation(initialTransition)} style={{ display: 'auto' }}></div> :
                    toggleOptions ?
                        <Fase song={song} handleOptions={handleOptions} /> : <div></div>
            }
        </div>
    )
}