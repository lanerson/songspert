import { redirect } from 'next/navigation'
import { getCookies } from '../../../../scripts/cookies'

export default async function ProfileLayout({ children }) {
    const hasAccess = await getCookies()

    if (!hasAccess) {
        redirect('/login')
    }

    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{children}</div>
}

