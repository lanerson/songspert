'use client'
import { useRef, useState } from 'react'
import '../../styles/game.css'
import { useRouter } from 'next/navigation'
import { song } from '../../models/model'
import Fase from './fase'


const songs: song[] = [
    { src: '/music/again.mp3', answers: ['AGAIN', 'HOLOGRAM', 'GOLDEN TIME', 'RAIN'], correctAnswer: 'AGAIN' },
    { src: '/music/hologram.mp3', answers: ['GOLDEN TIME', 'AGAIN', 'HOLOGRAM', 'RAIN'], correctAnswer: 'HOLOGRAM' },
    { src: '/music/goldentime.mp3', answers: ['REWRITE', 'HOLOGRAM', 'GOLDEN TIME', 'RAIN'], correctAnswer: 'GOLDEN TIME' },
    { src: '/music/rewrite.mp3', answers: ['REWRITE', 'AGAIN', 'GOLDEN TIME', 'RAIN'], correctAnswer: 'REWRITE' },
    { src: '/music/rain.mp3', answers: ['REWRITE', 'AGAIN', 'RAIN', 'GOLDEN TIME'], correctAnswer: 'RAIN' }
]

export default function Game() {
    const [toggleStart, setToggleStart] = useState(false);
    const [isCounting, setIsCounting] = useState(false);
    const [song, setSong] = useState<song | null>(null);
    const [songIndex, setsongIndex] = useState(0);

    const router = useRouter();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    // const [isPlaying, setIsPlaying] = useState(false);
    const [content, setContent] = useState('PRONTO?');

    const initialTransition: string[] = ['3', '2', '1', 'START'];



    const changeSong = () => {
        setsongIndex(songIndex + 1)
        audioRef.current.pause()
        if (songIndex >= songs.length) {
            setContent('PRONTO?')
            setIsCounting(false)
            setToggleStart(false)
            setsongIndex(0)
            alert("acabou")
            window.location.reload()
        }
        else {
            setContent(`song ${songIndex + 1}`)
            setSong(songs[songIndex])
            audioRef.current.src = songs[songIndex].src
            audioRef.current.play()
        }
    }

    const handleStart = (words: string[]) => {
        if (isCounting) return;
        setToggleStart(true)
        setSong(songs[0])
        let index: number = 0;
        audioRef.current.src = songs[songIndex].src
        const interval = setInterval(() => {
            setContent(words[index]);
            index++;

            if (index === words.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setContent(null);
                    setIsCounting(false);
                    handleFinish();
                }, 1000);
            }
        }, 1000);
    }
    const handleFinish = () => {
        setIsCounting(true);
        audioRef.current.play()
        setContent("song 1")
    }

    const handleOptions = () => {
        changeSong()
    }

    return (
        <div className="game-container">

            <div className='game-screen'>
                <div className='screen-content'>{content}</div>
            </div>
            <audio ref={audioRef} />
            <div className="play-button" onClick={() => handleStart(initialTransition)} style={{ display: toggleStart ? 'none' : 'auto' }}></div>
            <Fase song={song} handleOptions={handleOptions} />
        </div>
    )
}