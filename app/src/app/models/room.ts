import {SearchLink} from './searchLink';

export interface Room extends SearchLink {
    id: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    floor_id: number;
    technicalName: string;
    displayName: string;
    isMeetingRoom: boolean;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    created_at: Date;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    updated_at: Date;
    capacity?: number;
    media?: string;
    ucc?: string;
    top?: string;
    left?: string;
    currentlyAvailable: number;
}
