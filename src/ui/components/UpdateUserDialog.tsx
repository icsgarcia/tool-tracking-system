import {
    useEffect,
    useState,
    type ChangeEvent,
    type Dispatch,
    type FormEvent,
    type SetStateAction,
} from "react";
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
import { useUpdateUser } from "@/hooks/useUsers";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    Select,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface UpdateUserDialogProps {
    openUpdateUser: boolean;
    setOpenUpdateUser: Dispatch<SetStateAction<boolean>>;
    user: User;
}

const UpdateUserDialog = ({
    openUpdateUser,
    setOpenUpdateUser,
    user,
}: UpdateUserDialogProps) => {
    const updateUser = useUpdateUser();
    const [updateUserData, setUpdateUserData] = useState<User>(user);

    useEffect(() => {
        setUpdateUserData(user);
    }, [user]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setUpdateUserData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleUpdateUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateUser.mutate(updateUserData, {
            onSuccess: () => {
                setOpenUpdateUser(false);
            },
            onError: () => {
                setUpdateUserData(user);
            },
        });
    };
    return (
        <Dialog open={openUpdateUser} onOpenChange={setOpenUpdateUser}>
            <DialogContent className="max-w-lg w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                    <DialogTitle className="text-base sm:text-lg">
                        Update User
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Edit the user details below and click "Update User" to
                        save changes.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6 sm:pb-6">
                    <form onSubmit={handleUpdateUser}>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="schoolNumber">
                                        School Number
                                    </FieldLabel>
                                    <Input
                                        id="schoolNumber"
                                        name="schoolNumber"
                                        value={updateUserData?.schoolNumber}
                                        onChange={handleOnChange}
                                    />
                                </Field>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <Field>
                                        <FieldLabel htmlFor="firstName">
                                            First Name
                                        </FieldLabel>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={updateUserData?.firstName}
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="middleName">
                                            Middle Name
                                        </FieldLabel>
                                        <Input
                                            id="middleName"
                                            name="middleName"
                                            value={updateUserData?.middleName}
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="lastName">
                                            Last Name
                                        </FieldLabel>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={updateUserData?.lastName}
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel htmlFor="role">
                                            Role
                                        </FieldLabel>
                                        <Select
                                            value={updateUserData.role}
                                            onValueChange={(value) =>
                                                setUpdateUserData((prev) => ({
                                                    ...prev,
                                                    role: value as Role,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="ADMIN">
                                                        ADMIN
                                                    </SelectItem>
                                                    <SelectItem value="STAFF">
                                                        STAFF
                                                    </SelectItem>
                                                    <SelectItem value="STUDENT">
                                                        STUDENT
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="department">
                                            Department
                                        </FieldLabel>
                                        <Select
                                            value={updateUserData.department}
                                            onValueChange={(value) =>
                                                setUpdateUserData((prev) => ({
                                                    ...prev,
                                                    department: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="AMT">
                                                        AMT
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="yearLevel">
                                        Year Level
                                    </FieldLabel>
                                    <Input
                                        id="yearLevel"
                                        name="yearLevel"
                                        type="number"
                                        min={0}
                                        max={5}
                                        value={updateUserData?.yearLevel}
                                        onChange={handleOnChange}
                                    />
                                </Field>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field>
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="email"
                                            name="email"
                                            value={updateUserData?.email}
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="number">
                                            Phone Number
                                        </FieldLabel>
                                        <Input
                                            id="number"
                                            name="number"
                                            value={updateUserData?.number}
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                </div>
                            </FieldGroup>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button>Cancel</Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={updateUser.isPending}
                                >
                                    {updateUser.isPending
                                        ? "Updating..."
                                        : "Update User"}
                                </Button>
                            </DialogFooter>
                        </FieldSet>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateUserDialog;
