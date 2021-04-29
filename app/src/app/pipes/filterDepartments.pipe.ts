import {Pipe, PipeTransform} from '@angular/core';
import {UtilService as Util} from '../services/util.service';
import {Department} from '../models/department';

@Pipe({name: 'filterDepartments'})
export class FilterDepartmentsPipe implements PipeTransform {

    transform(departments: Department[], searchParameter: string | undefined): Department[] {
        if (searchParameter && departments) {
            departments = departments.filter(department => Util.contains(searchParameter, department.name));
        }
        return departments;
    }
}
