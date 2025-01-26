declare module 'react-pdftotext' {
    function pdfToText(file: File): Promise<string>;
    export default pdfToText;
}