"use client"
import { useEffect, useState } from "react"
import "./ranking.css"
import { getUsers } from "../../../scripts/data_fetch"
import { userType } from "../../../models/model"
const frequencyData = ["DAILY", "WEEKLY", "MONTHLY", "ANNUALY", "ALL TIME"]


export default function Ranking() {
    const [users, setUsers] = useState<userType[]>([])
    const [frequency, setFrequency] = useState()

    useEffect(() => {
        const newData = getData()

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
                <div className="frequency-button" onClick={(e) => handleFrequency(e)} id={frequencyData[0]}>{frequencyData[0]}</div>
                <div className="frequency-button" onClick={(e) => handleFrequency(e)} id={frequencyData[1]}>{frequencyData[1]}</div>
                <div className="frequency-button" onClick={(e) => handleFrequency(e)} id={frequencyData[2]}>{frequencyData[2]}</div>
                <div className="frequency-button" onClick={(e) => handleFrequency(e)} id={frequencyData[3]}>{frequencyData[3]}</div>
                <div className="frequency-button" onClick={(e) => handleFrequency(e)} id={frequencyData[4]}>{frequencyData[4]}</div>
            </div>
            <ul className="list-container">
                {users.map(user =>
                    <li className="list-item" key={user.id}>
                        <div className="user-image"></div>
                        <div className="user-content">
                            <div>{user.username}</div>
                            <div>{user.first_name}</div>
                            <div>{user.last_name}</div>
                        </div>
                    </li>)}
            </ul>
        </div>
    )
}