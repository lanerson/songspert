'use client'
import { useEffect, useState } from 'react';
import '../styles/profile.css'
import { getMyInfo } from '../scripts/auth';
import { deleteLocalTokens } from '../scripts/cookies';


type ProfileProps = {
    visible: boolean;
}
type userType = {
    username: string,
    first_name: string,
    last_name: string,
    email: string
}


export default function Profile({ visible }: ProfileProps) {
    const [info, setInfo] = useState<userType>({ username: "", first_name: "", last_name: "", email: "" })
    const [isAuth, setIsAuth] = useState(false)
    useEffect(() => {
        const getInfo = async () => {
            try {
                const res = await getMyInfo()
                if (res === null) {

                    setIsAuth(false)
                }
                else {
                    setInfo(res)
                    setIsAuth(true)
                }
            } catch (err) {
                setIsAuth(false)
            }
        }

        getInfo()
    }, [visible])
    const handleLogout = (e) => {
        deleteLocalTokens()
        setInfo({ username: "", first_name: "", last_name: "", email: "" })
        setIsAuth(false)
    }

    return (
        <div className="profile-container"
            style={{ display: visible ? "flex" : "none" }}>
            {isAuth ? (
                <>
                    <div className="perfil"></div>
                    <div className="info-container">
                        <div className="info-item">{info.username}</div>
                        <div className="info-item">{info.first_name}</div>
                        <div className="info-item">{info.last_name}</div>
                        <div className="info-item">{info.email}</div>
                    </div>
                    <div className='log-button' onClick={handleLogout}>LOG OUT</div>

                </>
            ) : (
                <div className="login-container">
                    <div>
                        Não possui uma conta? Entre ou cadastre-se para salvar seu progresso, criar desafios e muito mais
                    </div>
                    <a href="/login" className="log-button">LOG IN</a>
                    <a href="/register" className="log-button">REGISTER</a>
                </div>
            )}
        </div>
    )
}