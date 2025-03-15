import '../styles/profile.css'

type ProfileProps = {
    visible: boolean;
}
export default function Profile({ visible }: ProfileProps) {

    return (
        <div className="profile-container"
            style={{ display: visible ? "flex" : "none" }}>
            <div className="perfil">

            </div>
            <div className="info-container">
                <div className="info-item"></div>
                <div className="info-item"></div>
                <div className="info-item"></div>
                <div className="info-item"></div>
            </div>
            <div className='logout'>LOG OUT</div>
        </div>
    )
}