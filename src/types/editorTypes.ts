export interface JSONEditorProps {
    schema: any;
    setSchema: React.Dispatch<React.SetStateAction<any>>;
    setJsonError: React.Dispatch<React.SetStateAction<any>>;
}