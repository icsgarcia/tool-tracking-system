import { ChevronsUpDown, LogOut, UserCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ProfileDialog from "./ProfileDialog";

interface NavUserType {
    user: User;
    onLogout: () => void;
}

const NavUser = ({ user, onLogout }: NavUserType) => {
    const [openProfileDialog, setOpenProfileDialog] = useState(false);

    const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;
    const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-lg p-1 max-w-55 sm:max-w-70 hover:bg-white/15 text-primary-foreground outline-none transition-colors">
                        <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                            <AvatarFallback className="rounded-lg bg-white/20 text-primary-foreground">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:grid flex-1 min-w-0 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {fullName}
                            </span>
                            <span className="truncate text-xs text-white/70">
                                {user.email}
                            </span>
                        </div>
                        <ChevronsUpDown className="ml-auto hidden sm:block size-4 shrink-0" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                                <AvatarFallback className="rounded-lg">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 min-w-0 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {fullName}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => setOpenProfileDialog(true)}
                            className="cursor-pointer"
                        >
                            <UserCircle className="w-4 h-4" />
                            Profile
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={onLogout}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        <LogOut className="w-4 h-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ProfileDialog
                user={user}
                openProfileDialog={openProfileDialog}
                setOpenProfileDialog={setOpenProfileDialog}
            />
        </>
    );
};

export default NavUser;
