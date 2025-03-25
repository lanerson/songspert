import './auth.css'
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="auth-layout">
            <main>{children}</main>
        </div>
    );
}