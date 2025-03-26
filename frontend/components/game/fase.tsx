'use client'
import '../../styles/game.css'
import { song } from '../../models/model'

type FaseType = {
    song: song,
    handleOptions: () => void,
}


export default function Fase({ song, handleOptions }: FaseType) {
    const AnswersContainer: React.FC<{ song: song | null }> = ({ song }) => {
        if (!song) {
            return <div></div>;
        }

        return (
            <div className="respostas-container" style={{ display: 'grid' }}>
                {song.answers.map((answer, index) => (
                    <div key={index} className="respostas" onClick={handleOptions}>
                        {answer}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AnswersContainer song={song} />
    )
}