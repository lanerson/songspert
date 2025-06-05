'use client'
import { useRef, useState, useEffect } from 'react'
import '../../styles/game.css'
import { useRouter } from 'next/navigation'
import { songType } from '../../models/model'
import Fase from './fase'
import { getChallengeById } from '../../scripts/data_fetch'


export default function Game({ challengeId }) {
    const [toggleStart, setToggleStart] = useState<boolean>(false);
    const [currentSong, setCurrentSong] = useState<songType | null>(null);
    const [songIndex, setSongIndex] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [content, setContent] = useState<string>('PRONTO?');
    const router = useRouter()
    const [challenge, setChallenge] = useState<songType[]>([{
        id: 1,
        track: "https://cdnt-preview.dzcdn.net/api/1/1/a/9/1/0/a91845f6dd1265c2f85a3f716d9029e5.mp3?hdnea=exp=1749089255~acl=/api/1/1/a/9/1/0/a91845f6dd1265c2f85a3f716d9029e5.mp3*~data=user_id=0,application_id=42~hmac=7d38fe7bc98218a626cc696bf70c23898c69a55382734435601a46e74a8e77c1",
        genre: "",
        type: "title",
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
            console.log("desafios", challenge)
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
        const sequence: (number | string)[] = [4, 3, 2, 1];
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
                    handleGame()

                }, 1000);
            }
        }, 1000);
    };


    const handleGame = () => {
        if (songIndex === challenge.length) {
            alert("terminou")
            audioRef.current.pause()
            router.refresh()
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
                <div className='screen-content'>{content}</div>
            </div>

            <div className="play-button" onClick={startCountdown} style={{ display: toggleStart ? 'none' : 'auto' }}></div>
            <Fase
                song={currentSong}
                handleGame={handleGame} />
        </div>
    )
}