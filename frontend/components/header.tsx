'use client'
import { useState } from "react";
import "../styles/header.css";
import SideBar from "./sideBar";
import Profile from "./profile";
type HeaderProps = {
    toggleVisible: () => void;
}

export default function Header() {
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => setVisible(!visible);
    return (
        <header>
            <a href="/" className="homeOptions">HOME</a>
            <a href="/search" className="homeOptions">SEARCH</a>
            <a href="/ranking" className="homeOptions">RANKING</a>
            <a href="/random" className="homeOptions">RANDOM GAME</a>
            <SideBar click={toggleVisible} />
            <Profile visible={visible} />
        </header>
    );
}
