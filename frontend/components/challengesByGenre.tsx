import "../styles/challengesByGenre.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserById } from "../scripts/data_fetch"

export default function ChallengesByGenre({ visible, _challenges, onClick }) {
    const [challenges, setChallenges] = useState([])
    const router = useRouter()

    useEffect(() => {
        const getCreators = async () => {
            const challengesWithCreators = await Promise.all(
                _challenges.map(async (challenge) => {
                    const creator = await getUserById(challenge.created_by)
                    return { ...challenge, created_by: `${creator.first_name} ${creator.last_name}` }
                })
            )

            setChallenges(challengesWithCreators)
        }

        if (_challenges?.length && visible) {
            getCreators()
        }
    }, [visible])

    return (
        <div className='showgenre-parent' style={{ display: (visible) ? 'flex' : 'none' }} onClick={onClick}>
            <div className="showgenre-container">
                <ul className="showgenre-list">
                    {challenges.map(challenge =>
                        <li key={challenge.id} className="showgenre-item"
                            onClick={() => router.replace(`/random/${challenge.id}`)}>
                            <div>
                                {challenge.name}
                            </div>
                            <div>
                                Created By: {challenge.created_by}
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}
