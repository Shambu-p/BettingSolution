
export default interface LocalData {
    Choices: any[];
    Users: any[];
    ReportConfig: any;
    dateConfig: {
        type: string; // "ethiopian" or "gregorian"
        format: string; // e.g., "dd/mm/yyyy"
        separater: string; // e.g., "-"
    }
}