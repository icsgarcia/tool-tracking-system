import NavUser from "./NavUser";
import { Separator } from "./ui/separator";

interface HeaderProps {
    user: User;
    handleLogout: () => void;
}

const Header = ({ user, handleLogout }: HeaderProps) => {
    return (
        <>
            <header className="py-3 px-4">
                <div className="mx-auto flex max-w-7xl justify-between items-center">
                    <img src="/logo3.png" alt="tool-keeper-logo" width={100} />
                    <NavUser user={user} onLogout={handleLogout} />
                </div>
            </header>
            <Separator />
        </>
    );
};

export default Header;
