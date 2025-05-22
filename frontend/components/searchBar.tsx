import "../styles/searchBar.css"

type searchProps = {
    onClick: () => void
}

export default function SearchBar({ onClick }: searchProps) {
    return (
        <div className="search-container"><input type="text" /><div className="search-button" onClick={onClick}></div></div>
    )
}