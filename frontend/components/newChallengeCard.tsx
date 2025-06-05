'use client'
import { useEffect, useState } from "react"
import "../styles/newChallengeCard.css"
import { useRouter } from "next/navigation"
import { getDailyChallenge } from "../scripts/data_client"

type cardProps = {
    challengeID: number
    title: string,
}

export default function NewChallengeCard() {

    const [challengeID, setChallengeId] = useState<number>(0)
    const [title, setTitle] = useState<string>()
    const router = useRouter()

    useEffect(() => {
        async function getChallenge() {
            const _card: cardProps = await getDailyChallenge()
            setChallengeId(_card.challengeID)
            setTitle(_card.title)

        }
        getChallenge()
    })

    return (
        <div className="daily-container">
            <div className="card-button" onClick={() => router.replace(`/random/${challengeID}`)} >
                PLAY NOW
            </div>
            <div className="card-content">{title}</div>
        </div>
    )
}