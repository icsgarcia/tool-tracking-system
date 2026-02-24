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
import { useUpdateAsset } from "@/hooks/useAssets";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface UpdateAssetDialogProps {
    openUpdateAsset: boolean;
    setOpenUpdateAsset: Dispatch<SetStateAction<boolean>>;
    asset: UpdateAssetDto;
}

const UpdateAssetDialog = ({
    openUpdateAsset,
    setOpenUpdateAsset,
    asset,
}: UpdateAssetDialogProps) => {
    const updateAsset = useUpdateAsset();
    const [updateAssetData, setUpdateAssetData] =
        useState<UpdateAssetDto>(asset);

    useEffect(() => {
        setUpdateAssetData(asset);
    }, [asset]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setUpdateAssetData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleUpdateAsset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateAsset.mutate(updateAssetData, {
            onSuccess: () => {
                setOpenUpdateAsset(false);
            },
            onError: () => {
                setUpdateAssetData(asset);
            },
        });
    };
    return (
        <Dialog open={openUpdateAsset} onOpenChange={setOpenUpdateAsset}>
            <DialogContent>
                <form onSubmit={handleUpdateAsset}>
                    <DialogHeader>
                        <DialogTitle>Update Asset</DialogTitle>
                        <DialogDescription>
                            Update the asset details below and click "Update
                            Asset" to save changes.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className=" h-100 rounded-md border">
                        <div>
                            <FieldSet>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="temporaryTagNumber">
                                            Temporary Tag Number
                                        </FieldLabel>
                                        <Input
                                            id="temporaryTagNumber"
                                            name="temporaryTagNumber"
                                            value={
                                                updateAssetData.temporaryTagNumber ||
                                                ""
                                            }
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="assetName">
                                            Asset Name
                                        </FieldLabel>
                                        <Input
                                            id="assetName"
                                            name="assetName"
                                            value={
                                                updateAssetData.assetName || ""
                                            }
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="serialNumber">
                                            Serial Number
                                        </FieldLabel>
                                        <Input
                                            id="serialNumber"
                                            name="serialNumber"
                                            value={
                                                updateAssetData.serialNumber ||
                                                ""
                                            }
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="assetCategoryCode">
                                            Asset Category Code
                                        </FieldLabel>
                                        <Input
                                            id="assetCategoryCode"
                                            name="assetCategoryCode"
                                            value={
                                                updateAssetData.assetCategoryCode ||
                                                ""
                                            }
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="roomName">
                                            Room Name
                                        </FieldLabel>
                                        <Input
                                            id="roomName"
                                            name="roomName"
                                            value={
                                                updateAssetData.roomName || ""
                                            }
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="locationCode">
                                            Location Code
                                        </FieldLabel>
                                        <Input
                                            id="locationCode"
                                            name="locationCode"
                                            value={
                                                updateAssetData.locationCode ||
                                                ""
                                            }
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="assetCount">
                                            assetCount
                                        </FieldLabel>
                                        <Input
                                            id="assetCount"
                                            name="assetCount"
                                            type="number"
                                            max={9999}
                                            value={
                                                updateAssetData.assetCount || 0
                                            }
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="assetCondition">
                                            Asset Condition
                                        </FieldLabel>
                                        <Input
                                            id="assetCondition"
                                            name="assetCondition"
                                            value={
                                                updateAssetData.assetCondition ||
                                                ""
                                            }
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="remarks">
                                            Remarks
                                        </FieldLabel>
                                        <Input
                                            id="remarks"
                                            name="remarks"
                                            value={
                                                updateAssetData.remarks || ""
                                            }
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
                            <Button
                                type="submit"
                                disabled={updateAsset.isPending}
                            >
                                {" "}
                                {updateAsset.isPending
                                    ? "Updating..."
                                    : "Update Asset"}
                            </Button>
                        </DialogFooter>
                    </ScrollArea>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateAssetDialog;
