'use client'
import { useState } from 'react'
import { getGenres } from '../../../scripts/data_fetch'
import './search.css'

enum categories {

}

interface challengeInterface {
    id: number,
    name: string,
    categories: string[]
}

export default function Search() {
    const [page, setPage] = useState(0);
    const genres = getGenres()
    console.log(genres.length)
    const qtdCards = 12



    const handlePage = (next) => {
        let qtdPage = Math.ceil(genres.length / qtdCards)
        if (next) {
            setPage((page + 1) % qtdPage)
        }
        else {
            setPage((page - 1 + qtdPage) % qtdPage)
        }
    }
    return (
        <div className='search-container'>
            <div>
                <div>
                    Gênero
                </div>
                <div>Lista Completa</div>
            </div>
            <div className="genre-container">
                <div className="change-button left" onClick={() => handlePage(false)}></div>
                <div className='buttons-container'>
                    {genres.slice(page * qtdCards, page * qtdCards + qtdCards).map((genre) => <div className="buttons" key={genre}>{genre}</div>)}
                </div>
                <div className="change-button" onClick={() => handlePage(true)}></div>
            </div>
        </div>
    )
}