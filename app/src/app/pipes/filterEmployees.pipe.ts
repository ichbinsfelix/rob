import {Pipe, PipeTransform} from '@angular/core';
import {UtilService as Util} from '../services/util.service';
import {Employee} from '../models/employee';

@Pipe({name: 'filterEmployees'})
export class FilterEmployeesPipe implements PipeTransform {

    transform(employees: Employee[], searchParameter: string | undefined): Employee[] {
        if (searchParameter && employees) {
            employees = employees.filter(employee => Util.contains(
                searchParameter,
                employee.displayName,
                employee.initials,
                employee.userPrincipalName,
                employee.description));
        }
        return employees;
    }
}
