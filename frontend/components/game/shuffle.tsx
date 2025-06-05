'use client'
import { useEffect, useState } from "react";

export default function Shuffle(answer: string) {
    const [shuffledArray, setShuffledArray] = useState([])
    const [qtdSpaces, setQtdSpaces] = useState(0)

    const getQtdSpaces = (answer) => setQtdSpaces(answer.split(" ").length - 1)

    // Embaralha as letras
    function shuffleArray<T>(array: T[]): T[] {
        const arr = [...array]; // copia para não modificar o original
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // troca
        }
        return arr;
    }

    useEffect(() => {
        getQtdSpaces(answer)
        setShuffledArray(shuffleArray(answer.split(' ').join("").split("")))
    })
    return (
        <div>
            <div className="answer-model"></div>
            <div className="answer-container">
                {shuffledArray.map((letter) => <div className="answer-content">{letter}</div>)}
            </div>
        </div>
    )
}