import { getLocalTokens, setLocalTokens } from "./cookies"

const base_url = "http://localhost:8000/"


export async function LogInWithUsernameAndPassword(username, password) {
    console.log("username=" + username)
    console.log("password=" + password)
    const res = await fetch(base_url + "auth/token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password })
    }
    )

    if (!res.ok) alert("Login ou senha inválidos")

    const { refresh, access } = await res.json()

    setLocalTokens(refresh, access)

}

export async function getMyInfo() {
    const tokens = getLocalTokens()
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
            setLocalTokens(tokens.refresh, access)
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