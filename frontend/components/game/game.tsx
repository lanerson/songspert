'use client'
import { useRef, useState, useEffect } from 'react'
import '../../styles/game.css'
import { useRouter } from 'next/navigation'
import { songType } from '../../models/model'
import Fase from './fase'



const challenge: songType[] = [
    { id: 1, src: '/music/again.mp3', answers: ['AGAIN', 'HOLOGRAM', 'GOLDEN TIME', 'RAIN'], correctAnswer: 'AGAIN' },
    { id: 2, src: '/music/hologram.mp3', answers: ['GOLDEN TIME', 'AGAIN', 'HOLOGRAM', 'RAIN'], correctAnswer: 'HOLOGRAM' },
    { id: 3, src: '/music/goldentime.mp3', answers: ['REWRITE', 'HOLOGRAM', 'GOLDEN TIME', 'RAIN'], correctAnswer: 'GOLDEN TIME' },
    { id: 4, src: '/music/rewrite.mp3', answers: ['REWRITE', 'AGAIN', 'GOLDEN TIME', 'RAIN'], correctAnswer: 'REWRITE' },
    { id: 5, src: '/music/rain.mp3', answers: ['REWRITE', 'AGAIN', 'RAIN', 'GOLDEN TIME'], correctAnswer: 'RAIN' }
]

export default function Game(challengeId) {
    const [toggleStart, setToggleStart] = useState<boolean>(false);
    const [currentSong, setCurrentSong] = useState<songType | null>(null);
    const [songIndex, setSongIndex] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [content, setContent] = useState<string>('PRONTO?');

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // volta ao início para tocar de novo
            audioRef.current.play();
        }
    }
    const setupAudio = (path: string) => {
        if (audioRef.current) {
            audioRef.current.src = path;
        } else {
            audioRef.current = new Audio(path);
        }
    };
    // Transição Inicial
    const startCountdown = () => {
        setupAudio("/music/drum_stick.mp3")
        setToggleStart(true)
        const sequence: (number | string)[] = ["", 3, 2, 1];
        let i = 0;
        setContent(sequence[i].toString());
        // playSound();

        const interval = setInterval(() => {
            i++;
            if (i < sequence.length) {
                setContent(sequence[i].toString());
                playSound();
            } else {
                clearInterval(interval);
                setTimeout(() => { // Após terminar a transiçao
                    console.log(songIndex)
                    handleGame()

                }, 1000);
            }
        }, 1000);
    };


    const handleGame = () => {
        if (songIndex === challenge.length) {
            alert("terminou")
        }
        else {
            setupAudio(challenge[songIndex].src)
            setCurrentSong(challenge[songIndex])
            playSound()
            let newIndex = songIndex + 1
            setSongIndex(newIndex)
            setContent(`song ${newIndex}`)
        }
    }

    return (
        <div className="game-container">
            <div className='game-screen'>
                <div className='screen-content'>{content}</div>
            </div>

            <div className="play-button" onClick={startCountdown} style={{ display: toggleStart ? 'none' : 'auto' }}></div>
            <Fase
                song={currentSong}
                handleGame={handleGame} />
        </div>
    )
}