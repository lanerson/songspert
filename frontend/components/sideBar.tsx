import '../styles/sideBar.css'
type SideBarProps = {
    click: () => void;
}
export default function SideBar({ click }: SideBarProps) {
    return (
        <a className="bar-container" onClick={click}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
        </a>
    )
}