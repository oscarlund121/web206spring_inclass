import Link from "next/link";

export function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <img
                        src="https://bulma.io/images/bulma-logo.png"
                        alt="Bulma logo"
                    />
                </a>
            </div>
            <div className="navbar__links">
                <Link href="/">Home</Link>
                <Link href="/products">Products</Link>
            </div>
        </nav>
    );
}