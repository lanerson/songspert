"use server"
import { cookies } from "next/headers"

const base_url = "http://localhost:8000/"

export async function setCookies(refresh, access) {
    const cookieStore = await cookies()
    cookieStore.set("token", JSON.stringify({ refresh: refresh, access: access }))
}


export async function getCookies() {
    const cookieStore = await cookies()
    if (cookieStore.has("token")) {
        return JSON.parse(cookieStore.get("token").value)
    }
    return null
}


export async function deleteCookies() {
    const cookieStore = await cookies()
    cookieStore.delete("access")
    cookieStore.delete("refresh")
}