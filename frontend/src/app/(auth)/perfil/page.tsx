"use client"
import { useEffect, useState } from "react"
import "./perfil.css"
import { userType } from "../../../../models/model"
import { getMyInfo } from "../../../../scripts/auth"
import ImageCard from "../../../../components/imageCard"
const frequencyData = ["DAILY", "WEEKLY", "MONTHLY"]//, "ANNUALY", "ALL TIME"]

export default function Perfil() {
    const [perfil, setPerfil] = useState<userType | null>({
        id: 0,
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        daily_points: 0,
        weekly_points: 0,
        monthly_points: 0,
        profile_picture: ""
    })
    const [visible, setVisible] = useState(false)

    const getInfo = async () => await getMyInfo().then(data => setPerfil(data))
    useEffect(() => {
        getInfo()
    }, [])

    const handleAvatar = (avatar) => {
        setVisible(!visible)
        if (avatar !== "" && avatar !== perfil.profile_picture) {
            setPerfil({ ...perfil, profile_picture: avatar })
        }
    }
    return (
        <div className="perfil-container">
            <ImageCard visible={visible} onClick={handleAvatar} />
            <div className="perfil-image" onClick={() => setVisible(true)}
                style={{ backgroundImage: `url("/images/avatar/${perfil.profile_picture}.png")` }}>CHANGE PHOTO</div>
            <div className="perfil-info">{perfil.username}</div>
            <div className="perfil-info">{`${perfil.first_name} ${perfil.last_name}`}</div>
            <div className="perfil-info">{perfil.email}</div>
            <div className="perfil-statistic">
                <div>{ }<br />Played</div>
                <div>{ }<br />Created</div>
            </div>
            <div className="perfil-statistic">
                {frequencyData.map(frequency =>
                    <div key={frequency}>{perfil[`${frequency.toLowerCase()}_points`]}<br />{frequency}</div>
                )}
            </div>
            <div className="button-grid">
                <a className="perfil-button" href="/perfil/myChallenges">My Challenges</a>
                <a className="perfil-button">Edit Profile</a>
                <a className="perfil-button" href="/perfil/create">Create Challenge</a>
                <div className="perfil-button">Log Out</div>
            </div>
        </div>
    )
}