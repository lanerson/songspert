'use client'
import { useEffect, useState } from 'react';
import '../styles/profile.css'
import { getMyInfo } from '../scripts/auth';
import { deleteCookies } from '../scripts/cookies';
import { userType } from '../models/model';

type ProfileProps = {
    visible: boolean;
}

export default function Profile({ visible }: ProfileProps) {
    const [info, setInfo] = useState<userType>(null)
    const [isAuth, setIsAuth] = useState(false)
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
    useEffect(() => {
        getInfo()
    }, [visible])
    const handleLogout = async (e) => {
        await deleteCookies()
        setInfo(null)
        setIsAuth(false)
    }

    return (
        <div className="profile-container"
            style={{ display: visible ? "flex" : "none" }}>
            {isAuth ? (
                <>
                    <a href="/perfil" className="perfil" style={{ backgroundImage: `url("/images/avatar/${info.profile_picture}.png")` }}>ACESSAR PERFIL</a>
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
                    <div style={{ textAlign: 'justify' }}>
                        Não possui uma conta?<br />
                        Entre ou cadastre-se para salvar seu progresso, criar desafios e muito mais
                    </div>
                    <a href="/login" className="log-button">LOG IN</a>
                    <a href="/register" className="log-button">REGISTER</a>
                </div>
            )}
        </div>
    )
}