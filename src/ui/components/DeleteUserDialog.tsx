import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { useDeleteUser } from "@/hooks/useUsers";

interface DeleteUserDialogProps {
    openDeleteUser: boolean;
    setOpenDeleteUser: Dispatch<SetStateAction<boolean>>;
    user: User;
}

const DeleteUserDialog = ({
    openDeleteUser,
    setOpenDeleteUser,
    user,
}: DeleteUserDialogProps) => {
    const deleteUser = useDeleteUser();

    const handleDeleteUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        deleteUser.mutate(user.id, {
            onSuccess: () => setOpenDeleteUser(false),
        });
    };
    return (
        <Dialog open={openDeleteUser} onOpenChange={setOpenDeleteUser}>
            <DialogContent>
                <form onSubmit={handleDeleteUser}>
                    <DialogHeader>
                        <DialogTitle>Confirm User Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user? This
                            action cannot be undone and will permanently remove
                            the user and all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <p>
                            <span className="font-bold">School Number:</span>{" "}
                            {user.schoolNumber}
                        </p>
                        <p>
                            <span className="font-bold">Name:</span>{" "}
                            {user.firstName} {user.middleName} {user.lastName}
                        </p>
                        <p>
                            <span className="font-bold">Role:</span> {user.role}
                        </p>
                        <p>
                            <span className="font-bold">Email:</span>{" "}
                            {user.email}
                        </p>
                        <p>
                            <span className="font-bold">Number:</span>{" "}
                            {user.number}
                        </p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={deleteUser.isPending}>
                            {deleteUser.isPending
                                ? "Deleting..."
                                : "Delete User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteUserDialog;
