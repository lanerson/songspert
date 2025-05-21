// "use server"
// import { cookies } from "next/headers"

// export async function setCookies(refresh, access) {


//     const cookieStore = await cookies()
//     cookieStore.set("access", access)
//     cookieStore.set("refresh", refresh)

//     return new Response(JSON.stringify({ success: true }), { status: 200 })
// }

export function getLocalTokens() {
    const token = localStorage.getItem("token")
    return JSON.parse(token)
}

export function setLocalTokens(refresh, access) {
    localStorage.setItem("token", JSON.stringify({ refresh: refresh, access: access }))
}

export function deleteLocalTokens() {
    localStorage.removeItem("token")
}