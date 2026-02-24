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
import { useCreateAsset, useCreateAssetByFile } from "@/hooks/useAssets";
import { ScrollArea } from "./ui/scroll-area";

interface CreateAssetsDialogType {
    openCreateAssetsDialog: boolean;
    setOpenCreateAssetsDialog: Dispatch<SetStateAction<boolean>>;
}

const CreateAssetsDialog = ({
    openCreateAssetsDialog,
    setOpenCreateAssetsDialog,
}: CreateAssetsDialogType) => {
    const [assetData, setAssetData] = useState<CreateAssetDto>({
        temporaryTagNumber: "",
        assetName: "",
        assetDescription: "",
        serialNumber: "",
        assetCategoryCode: "",
        roomName: "",
        locationCode: "",
        assetCount: 0,
        assetCondition: "",
        remarks: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createAsset = useCreateAsset();
    const createAssetByFile = useCreateAssetByFile();

    const resetAssetData = () => {
        setAssetData({
            temporaryTagNumber: "",
            assetName: "",
            assetDescription: "",
            serialNumber: "",
            assetCategoryCode: "",
            roomName: "",
            locationCode: "",
            assetCount: 0,
            assetCondition: "",
            remarks: "",
        });
    };

    const resetFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            resetAssetData();
            resetFile();
        }
        setOpenCreateAssetsDialog(isOpen);
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setAssetData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (file) {
            createAssetByFile.mutate(file, {
                onSuccess: () => {
                    handleOpenChange(false);
                    resetAssetData();
                    resetFile();
                },
                onError: () => {
                    resetAssetData();
                    resetFile();
                },
            });
        } else if (assetData.assetName) {
            createAsset.mutate(assetData, {
                onSuccess: () => {
                    handleOpenChange(false);
                    resetAssetData();
                    resetFile();
                },
                onError: () => {
                    resetFile();
                },
            });
        }
    };

    return (
        <Dialog open={openCreateAssetsDialog} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Asset</DialogTitle>
                    <DialogDescription>
                        Fill out the form below or upload an Excel file to
                        create assets.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className=" h-100 rounded-md border">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <FieldSet>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="temporaryTagNumber">
                                            Temporary Tag Number
                                        </FieldLabel>
                                        <Input
                                            id="temporaryTagNumber"
                                            name="temporaryTagNumber"
                                            value={assetData.temporaryTagNumber}
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
                                            value={assetData.assetName}
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
                                            value={assetData.serialNumber}
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
                                            value={assetData.assetCategoryCode}
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
                                            value={assetData.roomName}
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
                                            value={assetData.locationCode}
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
                                            value={assetData.assetCount}
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
                                            value={assetData.assetCondition}
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
                                            value={assetData.remarks}
                                            onChange={handleOnChange}
                                        />
                                    </Field>
                                </FieldGroup>
                                <FieldSeparator>
                                    Or create assets with
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
                                        }}
                                    />
                                </Field>
                                <Field>
                                    <Button
                                        type="submit"
                                        disabled={
                                            createAsset.isPending ||
                                            createAssetByFile.isPending ||
                                            (!assetData.assetName && !file)
                                        }
                                    >
                                        {createAsset.isPending ||
                                        createAssetByFile.isPending
                                            ? "Creating..."
                                            : "Create Asset"}
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

export default CreateAssetsDialog;
