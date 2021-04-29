import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,} from '@angular/core';
import {SearchLink} from '../../models/searchLink';

@Component({
    selector: 'rob-search-panel',
    templateUrl: './searchPanel.component.html',
    styleUrls: ['./searchPanel.component.css'],
})
export class SearchPanelComponent implements OnChanges {
    @Input() title!: string;
    @Input() links!: SearchLink[];
    @Input() multi!: boolean;
    @Input() default?: boolean = false;
    @Input() select: number | undefined;

    @Output() panelSearch: EventEmitter<SearchLink> = new EventEmitter<SearchLink>();
    @Output() panelDoubleClick: EventEmitter<SearchLink> = new EventEmitter<SearchLink>();

    expanded!: boolean;

    ngOnChanges(changes: SimpleChanges): void {
        this.expanded = (this.default || this.multi) && this.links.length > 0;
    }

    searchLink(link: SearchLink): void {
        this.select = link.id;
        this.panelSearch.emit(link);
    }

    doubleClick(link: SearchLink): void {
        this.panelDoubleClick.emit(link);
    }


}
