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
import { ScrollArea } from "./ui/scroll-area";
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
            <DialogContent>
                <form onSubmit={handleUpdateUser}>
                    <DialogHeader>
                        <DialogTitle>Update User</DialogTitle>
                        <DialogDescription>
                            Edit the user details below and click "Update User"
                            to save changes.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className=" h-100 rounded-md border">
                        <div>
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
                                            Number
                                        </FieldLabel>
                                        <Input
                                            id="number"
                                            name="number"
                                            value={updateUserData?.number}
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={updateUser.isPending}>
                            {updateUser.isPending
                                ? "Updating..."
                                : "Update User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateUserDialog;
