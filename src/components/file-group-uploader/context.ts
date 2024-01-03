import { useContext } from "react";
import React from "react";

import { FileGroups } from "./file-group-uploader";


export interface FGUploaderStore {
    onFilesSelect: (group: string, files: File[]) => void;
    deleteFile: (group: string, file: File) => void;
    fileGroups: FileGroups
}

export const FGUploaderContext = React.createContext<FGUploaderStore>({
    onFilesSelect: () => { },
    deleteFile: () => { },
    fileGroups: {}
});

export const useFGUploaderContext = (): FGUploaderStore => useContext(FGUploaderContext);
