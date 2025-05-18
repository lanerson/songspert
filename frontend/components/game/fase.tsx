import { songType } from '../../models/model'


type FaseType = {
    song: songType,
    handleOptions: () => void,
    isCounting: boolean
}


export default function Fase({ song, handleOptions, isCounting }: FaseType) {
    const answersContainer = (song: songType | null) => {
        if (song == null) {
            return <div></div>
        }
        else {

            return (
                song.answers.map((answer) => <div className="respostas" onClick={handleOptions}>{answer}</div>)

            )
        }

    }
    return (
        <div className="respostas-container" style={{ display: isCounting ? 'grid' : 'none' }}>
            {
                answersContainer(song)
            }

        </div>
    )
}