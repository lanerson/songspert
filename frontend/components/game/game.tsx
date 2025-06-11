'use client'
import { useRef, useState, useEffect } from 'react'
import '../../styles/game.css'
import { useRouter } from 'next/navigation'
import { attemptType, songType } from '../../models/model'
import Fase from './fase'
import { getChallengeById, tryChallenge } from '../../scripts/data_fetch'
import { calcPoints } from '../../scripts/data_client'
import { getCookies } from '../../scripts/cookies'

export default function Game({ challengeId }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const router = useRouter()
    const [toggleStart, setToggleStart] = useState<boolean>(false);
    const [currentSong, setCurrentSong] = useState<songType | null>(null);
    const [songIndex, setSongIndex] = useState<number>(0);
    const [content, setContent] = useState<string>('PRONTO?');
    const [bgOverride, setBgOverride] = useState(null)
    const [points, setPoints] = useState<number>(0)
    const [finish, setFinish] = useState(false)
    const [loading, setLoading] = useState<boolean>(true); // NOVO ESTADO
    const [challenge, setChallenge] = useState<songType[]>([])

    const getChallenge = async () => {
        try {
            setLoading(true);
            const _challenge = await getChallengeById(challengeId);
            setChallenge(_challenge);
            console.log("desafios", _challenge)
            setLoading(false);
        } catch (error) {
            alert("Erro inesperado");
            console.log(error.code, error.message)
            setLoading(false);
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

    const handleClickOption = (answer: string) => {
        let text = 'errou'
        let color = 'red'
        if (answer == currentSong.correct_answer.split(" (")[0]) {
            color = 'green'
            text = 'acertou'
            setPoints(prev => prev + calcPoints(currentSong.rank));
        }
        setContent(text)
        setBgOverride(color)


        setTimeout(() => {
            setBgOverride(null)
            handleGame()
        }, 1500)
    }

    const handleFinish = async () => {
        setContent("")
        setFinish(true)
        let content_finish = "Challenge completed\n" +
            `+${points} points`
        let teste = await getCookies()
        if (teste !== null) {
            let data: attemptType = {
                "challenge_set": challengeId,
                "score": points,
                "is_correct": true
            }
            await tryChallenge(data)
        } else {
            content_finish += '\nLog in to save your progress'
        }
        setContent(content_finish)
        audioRef.current.pause()
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
            <div className={`game-screen ${(finish) ? 'expand' : ''}`}>
                <div className='screen-content' style={{
                    backgroundColor: bgOverride || 'white',

                }}>
                    {loading ? 'Loading...' : content}
                </div>
            </div>
            <div
                className="play-button"
                onClick={startCountdown}
                style={{
                    display: (!loading && !toggleStart) ? 'block' : 'none'
                }}
            ></div>
            {
                (!finish && !loading) &&
                <Fase
                    song={currentSong}
                    handleClickOption={handleClickOption} />
            }
            {
                finish && <div className='respostas' onClick={() => router.replace("/search")}
                    style={{ margin: '20px auto', placeSelf: 'flex-end', height: '50px' }}>Novo desafio</div>
            }
        </div>
    )
}
