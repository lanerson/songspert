"use client";
import { useRef, useState } from "react";
import "../../../styles/game.css"

export default function Countdown() {
    const [toggleStart, setToggleStart] = useState<boolean>(false);
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

                    setContent("Iniciar")
                }, 1000);
            }
        }, 1000);
    };


    return (
        <div className="game-container">
            <div className='game-screen'>
                <div className='screen-content'>{content}</div>
            </div>

            <div className="play-button" onClick={startCountdown} style={{ display: toggleStart ? 'none' : 'auto' }}></div>

        </div>
    )
}
