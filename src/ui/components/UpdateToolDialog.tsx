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
import {
    useEffect,
    useState,
    type ChangeEvent,
    type Dispatch,
    type FormEvent,
    type SetStateAction,
} from "react";
import { useUpdateTool } from "@/hooks/useTools";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";

type Tool = {
    id: string;
    name: string;
    quantity: number;
};

interface UpdateToolDialogProps {
    openUpdateTool: boolean;
    setOpenUpdateTool: Dispatch<SetStateAction<boolean>>;
    tool: Tool;
}

const UpdateToolDialog = ({
    openUpdateTool,
    setOpenUpdateTool,
    tool,
}: UpdateToolDialogProps) => {
    const updateTool = useUpdateTool();
    const [updateToolData, setUpdateToolData] = useState<Tool>(tool);

    useEffect(() => {
        setUpdateToolData(tool);
    }, [tool]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setUpdateToolData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleUpdateTool = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateTool.mutate(updateToolData);
    };
    return (
        <Dialog open={openUpdateTool} onOpenChange={setOpenUpdateTool}>
            <DialogContent>
                <form onSubmit={handleUpdateTool}>
                    <DialogHeader>
                        <DialogTitle>Update Tool</DialogTitle>
                        <DialogDescription>
                            Update the tool details below and click "Update
                            Tool" to save changes.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="tool-name">
                                        Tool Name
                                    </FieldLabel>
                                    <Input
                                        id="tool-name"
                                        name="name"
                                        value={updateToolData.name}
                                        onChange={handleOnChange}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="quantity">
                                        Quantity
                                    </FieldLabel>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        max={9999}
                                        value={updateToolData.quantity}
                                        onChange={handleOnChange}
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={updateTool.isPending}>
                            {" "}
                            {updateTool.isPending
                                ? "Updating..."
                                : "Update Tool"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateToolDialog;
