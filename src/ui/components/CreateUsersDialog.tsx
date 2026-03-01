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
import { Separator } from "./ui/separator";
import { useCreateUser, useCreateUserByFile } from "@/hooks/useUsers";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { UserPlus, Upload } from "lucide-react";

interface CreateUsersDialogType {
    openCreateUsersDialog: boolean;
    setOpenCreateUsersDialog: Dispatch<SetStateAction<boolean>>;
}

const CreateUsersDialog = ({
    openCreateUsersDialog,
    setOpenCreateUsersDialog,
}: CreateUsersDialogType) => {
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
            number: "",
        });
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            resetForm();
        }
        setOpenCreateUsersDialog(isOpen);
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
                onSuccess: () => {
                    resetForm();
                    setOpenCreateUsersDialog(false);
                },
                onError: () => resetForm(),
            });
        } else if (userData) {
            createUser.mutate(userData, {
                onSuccess: () => {
                    resetForm();
                    setOpenCreateUsersDialog(false);
                },
            });
        }
    };

    return (
        <Dialog open={openCreateUsersDialog} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-lg w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <UserPlus className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-base sm:text-lg">
                                Create User
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">
                                Fill out the form below or upload an Excel file
                                to create a user.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator className="mx-4 sm:mx-6 w-auto" />
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6 sm:pb-6 pt-2">
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
                                        value={userData.schoolNumber}
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
                                            value={userData.firstName}
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
                                            value={userData.middleName}
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
                                            value={userData.lastName}
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
                                            value={userData.role}
                                            onValueChange={(value) =>
                                                setUserData((prev) => ({
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
                                                    <SelectItem value="BS AMT">
                                                        BS AMT
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
                                        value={userData.yearLevel}
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
                                            value={userData.email}
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
                                            value={userData.number}
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                </div>
                            </FieldGroup>
                            <FieldSeparator>Or create user with</FieldSeparator>
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
                                    className="w-full"
                                    disabled={
                                        createUser.isPending ||
                                        createUserByFile.isPending ||
                                        (!file &&
                                            Object.values(userData).some(
                                                (val) => val === undefined,
                                            ))
                                    }
                                >
                                    {file ? (
                                        <Upload className="w-4 h-4" />
                                    ) : (
                                        <UserPlus className="w-4 h-4" />
                                    )}
                                    {createUser.isPending ||
                                    createUserByFile.isPending
                                        ? "Creating..."
                                        : "Create User"}
                                </Button>
                            </Field>
                        </FieldSet>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateUsersDialog;
