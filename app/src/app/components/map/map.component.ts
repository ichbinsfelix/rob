import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,} from '@angular/core';

import * as d3 from 'd3';
import {ApiService} from '../../services/api.service';
import {RoomService} from '../../services/room.service';
import {Room} from '../../models/room';
import {RoomAvailabilityService} from '../../services/roomAvailability.service';

@Component({
    selector: 'rob-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnChanges {
    @Input() floor!: string;
    @Input() search!: boolean;
    @Input() goto?: string;
    @Input() select?: string;
    @Output() mapClicked: EventEmitter<string> = new EventEmitter<string>();

    private width: number;
    private height: number;

    private zoom: d3.ZoomBehavior<Element, unknown> | undefined;
    private svgContainer: d3.Selection<SVGSVGElement, HTMLElement, any, any>;
    private svgDiv: SVGSVGElement | null;
    private svgSvg: d3.Selection<SVGSVGElement, undefined, null, undefined>;

    private svgRooms!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    private svgDepartments!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    private svgBuildings!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    private svgLabels!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    private svgWalls!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    private svgFurniture!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;

    private svgTopLayer:
        | d3.Selection<SVGGElement, undefined, null, undefined>
        | undefined;

    private floorPlan: Document[] | SVGSVGElement[];

    constructor(private apiService: ApiService,
                private roomAvailabilityService: RoomAvailabilityService,
                private roomService: RoomService) {
        this.roomAvailabilityService.roomAvailabilityChanged$
            .subscribe(technicalName => this.updateRoom(technicalName));

        this.svgContainer = d3.select('#svg-container');

        this.svgSvg = d3.create('svg');
        this.svgDiv = this.svgContainer.node();

        this.initializeHtml();

        this.width = 200;
        this.height = 200;
        this.floorPlan = [];
    }

    ngAfterViewInit(): void {
        this.svgContainer = d3.select('#svg-container');
        this.svgDiv = this.svgContainer.node();

        this.height = parseInt(
            this.svgContainer.style('height').replace('px', ''),
            10
        );
        this.width = parseInt(
            this.svgContainer.style('width').replace('px', ''),
            10
        );

        this.zoom = d3
            .zoom()
            .on('zoom', (event) => {
                if (this.svgTopLayer) {
                    this.svgTopLayer.attr('transform', event.transform);
                }
            })
            .scaleExtent([1, 20]);

        this.svgSvg = d3
            .create('svg')
            .attr('height', this.height)
            .attr('width', this.width);
        this.svgTopLayer = this.svgSvg.append('g');

        if (this.searchRoom()) {
            this.getFloorPlan().then(data => this.drawMap(data));
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.floor) {
            this.floorChanged(changes);
        } else if (changes.goto) {
            this.gotoRoom();
        } else if (changes.search) {
            //Wait until flexbox reacted
            setTimeout(() => {
                this.searchRoom();
            },50);
        }
        this.paint();
    }

    private initializeHtml(): void {
        this.svgRooms = d3.select('#rooms');
        this.svgDepartments = d3.select('#departments');
        this.svgBuildings = d3.select('#buildings');
        this.svgLabels = d3.select('#labels');
        this.svgWalls = d3.select('#walls');
        this.svgFurniture = d3.select('#furniture');
    }

    private floorChanged(changes: SimpleChanges): void {
        this.svgRooms.remove();
        this.svgDepartments.remove();
        this.svgBuildings.remove();
        this.svgLabels.remove();
        this.svgWalls.remove();
        this.svgFurniture.remove();
        if (this.searchRoom()) {
            this.getFloorPlan().then(data => {
                this.drawMap(data);
                if (changes.goto) {
                    this.gotoRoom();
                }
            });
        }
    }

    private gotoRoom(): void {
        if (this.goto) {
            this.choose(
                parseInt(d3.select('#' + this.goto).attr('width'), 10),
                parseInt(d3.select('#' + this.goto).attr('height'), 10),
                parseInt(d3.select('#' + this.goto).attr('x'), 10),
                parseInt(d3.select('#' + this.goto).attr('y'), 10));
        }
    }


    private paint(): void {
        if (localStorage.getItem('rob_defaultFloor')) {
            if (this.floor === localStorage.getItem('rob_defaultFloor')) {
                d3.select('#path5404').attr('opacity', '1');
            } else {
                d3.select('#path5404').attr('opacity', '0');
            }
        } else {
            d3.select('#path5404').attr('opacity', '1');
        }

        d3.selectAll('#rooms>rect').attr('fill', '#FFFFFF')
            .attr('opacity', '0.5')
            .attr('fill-opacity', '1')
            .attr('stroke', '#000000')
            .attr('stroke-width', '0.264583');
        d3.selectAll('#departments>rect').attr('fill', '#FFFFFF')
            .attr('opacity', '0.5')
            .attr('fill-opacity', '1')
            .attr('stroke', '#000000')
            .attr('stroke-width', '0.264583');

        d3.select('#' + this.select).attr('fill', '#fac300');


        d3.selectAll('#rooms>rect').each((d, i, nodes) => {
            const rect: SVGRectElement = nodes[i] as SVGRectElement;
            const name: string = this.roomService.getRoomByTechnicalName(rect.id)?.displayName as string;
            this.updateRoom(rect.id);

            this.svgLabels.append('rect')
                .attr('fill', '#fef8e0')
                .attr('width', 15)
                .attr('height', 5)
                .attr('x', rect.x.animVal.value + 1)
                .attr('y', rect.y.animVal.value + 6.5);

            this.svgLabels.append('text')
                .text(name?.slice(7))
                .style('font-size', '0.2em')
                .style('font-family', 'sans-serif')
                .attr('x', rect.x.animVal.value + 2)
                .attr('y', rect.y.animVal.value + 10);
        });

    }

    private updateRoom(technicalName: string): void {
        const room: Room = this.roomService.getRoomByTechnicalName(technicalName) as Room;
        if (room?.isMeetingRoom) {
            if (room.currentlyAvailable) {
                d3.select('#' + room.technicalName)
                    .attr('style', 'outline: 0.1vh solid;' +
                        ' outline-color: rgba(0, 255, 0, 0.5);' +
                        'outline-offset: -0.1vh;');
            } else {
                d3.select('#' + room.technicalName)
                    .attr('style', 'outline: 0.1vh solid;' +
                        ' outline-color: rgba(255, 0, 0, 0.5);' +
                        'outline-offset: -0.1vh;');
            }
        }
    }

    private getFloorPlan(): Promise<Document> {
        const parser = new DOMParser();
        return new Promise((resolve, reject) => {
            this.apiService.getPlan(parseInt(this.floor, 10)).subscribe(
                result => {
                    resolve(parser.parseFromString(result, 'image/svg+xml'));
                },
                error => {
                    reject('floor plan loading error: ' + this.floor + error);
                }
            );
        });
    }

    private searchRoom(): boolean {
        if (this.svgContainer && this.svgContainer.size() > 0) {
            this.height = parseInt(
                this.svgContainer.style('height').replace('px', ''),
                10
            );
            this.width = parseInt(
                this.svgContainer.style('width').replace('px', ''),
                10
            );
            this.svgSvg?.attr('height', this.height).attr('width', this.width);
            return true;
        }
        return false;
    }

    private drawMap(data: Document): void {
        this.svgTopLayer?.node()?.append(data.getElementById('departments') as Node);
        this.svgTopLayer?.node()?.append(data.getElementById('buildings') as Node);
        this.svgTopLayer?.node()?.append(data.getElementById('walls') as Node);
        this.svgTopLayer?.node()?.append(data.getElementById('furniture') as Node);
        this.svgTopLayer?.node()?.append(data.getElementById('rooms') as Node);
        this.svgTopLayer?.node()?.append(data.getElementById('labels') as Node);
        this.svgDiv?.appendChild(this.svgSvg?.node() as Node);

        // @ts-ignore
        this.svgSvg.call(this.zoom);

        this.initializeHtml();

        this.paint();

        this.svgRooms.on('click', (mEvent) => {
            const m: MouseEvent = mEvent as MouseEvent;
            this.clicked(m);
        });
        this.navigate(0); //reset
    }

    private clicked(event: MouseEvent): void {
        const elem: SVGRectElement = event.composedPath()[0] as SVGRectElement;
        const technicalName = elem.attributes.getNamedItem('id')?.value as string;
        this.mapClicked.emit(technicalName);
        this.select = technicalName;

        this.paint();
        const width: number = parseInt(
            elem.attributes.getNamedItem('width')?.value as string,
            10
        );
        const height: number = parseInt(
            elem.attributes.getNamedItem('height')?.value as string,
            10
        );
        const x: number = parseInt(
            elem.attributes.getNamedItem('x')?.value as string,
            10
        );
        const y: number = parseInt(
            elem.attributes.getNamedItem('y')?.value as string,
            10
        );
        this.choose(width, height, x, y);
    }

    private choose(width: number, height: number, x: number, y: number): void {
        const baseScale = this.width / 305;

        const scaleMaxX = baseScale * (this.width / (width * baseScale));
        const scaleMaxY = baseScale * (this.height / (height * baseScale));

        const scale = Math.min(scaleMaxX, scaleMaxY) * 0.8;

        const pointX = x * scale - (this.width / 2 - (width / 2) * scale);
        const pointY = y * scale - (this.height / 2 - (height / 2) * scale);

        this.navigate(1000, [pointX, pointY], scale);
    }

    private navigate(duration = 0, whereTo = [0, 0], scale = this.width / 305): void {
        this.svgSvg?.transition().duration(duration).call(
            // @ts-ignore
            this.zoom?.transform,
            d3.zoomIdentity.translate(-whereTo[0], -whereTo[1]).scale(scale)
        );
    }
}
