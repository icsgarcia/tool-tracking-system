import {
    useState,
    useRef,
    type Dispatch,
    type SetStateAction,
    type FormEvent,
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
import { useCreateTool, useCreateToolByFile } from "@/hooks/useTools";

interface CreateToolsDialogType {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
}

const CreateToolsDialog = ({ open, onOpenChange }: CreateToolsDialogType) => {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createTool = useCreateTool();
    const createToolByFile = useCreateToolByFile();

    const resetForm = () => {
        setName("");
        setQuantity(1);
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setName("");
            setQuantity(1);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
        onOpenChange(isOpen);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (file) {
            createToolByFile.mutate(file, {
                onSuccess: () => {
                    handleOpenChange(false);
                    resetForm();
                },
                onError: () => {
                    resetForm();
                },
            });
        } else if (name) {
            createTool.mutate(
                { name, quantity },
                {
                    onSuccess: () => {
                        handleOpenChange(false);
                        resetForm();
                    },
                    onError: () => {
                        resetForm();
                    },
                },
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Tool</DialogTitle>
                    <DialogDescription>Lorem, ipsum dolor.</DialogDescription>
                </DialogHeader>
                <div>
                    <form onSubmit={handleSubmit}>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="tool-name">
                                        Tool Name
                                    </FieldLabel>
                                    <Input
                                        id="tool-name"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setFile(null);
                                        }}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="quantity">
                                        Quantity
                                    </FieldLabel>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        max={9999}
                                        value={quantity}
                                        onChange={(e) => {
                                            setQuantity(Number(e.target.value));
                                            setFile(null);
                                        }}
                                    />
                                </Field>
                            </FieldGroup>
                            <FieldSeparator>
                                Or create tools with
                            </FieldSeparator>
                            <Field>
                                <FieldLabel htmlFor="file">
                                    Excel File
                                </FieldLabel>
                                <Input
                                    id="file"
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file =
                                            e.target.files?.[0] ?? null;
                                        setFile(file);
                                        setName("");
                                        setQuantity(0);
                                    }}
                                />
                            </Field>
                            <Field>
                                <Button
                                    type="submit"
                                    disabled={
                                        createTool.isPending ||
                                        createToolByFile.isPending ||
                                        (!name && !file)
                                    }
                                >
                                    {createTool.isPending ||
                                    createToolByFile.isPending
                                        ? "Creating..."
                                        : "Create Tool"}
                                </Button>
                            </Field>
                        </FieldSet>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateToolsDialog;
