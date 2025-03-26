'use client'
import { useEffect, useState } from 'react'
import './categories.css'

export default function Categories() {

    const [content, setContent] = useState<string>('oi')
    const textos: string[] = ['3', '2', '1', '0']
    useEffect(() => {
        for (let index = 0; index < textos.length; index++) {
            clearInterval
            setTimeout(() => setContent(textos[index]), 2000)
        }
    })

    return (
        <div className='container'>
            <div className="ranking-container">
                <div className='buttons-container'>
                    <div className="buttons">{content}</div>
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