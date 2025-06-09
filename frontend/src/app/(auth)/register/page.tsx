'use client'

import { useState } from 'react'
import '../styles.css'
import './register.css'
import { Register } from '../../../../scripts/auth'
import { useRouter } from 'next/navigation'
import ImageCard from '../../../../components/imageCard'

const avatars = ['bear', 'chicken', 'dinosaur', 'dog', 'gorilla', 'meerkat', 'panda', 'rabbit']

export default function register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [avatar, setAvatar] = useState("")
    const [visible, setVisible] = useState(false)

    const router = useRouter()
    const handleClick = async (e) => {
        e.preventDefault()
        await Register({ username, email, password, first_name, last_name, profile_picture: avatar })
        router.replace("/")
    }

    const handleAvatar = (avatar) => {
        console.log("avatar: ", avatar)
        if (avatar === "") {
            setVisible(false)
        } else {
            setAvatar(avatar)
        }
    }

    return (
        <div className="container">
            <ImageCard visible={visible} onClick={handleAvatar} />
            <form className='form-container' onSubmit={handleClick}>
                <div className='avatar' onClick={() => setVisible(!visible)}
                    style={{ backgroundImage: `url("/images/avatar/${avatar}.png")` }}
                ></div>
                <div>NICKNAME</div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <div>EMAIL</div>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <div>PASSWORD</div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <div>FIRST NAME</div>
                <input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)}></input>
                <div>LAST NAME</div>
                <input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)}></input>
                <button className="button" type="submit">REGISTER</button>
            </form>
        </div>
    )
}