import "../styles.css"
export default function Profile() {
    return (
        <div>
            <div>
                <div>
                    Played Challenges
                </div>
                <ul>
                    <li>
                        <div>
                            Challenge Name
                        </div>
                        <div>
                            Points Obtained / Total Points
                        </div>
                    </li>
                </ul>
            </div>
            <div>My Challenges</div>
            <a href="/profile/create">Create a New Challenge</a>
        </div>
    )
}