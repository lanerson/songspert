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
            body: JSON.stringify({ username, password })
        })

        if (!res.ok) {
            const text = await res.text()
            throw new Error("Erro no login: " + text)
        }

        const { refresh, access } = await res.json()
        await setCookies(refresh, access)
    } catch (error) {
        console.error("LogInWithUsernameAndPassword:", error)
        throw error
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
            throw new Error("Erro no registro: " + text)
        }

        await LogInWithUsernameAndPassword(newUser.username, newUser.password)
    } catch (error) {
        console.error("Register:", error)
        throw error
    }
}

export async function refreshAccessCookie() {
    try {
        const tokens = await getCookies()
        if (!tokens?.refresh) {
            console.error("Nenhum token de refresh encontrado")
            return null
        }

        const res = await fetch(base_url + "auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refresh: tokens.refresh })
        })

        if (!res.ok) {
            const text = await res.text()
            console.error("Erro ao atualizar token:", text)
            return null
        }

        const { access } = await res.json()
        await setCookies(tokens.refresh, access)
        return access
    } catch (error) {
        console.error("refreshAccessCookie:", error)
        return null
    }
}

export async function getMyInfo() {
    try {
        const access = await refreshAccessCookie()
        if (!access) {
            console.log("Não foi possível obter novo token de acesso")
            return null
        }

        const res = await fetch(base_url + "users/me/", {
            headers: {
                "Authorization": `Bearer ${access}`
            }
        })

        if (!res.ok) {
            const text = await res.text()
            console.error("Erro ao obter informações do usuário:", text)
            return null
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error("getMyInfo:", error)
        return null
    }
}
