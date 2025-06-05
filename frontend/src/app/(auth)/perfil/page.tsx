"use client"
import { useState } from "react"
import "./perfil.css"
import { userType } from "../../../../models/model"
const frequencyData = ["DAILY", "WEEKLY", "MONTHLY"]//, "ANNUALY", "ALL TIME"]

export default function Perfil() {
    const [perfil, setPerfil] = useState<userType | null>({
        "id": 0,
        "username": "oSUJ3MBbabToqvqFEj",
        "first_name": "first_name",
        "last_name": "last_name",
        "email": "user@example.com",
        "daily_points": 92,
        "weekly_points": 108,
        "monthly_points": 240,
        "profile_picture": "string"
    })
    return (
        <div className="perfil-container">

            <div className="perfil-image">CHANGE PHOTO</div>
            <div className="perfil-info">{perfil.username}</div>
            <div className="perfil-info">{`${perfil.first_name} ${perfil.last_name}`}</div>
            <div className="perfil-info">{perfil.email}</div>
            <div className="perfil-statistic">
                <div>{ }<br />Played</div>
                <div>{ }<br />Created</div>
            </div>
            <div className="perfil-statistic">
                {frequencyData.map(frequency =>
                    <div>{perfil[`${frequency.toLowerCase()}_points`]}<br />{frequency}</div>
                )}
            </div>
            <div className="button-grid">
                <a className="perfil-button" href="/perfil/myChallenges">My Challenges</a>
                <a className="perfil-button">Edit Profile</a>
                <a className="perfil-button" href="/perfil/create">Create Challenge</a>
                <a className="perfil-button">Log Out</a>
            </div>
        </div>
    )
}