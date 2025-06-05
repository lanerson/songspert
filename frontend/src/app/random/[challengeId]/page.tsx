import Game from "../../../../components/game/game"

export default async function Challenge({ params }:
    {
        params: Promise<{ challengeId: number }>
    }
) {

    const challengeId: number = (await params).challengeId
    return (
        <Game challengeId={challengeId} />
    )
}