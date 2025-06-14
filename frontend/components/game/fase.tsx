import { songType } from '../../models/model'


type FaseType = {
    song: songType
    handleClickOption: (answer) => void,
}


export default function Fase({ song, handleClickOption }: FaseType) {
    const answersContainer = (song: songType | null) => {
        if (song == null) {
            return <div></div>
        }
        else {

            return (
                song.false_options.map((answer) => <div className="respostas" key={answer} onClick={() => handleClickOption(answer)}>{capitalizar(answer)}</div>)

            )
        }

    }
    const capitalizar = (string: string) => string.toLowerCase().split(" ").map(str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).join(" ")


    return (
        <div className="respostas-container" style={{ display: 'grid' }}>
            {
                answersContainer(song)
            }

        </div>
    )
}