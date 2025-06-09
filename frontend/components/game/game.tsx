'use client'
import { useRef, useState, useEffect } from 'react'
import '../../styles/game.css'
import { useRouter } from 'next/navigation'
import { songType } from '../../models/model'
import Fase from './fase'
import { getChallengeById } from '../../scripts/data_fetch'
import { calcPoints } from '../../scripts/data_client'
import Statistics from './statistics'

export default function Game({ challengeId }) {
    const [toggleStart, setToggleStart] = useState<boolean>(false);
    const [currentSong, setCurrentSong] = useState<songType | null>(null);
    const [songIndex, setSongIndex] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [content, setContent] = useState<string>('PRONTO?');
    const [bgOverride, setBgOverride] = useState(null)
    const [points, setPoints] = useState<number>(0)
    const router = useRouter()
    const [challenge, setChallenge] = useState<songType[]>([{
        id: 1,
        track: "https://cdnt-preview.dzcdn.net/api/1/1/a/9/1/0/a91845f6dd1265c2f85a3f716d9029e5.mp3?hdnea=exp=1749089255~acl=/api/1/1/a/9/1/0/a91845f6dd1265c2f85a3f716d9029e5.mp3*~data=user_id=0,application_id=42~hmac=7d38fe7bc98218a626cc696bf70c23898c69a55382734435601a46e74a8e77c1",
        type: "title",
        rank: 0,
        false_options: [
            "Billie Jean",
            "Look Away",
            "Careless Whisper",
            "Physical"
        ],
        correct_answer: "Careless Whisper"
    }])

    const getChallenge = async () => {
        try {
            const _challenge = await getChallengeById(challengeId);
            setChallenge(_challenge);
            console.log("desafios", _challenge)
        } catch (error) {
            alert("Erro inesperado");
            console.log(error.code, error.message)
            router.replace("/")
        }
    }
    useEffect(() => {
        getChallenge()
    }, [])

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
    // Transição Inicial
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
                setTimeout(() => {
                    handleGame()

                }, 1000);
            }
        }, 1000);
    };


    const handleClickOption = (answer) => {
        console.log("musica atual: ", currentSong)
        let text = 'errou'
        let color = 'red'
        if (answer == currentSong.correct_answer) {
            color = 'green'
            text = 'acertou'
            setPoints(points + calcPoints(currentSong.rank))
        }
        setContent(text)
        setBgOverride(color)

        // Remove após 1 segundo
        setTimeout(() => {
            setBgOverride(null)
            handleGame()
        }, 1500)
    }

    const handleFinish = async () => {
        setContent("")
        audioRef.current.pause()
        router.refresh()

    }

    const handleGame = () => {
        if (songIndex === challenge.length) {
            handleFinish()

        }
        else {
            setupAudio(challenge[songIndex].track)
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
                <div className='screen-content' style={{
                    backgroundColor: bgOverride || 'white',
                    transition: 'background-color 0.5s ease'
                }}>{content}</div>
            </div>

            <div className="play-button" onClick={startCountdown} style={{ display: toggleStart ? 'none' : 'auto' }}></div>
            <Fase
                song={currentSong}
                handleClickOption={handleClickOption} />
            {
                content === "" && <Statistics />
            }
        </div>
    )
}