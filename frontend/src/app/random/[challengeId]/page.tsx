import Game from "../../../../components/game/game"

export default async function Challenge({ params }:
    {
        params: Promise<{ challengeId: string }>
    }
) {

    const challengeId = (await params).challengeId
    return (
        <Game challengeId={challengeId} />
    )
}