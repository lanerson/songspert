"use client";
import { useRef, useState } from "react";
import "./random.css"
import SearchBar from "../../../components/searchBar";
import { getRandomSong } from "../../../scripts/data_client";

export default function Countdown() {
    const [toggleStart, setToggleStart] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [content, setContent] = useState<string>('PRONTO?');
    const [start, setStart] = useState(false)
    const [info, setInfo] = useState({ artist: '', title: '', image: '' })
    const [bgOverride, setBgOverride] = useState(null)


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

    const startCountdown = () => {
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
                    setContent("")
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
        setInfo({ artist: song.artist, title: song.title, image: song.picture })
        setContent('')
        playSound()
    }

    const handleTry = (item) => {
        let text = 'errou'
        let color = 'red'
        if (item.title == info.title) {
            color = 'green'
            text = 'acertou'
        }
        setContent(text)
        setBgOverride(color)

        // Remove após 1 segundo
        setTimeout(() => {
            setBgOverride(null)
            setContent('')
            handleRandomGame()
        }, 1500)

    }

    const handleHint = () => {
        setContent(info.artist)
    }
    return (
        <div className="challenge-container">
            <div className='game-screen'>
                <div className="screen-buttom next" style={{ display: !toggleStart ? 'none' : 'auto' }} onClick={handleRandomGame}></div>
                <div className="screen-buttom hint" style={{ display: !toggleStart ? 'none' : 'auto' }} onClick={handleHint}></div>
                <div className='screen-content' style={{
                    backgroundImage: bgOverride ? 'none' : `url(${info.image})`,
                    backgroundColor: bgOverride || 'white',
                    transition: 'background-color 0.5s ease'
                }}>{content}</div>
                <div className="arrow next" style={{ display: toggleStart ? 'none' : 'auto' }}>
                    pular essa
                </div>
                <div className="arrow hint" style={{ display: toggleStart ? 'none' : 'auto' }}><br />
                    dica
                </div>

            </div>
            {start ? (
                <SearchBar onClick={handleTry} />
            ) : <div className="play-button" onClick={startCountdown} style={{ display: toggleStart ? 'none' : 'auto' }}></div>}
        </div>
    )
}
