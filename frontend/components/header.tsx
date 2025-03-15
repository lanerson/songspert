import "../styles/header.css";
import SideBar from "./sideBar";
type HeaderProps = {
    toggleVisible: () => void;
}

export default function Header({ toggleVisible }: HeaderProps) {
    return (
        <header>
            <a href="/" className="homeOptions">HOME</a>
            <a href="/games" className="homeOptions">GAMES</a>
            <a href="/ranking" className="homeOptions">RANKING</a>
            <a href="/about" className="homeOptions">ABOUT US</a>
            <SideBar click={toggleVisible} />
        </header>
    );
}
