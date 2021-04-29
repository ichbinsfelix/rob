export interface Floor{
    id: number;
    name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    building_id?: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    created_at?: Date;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    updated_at?: Date;
    plan?: string;
}
