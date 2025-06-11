import { useEffect, useState } from "react"
import "../styles/challengesByGenre.css"
import { useRouter } from "next/navigation"

export default function ChallengesByGenre({ visible, challenges, onClick }) {
    const router = useRouter()

    return (
        <div className='showgenre-parent' style={{ display: (visible) ? 'flex' : 'none' }}
            onClick={onClick}>
            <div className="showgenre-container" >

                <ul>
                    {challenges.map(challenge =>
                        <li key={challenge.name}
                            onClick={() => router.replace(`/random/${challenge.id}`)}>{challenge.name}</li>)}
                </ul>
            </div>
        </div >
    )
}