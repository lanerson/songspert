'use client'

import { useEffect, useState } from "react"
import "../styles/searchBar.css"
import { getSongsByName } from "../scripts/data_fetch"


type searchProps = {
    onClick: (string) => void
}
export default function SearchBar({ onClick }: searchProps) {
    const [searchItems, setSearchItems] = useState([])
    const [searchValue, setSearchValue] = useState("")

    useEffect(() => {
        const timeout = setTimeout(async () => {
            const term = searchValue.trim()
            if (term === "") {
                setSearchItems([])
                return
            }

            const data = await getSongsByName(term)
            setSearchItems(data)
        }, 300)

        return () => clearTimeout(timeout) // limpa timeout anterior
    }, [searchValue])


    return (
        <div className="search-container">
            <div className="input-container">
                <input placeholder="Digite uma música" type="text" onChange={(e) => setSearchValue(e.target.value)} />
                <div className="search-button"></div>
            </div>
            <div>
                <ul className="suggestions-container">
                    {searchItems.map((item) =>
                        <li key={item.id} className="suggestion-item" onClick={() => { onClick(item) }}>
                            <div className="suggestion-content">{item.title}</div>
                            <div className="suggestion-content" style={{ textAlign: "right" }}>{item.artist}</div>
                        </li>)}
                </ul>
            </div>
        </div>

    )
}