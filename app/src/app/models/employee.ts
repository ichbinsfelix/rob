import {SearchLink} from './searchLink';

export interface Employee extends SearchLink{
    id: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    room_id: number;
    initials: string;
    displayName: string;
    userPrincipalName: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    created_at: Date;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    updated_at: Date;
    description: string;
}
