import {
    useState,
    useRef,
    type Dispatch,
    type SetStateAction,
    type FormEvent,
    type ChangeEvent,
} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldSet,
} from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useCreateUser, useCreateUserByFile } from "@/hooks/useUsers";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface CreateUsersDialogType {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
}

const CreateUsersDialog = ({ open, onOpenChange }: CreateUsersDialogType) => {
    const [userData, setUserData] = useState<CreateUserDto>({
        schoolNumber: "",
        firstName: "",
        middleName: "",
        lastName: "",
        role: "",
        department: "",
        yearLevel: 0,
        email: "",
        number: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createUser = useCreateUser();
    const createUserByFile = useCreateUserByFile();

    const resetForm = () => {
        setUserData({
            schoolNumber: "",
            firstName: "",
            middleName: "",
            lastName: "",
            role: "",
            department: "",
            yearLevel: 0,
            email: "",
            number: undefined,
        });
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setUserData({
                schoolNumber: "",
                firstName: "",
                middleName: "",
                lastName: "",
                role: "",
                department: "",
                yearLevel: 0,
                email: "",
                number: "",
            });
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
        onOpenChange(isOpen);
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
        setFile(null);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (file) {
            createUserByFile.mutate(file, {
                onSuccess: () => resetForm(),
                onError: () => resetForm(),
            });
        } else if (userData) {
            createUser.mutate(userData, {
                onSuccess: () => resetForm(),
                onError: () => resetForm(),
            });
        }
    };
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>Lorem, ipsum dolor.</DialogDescription>
                </DialogHeader>
                <ScrollArea className=" h-100 rounded-md border">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <FieldSet>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="schoolNumber">
                                            School Number
                                        </FieldLabel>
                                        <Input
                                            id="schoolNumber"
                                            name="schoolNumber"
                                            value={userData?.schoolNumber}
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
                                            value={userData?.firstName}
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
                                            value={userData?.middleName}
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
                                            value={userData?.lastName}
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="role">
                                            Role
                                        </FieldLabel>
                                        <Select
                                            value={userData.role}
                                            onValueChange={(value) =>
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    role: value,
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
                                            value={userData.department}
                                            onValueChange={(value) =>
                                                setUserData((prev) => ({
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
                                            value={userData?.yearLevel}
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
                                            value={userData?.email}
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
                                            value={userData?.number}
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                </FieldGroup>
                                <FieldSeparator>
                                    Or create user with
                                </FieldSeparator>
                                <Field>
                                    <FieldLabel htmlFor="file">
                                        Excel File
                                    </FieldLabel>
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept=".xlsx,.xls"
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] ?? null;
                                            setFile(file);
                                        }}
                                    />
                                </Field>
                                <Field>
                                    <Button
                                        type="submit"
                                        disabled={
                                            createUser.isPending ||
                                            createUserByFile.isPending ||
                                            (!file &&
                                                Object.values(userData).some(
                                                    (val) => val === undefined,
                                                ))
                                        }
                                    >
                                        {createUser.isPending ||
                                        createUserByFile.isPending
                                            ? "Creating..."
                                            : "Create User"}
                                    </Button>
                                </Field>
                            </FieldSet>
                        </form>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default CreateUsersDialog;
