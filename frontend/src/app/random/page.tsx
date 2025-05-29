"use client";
import { useEffect, useRef, useState } from "react";
import "./random.css"
import { getRandomSong } from "../../../scripts/data_fetch";
import SearchBar from "../../../components/searchBar";

export default function Countdown() {
    const [toggleStart, setToggleStart] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [content, setContent] = useState<string>('PRONTO?');
    const [start, setStart] = useState(false)
    const [image, setImage] = useState('')


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
        // setupAudio("/music/drum_stick.mp3")
        setToggleStart(true)
        const sequence: (number | string)[] = [3, 2, 1];
        let i = 0;
        setContent(sequence[i].toString());
        new Audio("/music/drum_stick.mp3").play()
        const interval = setInterval(() => {
            i++;
            if (i < sequence.length) {
                setContent(sequence[i].toString());
                new Audio("/music/drum_stick.mp3").play()
            } else {
                clearInterval(interval);
                setTimeout(() => { // Após terminar a transiçao
                    setContent("Iniciar")
                    setStart(true)
                    handleRandomGame()
                }, 1000);
            }
        }, 1000);
    };
    const handleRandomGame = async () => {
        const [song] = await getRandomSong()
        console.log(song)
        setupAudio(song.song)
        setImage(song.picture)
        setContent('')
        playSound()
    }

    return (
        <div className="challenge-container">
            <div className='game-screen'>
                <div className="screen-buttom next" onClick={handleRandomGame}></div>
                <div className="screen-buttom hint"></div>
                <div className='screen-content' style={{ backgroundImage: `url(${image})` }}>{content}</div>
            </div>
            {start ? (
                <SearchBar onClick={handleRandomGame} />
            ) : <div className="play-button" onClick={startCountdown} style={{ display: toggleStart ? 'none' : 'auto' }}></div>}
        </div>
    )
}
