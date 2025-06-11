"use client"
import { useEffect, useState } from "react"
import "./ranking.css"
import { getUsers } from "../../../scripts/data_fetch"
import { userType } from "../../../models/model"
const frequencyData = ["DAILY", "WEEKLY", "MONTHLY", "RANDOM"]//, "ANNUALY", "ALL TIME"]


export default function Ranking() {
    const [users, setUsers] = useState<userType[]>([])
    const [frequency, setFrequency] = useState(frequencyData[0])

    useEffect(() => {
        getData()

    }, [frequency])

    const getData = async () => {
        const newData = await getUsers()
        setUsers(newData)
    }
    function handleFrequency(e) {
        setFrequency(e.target.id)
    }

    return (
        <div className="ranking-container">
            <div className="frequency-container">
                {frequencyData.map((item) =>
                    <label key={item} className={`frequency-button ${frequency === item ? 'selected' : ''}`}>
                        <input type="radio" checked={frequency === item} onChange={(e) => handleFrequency(e)} id={item} />
                        {item}
                    </label>
                )}
            </div>
            <ul className="list-container">
                {users.sort((a, b) => b[`${frequency.toLowerCase()}_points`] - a[`${frequency.toLowerCase()}_points`])
                    .map(user =>
                        <li className="list-item" key={user.id}>
                            <div className="user-image"
                                style={{ backgroundImage: `url("/images/avatar/${user.profile_picture}.png")` }}
                            ></div>
                            <div className="user-content">
                                <div>{user.username}</div>
                                <div>{`${user.first_name} ${user.last_name}`}</div>
                                <div style={{ textAlign: 'right', marginRight: '20%' }}>{user[`${frequency.toLowerCase()}_points`]}</div>
                            </div>
                        </li>)}
            </ul>
        </div>
    )
}