'use client'
import './search.css'
import { useEffect, useState } from 'react'
import { getGenres } from '../../../scripts/data_client';
import ChallengesByGenre from '../../../components/challengesByGenre';
import { getChallenges } from '../../../scripts/data_fetch';

export default function Search() {
    const [page, setPage] = useState(0);
    const [visible, setVisible] = useState<boolean>(false)
    const [selectedGenre, setSelectedGenre] = useState("")
    const [challenges, setChallenges] = useState([])
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

    const getAllChallenges = async () => await getChallenges()
        .then(res => { setChallenges(res); console.log(res) })
    useEffect(() => {
        getAllChallenges()
    }, [])
    const getChallengesByGenre = (genre: string) => {
        return challenges.filter(challenge => challenge.genre === genre)
    }
    return (
        <div className="genre-container">
            <ChallengesByGenre visible={visible} challenges={getChallengesByGenre(selectedGenre)} onClick={() => setVisible(false)} />
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
                                    <div className="buttons" key={genre}
                                        onClick={() => { setSelectedGenre(genre); setVisible(true) }}
                                    >
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
