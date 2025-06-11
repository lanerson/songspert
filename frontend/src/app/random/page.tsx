"use client";
import { useRef, useState } from "react";
import "./random.css"
import SearchBar from "../../../components/searchBar";
import { calcPoints, getRandomSong } from "../../../scripts/data_client";
import { tryRandomChallenge } from "../../../scripts/data_fetch";
import { getCookies } from "../../../scripts/cookies";
import { attemptRandom } from "../../../models/model";

export default function Countdown() {
    const [toggleStart, setToggleStart] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [content, setContent] = useState<string>('PRONTO?');
    const [start, setStart] = useState(false);
    const [nPlay, setNPlay] = useState({ completed: 0, played: 0, hints: 0 })
    const [hint, setHint] = useState(false)
    const [info, setInfo] = useState({ id: 0, artist: '', title: '', image: '', rank: 0 })
    const [bgOverride, setBgOverride] = useState(null)


    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
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
        setHint(false)
        const [song] = await getRandomSong()
        console.log(song)
        setupAudio(song.song)
        setInfo({ ...song, artist: song.artist, title: song.title, image: song.picture, rank: song.rank })
        setContent('')
        playSound()
    }

    function updateRandomPoints(point) {
        setNPlay({ ...nPlay, completed: nPlay.completed + point, played: nPlay.played + 1 })
    }

    const handleTry = async (item) => {
        let text = 'errou'
        let color = 'red'
        let hit = 0
        if (item.title == info.title) { // acertou
            color = 'green'
            text = 'acertou'
            hit++
            let teste = await getCookies()
            if (teste !== null) {

                let data: attemptRandom = {
                    "track": info.id,
                    "score": calcPoints(info.rank),
                    "tips_used": hint
                }
                console.log(data)
                await tryRandomChallenge(data)
            }
        }
        updateRandomPoints(hit)
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
        setHint(true)
        setNPlay({ ...nPlay, hints: nPlay.hints + 1 })
    }

    return (
        <div className="challenge-container">
            <div className="pontuation-container">
                <div className="pontuation-buttom"><div className="pontuation-image"></div><div>{`${nPlay.completed}/${nPlay.played}`}</div></div>
                <div className="pontuation-buttom"><div className="pontuation-image left"></div><div>{nPlay.hints}</div></div>
            </div>
            <div className='game-screen'>
                <div className="screen-buttom next" onClick={handleRandomGame}></div>
                <div className="screen-buttom hint" onClick={handleHint}></div>
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
