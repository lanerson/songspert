'use client'

import { useState } from 'react'
import '../styles.css'
import { LogInWithUsernameAndPassword } from '../../../../scripts/auth'
import { useRouter } from 'next/navigation'

export default function Login() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleClick = async (e) => {
        e.preventDefault()

        await LogInWithUsernameAndPassword(login, password)
            .then(() => router.replace("/"))
    }

    return (
        <div className="container">
            <form className='form-container' onSubmit={async (e) => handleClick(e)}>
                <div>EMAIL OR NICKNAME</div>
                <input name="login" type="text" value={login} onChange={(e) => setLogin(e.target.value)} required></input>
                <div>PASSWORD</div>
                <input name="password" type='password' value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                <a className="link-register" href="/forgot-password">Forgot Password?</a>
                <div className="button-container">
                    <button className="button" type="submit">LOG IN</button>
                    <a href="/register">
                        <div className="button">REGISTER</div>
                    </a>
                </div>
            </form>
        </div>
    )
}