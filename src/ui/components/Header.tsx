import NavUser from "./NavUser";
import { Separator } from "./ui/separator";

interface HeaderProps {
    user: User;
    handleLogout: () => void;
}

const Header = ({ user, handleLogout }: HeaderProps) => {
    return (
        <header className="bg-primary py-2 px-3 sm:py-3 sm:px-4 shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <img
                        src="./toolkeeper-logos/logo3.png"
                        alt="tool-keeper-logo"
                        className="h-8 sm:h-10 w-auto shrink-0 rounded"
                    />
                    <Separator
                        orientation="vertical"
                        className="hidden sm:block h-6 bg-white/20"
                    />
                    <span className="hidden sm:block text-sm font-medium text-primary-foreground/80">
                        Tool Keeper
                    </span>
                </div>
                <NavUser user={user} onLogout={handleLogout} />
            </div>
        </header>
    );
};

export default Header;
