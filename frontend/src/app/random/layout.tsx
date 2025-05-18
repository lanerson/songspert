import './random.css'
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="challenge-container">
            <main>{children}</main>
        </div>
    );
}