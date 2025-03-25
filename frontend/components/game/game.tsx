'use client'
import { useRef, useState } from 'react'
import '../../styles/game.css'
import Response from '../responses/response'

type song = {
    src: string,
    answers: string[],
    correctAnswer: string
}

const songs: song[] = [
    { src: '/again.mp3', answers: ['resp cor', 'resp2', 'resp3', 'resp4'], correctAnswer: 'resp cor' },
    { src: '/goldentime.mp3', answers: ['resp1', 'resp cor', 'resp3', 'resp4'], correctAnswer: 'resp cor' }
]

export default function Game() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const songs: string[] = ['/again.mp3', '/goldentime.mp3']

    return (
        <div className="game-container">

            <div className='game-screen'>
                <div className='screen-content'></div>
            </div>


            <div className="respostas-container">
                <div className="respostas">Opção 1</div>
                <div className="respostas">Opção 2</div>
                <div className="respostas">Opção 3</div>
                <div className="respostas">Opção 4</div>
            </div>
        </div>
    )
}