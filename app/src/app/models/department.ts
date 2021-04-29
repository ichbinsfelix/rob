import {SearchLink} from './searchLink';

export interface Department extends SearchLink{
    id: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    floor_id: number;
    name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    created_at: Date;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    updated_at: Date;
}
