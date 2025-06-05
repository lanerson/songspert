'use client'
import './search.css'
import { useState } from 'react'
import { getGenres } from '../../../scripts/data_client';

export default function Search() {
    const [page, setPage] = useState(0);
    const genres = getGenres()
    const qtdCards = 12
    const qtdPage = Math.ceil(genres.length / qtdCards)

    const handlePage = (next: boolean) => {
        if (next) {
            setPage((page + 1) % qtdPage)
        } else {
            setPage((page - 1 + qtdPage) % qtdPage)
        }
    }

    return (
        <div className="genre-container">
            <div className="change-button left" onClick={() => handlePage(false)}></div>
            <div className='carousel-wrapper'>
                <div
                    className='buttons-carousel'
                    style={{ transform: `translateX(-${page * 100}%)` }}
                >
                    {Array.from({ length: qtdPage }, (_, i) => (
                        <div className='buttons-container' key={i}>
                            {genres
                                .slice(i * qtdCards, i * qtdCards + qtdCards)
                                .map((genre) => (
                                    <div className="buttons" key={genre}>
                                        {genre}
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="change-button" onClick={() => handlePage(true)}></div>
        </div>
    )
}
