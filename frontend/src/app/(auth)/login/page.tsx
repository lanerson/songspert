'use client'
import '../styles.css'
export default function Login() {
    const handleClick = () => {
        alert("clicou")
    }

    return (
        <div className="container">
            <div className='form-container'>
                <div>EMAIL OR NICKNAME</div>
                <input></input>
                <div>PASSWORD</div>
                <input></input>
                <a className="link-register" href="/forgot-password">Forgot Password?</a>
                <div className="button-container">
                    <div className="button" onClick={handleClick}>LOG IN</div>
                    <a href="/register">
                        <div className="button">REGISTER</div>
                    </a>
                </div>
            </div>
        </div>
    )
}