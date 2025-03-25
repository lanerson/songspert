import './categories.css'

enum categories {

}

interface challengeInterface {
    id: number,
    name: string,
    categories: string[]
}

export default function Categories() {

    const userModel =
        <div>
            <div className="perfil"></div>
            <div></div>
        </div>

    return (
        <div>
            <div className="ranking-container">
                <div className='buttons-container'>
                    <div className="buttons"></div>
                    <div className="buttons"></div>
                    <div className="buttons"></div>
                    <div className="buttons"></div>
                    <div className="buttons"></div>
                </div>
                <div className='ranking'>

                </div>
            </div>
        </div>
    )
}