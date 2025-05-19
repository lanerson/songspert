'use client'
import { useEffect, useState } from 'react';
import '../styles/profile.css'
import { getMyInfo } from '../scripts/data_fetch';

type ProfileProps = {
    visible: boolean;
}
type userType = {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    email: string
}


export default function Profile({ visible }: ProfileProps) {
    const [info, setInfo] = useState({ username: "", first_name: "", last_name: "", email: "" })
    useEffect(() => {
        const getInfo = async () => await getMyInfo().then((res) => setInfo(res))
        getInfo()

    }, [visible])

    return (
        <div className="profile-container"
            style={{ display: visible ? "flex" : "none" }}>
            <div className="perfil">

            </div>
            <div className="info-container">
                <div className="info-item">{info.username}</div>
                <div className="info-item">{info.first_name}</div>
                <div className="info-item">{info.last_name}</div>
                <div className="info-item">{info.email}</div>
            </div>
            <div className='logout'>LOG OUT</div>
        </div>
    )
}