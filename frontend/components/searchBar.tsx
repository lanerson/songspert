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

            const data = await getSongsByName(term, 4)
            setSearchItems(data)
        }, 300)

        return () => clearTimeout(timeout)
    }, [searchValue])


    return (
        <div className="search-container">
            <div className="input-container">
                {/* <div className="search-button"></div> */}
                <input placeholder="Digite uma música" type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            </div>
            <div>
                <div className="suggestions-container">
                    {searchItems.map((item) =>
                        <div key={item.id} className="suggestion-item" onClick={() => { setSearchValue(""); onClick(item) }}>
                            <div className="suggestion-content" style={{ fontSize: '.8rem' }}>{(item.title.length > 50) ? item.title.slice(0, 47) + "..." : item.title}</div>
                            <div className="suggestion-content" style={{ textAlign: "right", opacity: .6 }}>{item.artist}</div>
                        </div>)}
                </div>
            </div>
        </div>

    )
}