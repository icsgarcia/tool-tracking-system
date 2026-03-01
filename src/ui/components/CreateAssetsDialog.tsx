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
import { useCreateAsset, useCreateAssetByFile } from "@/hooks/useAssets";
import { PackagePlus, Upload } from "lucide-react";

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
            <DialogContent className="max-w-lg w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <PackagePlus className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-base sm:text-lg">
                                Create Asset
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">
                                Fill out the form below or upload an Excel file
                                to create assets.
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
                                        Asset Count
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
                                    className="w-full"
                                    disabled={
                                        createAsset.isPending ||
                                        createAssetByFile.isPending ||
                                        (!assetData.assetName && !file)
                                    }
                                >
                                    {file ? (
                                        <Upload className="w-4 h-4" />
                                    ) : (
                                        <PackagePlus className="w-4 h-4" />
                                    )}
                                    {createAsset.isPending ||
                                    createAssetByFile.isPending
                                        ? "Creating..."
                                        : "Create Asset"}
                                </Button>
                            </Field>
                        </FieldSet>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAssetsDialog;
