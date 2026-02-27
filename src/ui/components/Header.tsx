import NavUser from "./NavUser";
import { Separator } from "./ui/separator";

interface HeaderProps {
    user: User;
    handleLogout: () => void;
}

const Header = ({ user, handleLogout }: HeaderProps) => {
    return (
        <>
            <header className="py-2 px-3 sm:py-3 sm:px-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <img
                        src="/logo3.png"
                        alt="tool-keeper-logo"
                        className="h-8 sm:h-10 w-auto shrink-0"
                    />
                    <NavUser user={user} onLogout={handleLogout} />
                </div>
            </header>
            <Separator />
        </>
    );
};

export default Header;
