export interface DragTypes  {
    id: number
    label: string
    isActiveEdit: boolean
    count: number
}

export type VDragAndDropEmits = {
    edit: [value: DragTypes]
}