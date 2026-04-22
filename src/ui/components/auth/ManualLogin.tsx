import {
    useState,
    type ChangeEvent,
    type Dispatch,
    type SetStateAction,
} from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type React from "react";
import { useManualLogin } from "@/hooks/useUsers";
import { useNavigate } from "react-router";
import { useAdminStore } from "@/store/useAdminStore";

interface ManualLoginProps {
    open: string;
    setOpen: Dispatch<SetStateAction<string | null>>;
}

const ManualLogin = ({ open, setOpen }: ManualLoginProps) => {
    const navigate = useNavigate();
    const admin = useAdminStore((state) => state.admin);
    const adminLogin = useAdminStore((state) => state.login);
    const manualLogin = useManualLogin();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        manualLogin.mutate(
            {
                email: formData.email,
                password: formData.password,
            },
            {
                onSuccess: (user) => {
                    adminLogin(user);

                    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
                        navigate("/admin");
                    }
                },
            },
        );
    };
    return (
        <Dialog open={open === "password"} onOpenChange={() => setOpen(null)}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />
                        </Field>
                        <Field>
                            <Button type="submit">Submit</Button>
                        </Field>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ManualLogin;
