'use client'
import { useEffect, useState } from "react"
import "../styles/newChallengeCard.css"
import Game from "./game/game"
import { getDailyChallenge } from "../scripts/data_fetch"

type cardProps = {
    challengeID: number
    title: string,
}

export default function NewChallengeCard() {

    const [challengeID, setChallengeId] = useState<number>(0)
    const [title, setTitle] = useState<string>()

    useEffect(() => {
        async function getChallenge() {
            const _card: cardProps = await getDailyChallenge()
            setChallengeId(_card.challengeID)
            setTitle(_card.title)

        }
        getChallenge()
    })

    const handleClick = () => <Game challengeID={challengeID} />



    return (
        <div className="daily-container">
            <div className="card-button" onClick={handleClick} >
                PLAY NOW
            </div>
            <div className="card-content">{title}</div>
        </div>
    )
}