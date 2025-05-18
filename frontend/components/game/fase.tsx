import { songType } from '../../models/model'


type FaseType = {
    song: songType
    handleGame: () => void,
}


export default function Fase({ song, handleGame }: FaseType) {
    const answersContainer = (song: songType | null) => {
        if (song == null) {
            return <div></div>
        }
        else {

            return (
                song.answers.map((answer) => <div className="respostas" key={answer} onClick={handleGame}>{answer}</div>)

            )
        }

    }
    return (
        <div className="respostas-container" style={{ display: 'grid' }}>
            {
                answersContainer(song)
            }

        </div>
    )
}