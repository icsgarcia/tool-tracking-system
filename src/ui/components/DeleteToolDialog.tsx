import type { Dispatch, FormEvent, SetStateAction } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import type { Tool } from "@/pages/AdminDashboard";
import { Button } from "./ui/button";
import { useDeleteTool } from "@/hooks/useTools";

interface DeleteToolDialogProps {
    openDeleteTool: boolean;
    setOpenDeleteTool: Dispatch<SetStateAction<boolean>>;
    tool: Tool;
}

const DeleteToolDialog = ({
    openDeleteTool,
    setOpenDeleteTool,
    tool,
}: DeleteToolDialogProps) => {
    const deleteTool = useDeleteTool();

    const handleDeleteTool = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        deleteTool.mutate(tool.id, {
            onSuccess: () => setOpenDeleteTool(false),
        });
    };

    return (
        <Dialog open={openDeleteTool} onOpenChange={setOpenDeleteTool}>
            <DialogContent>
                <form onSubmit={handleDeleteTool}>
                    <DialogHeader>
                        <DialogTitle>Confirm Tool Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this tool? This
                            action cannot be undone and will permanently remove
                            the tool and all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <p>
                            <span className="font-bold">Tool Name:</span>{" "}
                            {tool.name}
                        </p>
                        <p>
                            <span className="font-bold">Quantity:</span>{" "}
                            {tool.quantity}
                        </p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={deleteTool.isPending}>
                            {deleteTool.isPending
                                ? "Deleting..."
                                : "Delete Tool"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteToolDialog;
