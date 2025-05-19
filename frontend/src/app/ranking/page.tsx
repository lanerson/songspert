import "./ranking.css"
const frequency = ["DAILY", "WEEKLY", "MONTHLY", "ANNUALY", "ALL TIME"]
export default function Ranking() {
    return (
        <div className="ranking-container">
            <div className="frequency-container">
                <div className="frequency-button">{frequency[0]}</div>
                <div className="frequency-button">{frequency[1]}</div>
                <div className="frequency-button">{frequency[2]}</div>
                <div className="frequency-button">{frequency[3]}</div>
                <div className="frequency-button">{frequency[4]}</div>
            </div>
            <ul className="list-container">
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
                <li className="list-item"><div className="user-image"></div><div className="user-content">teste</div></li>
            </ul>
        </div>
    )
}