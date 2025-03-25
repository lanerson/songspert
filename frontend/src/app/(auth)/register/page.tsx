'use client'
import '../styles.css'
export default function register() {
    const handleClick = () => {
        alert("clicou")
    }
    return (
        <div className="container">
            <div className='form-container'>
                <div>NICKNAME</div>
                <input></input>
                <div>EMAIL</div>
                <input></input>
                <div>PASSWORD</div>
                <input></input>
                <div className="button-container">
                    <div className="button" onClick={handleClick}>REGISTER</div>
                </div>
            </div>
        </div>
    )
}