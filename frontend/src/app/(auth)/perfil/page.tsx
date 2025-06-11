"use client"
import { useEffect, useState } from "react"
import "./perfil.css"
import { userType } from "../../../../models/model"
import { getMyInfo, Update } from "../../../../scripts/auth"
import ImageCard from "../../../../components/imageCard"
import { deleteCookies } from "../../../../scripts/cookies"
import { useRouter } from "next/navigation"

const frequencyData = ["DAILY", "WEEKLY", "MONTHLY", "CHALLENGE", "RANDOM"]

export default function Perfil() {
    const [password, setPassword] = useState('')
    const [perfil, setPerfil] = useState<userType | null>({
        id: 0,
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        daily_points: 0,
        weekly_points: 0,
        monthly_points: 0,
        random_points: 0,
        profile_picture: ""
    })
    const [visible, setVisible] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()

    const getInfo = async () => {
        const data = await getMyInfo()
        setPerfil(data)
    }

    useEffect(() => {
        getInfo()
    }, [])

    const handleAvatar = (avatar: string) => {
        setVisible(!visible)
        if (avatar !== "" && avatar !== perfil?.profile_picture) {
            setPerfil({ ...perfil!, profile_picture: avatar })
        }
    }

    const handleLogout = async () => {
        await deleteCookies()
        router.replace("/")
    }

    const toggleEdit = async () => {
        if (isEditing) {
            let data = {
                username: perfil.username,
                email: perfil.email,
                password: password,
                first_name: perfil.first_name,
                last_name: perfil.last_name,
                daily_points: perfil.daily_points,
                weekly_points: perfil.weekly_points,
                monthly_points: perfil.monthly_points,
                profile_picture: perfil.profile_picture
            }
            await Update(perfil.id, data)
                .catch(error => alert(error.message))
        }
        setIsEditing(!isEditing)
    }

    return (
        <div className="perfil-container">
            <ImageCard visible={visible && isEditing} onClick={handleAvatar} />
            <div
                className={`perfil-image ${(isEditing) ? "update" : ""}`}
                onClick={() => setVisible(true)}
                style={{ backgroundImage: `url("/images/avatar/${perfil?.profile_picture}.png")` }}
            >
                CHANGE PHOTO
            </div>

            {isEditing ? (
                <>
                    <input
                        className="perfil-input"
                        value={perfil?.username}
                        onChange={(e) => setPerfil({ ...perfil!, username: e.target.value })}
                    />
                    <input
                        className="perfil-input"
                        value={perfil?.first_name}
                        onChange={(e) => setPerfil({ ...perfil!, first_name: e.target.value })}
                    />
                    <input
                        className="perfil-input"
                        value={perfil?.last_name}
                        onChange={(e) => setPerfil({ ...perfil!, last_name: e.target.value })}
                    />
                    <input
                        className="perfil-input"
                        value={perfil?.email}
                        onChange={(e) => setPerfil({ ...perfil!, email: e.target.value })}
                    />
                    <input
                        className="perfil-input" type="password" placeholder="Digite seu password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </>
            ) : (
                <>
                    <div className="perfil-info">{perfil?.username}</div>
                    <div className="perfil-info">{`${perfil?.first_name} ${perfil?.last_name}`}</div>
                    <div className="perfil-info">{perfil?.email}</div>
                </>
            )}

            <div className="perfil-statistic">
                <div><br />Played</div>
                <div><br />Created</div>
            </div>

            <div className="perfil-statistic">
                {frequencyData.map(frequency => (
                    <div key={frequency}>
                        {perfil?.[`${frequency.toLowerCase()}_points` as keyof userType]}<br />
                        {(frequency == "CHALLENGE") ? "TOTAL" : frequency}
                    </div>
                ))}
            </div>

            <div className="button-grid">
                {/* <div className="perfil-button" onClick={() => router.replace("/perfil/myChallenges")}>
                    My Challenges
                </div> */}
                <div className="perfil-button" onClick={toggleEdit}>
                    {isEditing ? "Save Changes" : "Edit Profile"}
                </div>
                <div className="perfil-button" onClick={() => router.replace("/perfil/create")}>
                    Create Challenge
                </div>
                <div className="perfil-button last" onClick={handleLogout}>
                    Log Out
                </div>
            </div>
        </div>
    )
}
