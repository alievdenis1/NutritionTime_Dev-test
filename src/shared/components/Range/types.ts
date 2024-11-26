export interface Range {
    title?: string;
    unit?: string;
    min: number;
    max?: number;
    step: number;
    value: [number, number];
    maxLength?: number;
}
