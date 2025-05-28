import { getCookies, setCookies } from "./cookies"
const base_url = "http://localhost:8000/"


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

export async function getMyInfo() {
    const tokens = await getCookies()
    console.log("tokens", tokens)
    if (tokens !== null) {
        const res = await fetch(base_url + "users/me/", {
            headers: {
                "Authorization": `Bearer ${tokens.access}`
            }
        })
        if (res.status == 401) {
            const { access } = await fetch(base_url + "auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refresh: tokens.refresh })
            }).then(async res => await res.json())
            await setCookies(tokens.refresh, access)
            const data = await fetch(base_url + "users/me/", {
                headers: {
                    "Authorization": `Bearer ${access}`
                }
            })
        }
        const data = await res.json()
        return data
    }
    return null
}