"use server"
import { getCookies, setCookies } from "./cookies"
const base_url = "http://backend:8000/"


export async function LogInWithUsernameAndPassword(username, password) {
    try {
        const res = await fetch(base_url + "auth/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username, password: password })
        }
        )
        if (!res.ok) {
            const text = await res.text()
            alert("erro no login: " + text)
        }
        else {
            const { refresh, access } = await res.json()
            await setCookies(refresh, access)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function Register(newUser) {
    try {
        const res = await fetch(base_url + "users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser)
        })
        if (!res.ok) {
            const text = await res.text()
            alert("erro no registro: " + text)
        }
        else {
            await LogInWithUsernameAndPassword(newUser.username, newUser.password)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function refreshAccessCookie() {
    const tokens = await getCookies()
    const res = await fetch(base_url + "auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refresh: tokens.refresh })
    })
    const { access } = await res.json()
    return access
}

export async function getMyInfo() {
    const access = await refreshAccessCookie()
    if (access) {
        let data = await fetch(base_url + "users/me/", {
            headers: {
                "Authorization": `Bearer ${access}`
            }
        }).then(async res => await res.json())
        return data
    }
    return null
}