import { useEffect, useRef } from "react";
import { song } from '../../models/model'

const useAudio = (song: song | null, time: number) => {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (song !== null) {
            audioRef.current.src = song.src
        }
    })

    const tocar = () => {
        setTimeout(() => audioRef.current.play(), 300)

        setTimeout(() => audioRef.current.pause(), time * 1000)
    }
    return { audioRef, tocar }
}

export default useAudio