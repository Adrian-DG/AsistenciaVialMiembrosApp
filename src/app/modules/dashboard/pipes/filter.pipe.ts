import { Pipe, PipeTransform } from '@angular/core';
import { IGenericEnum } from '../../cache/interfaces/igeneric-enum';

@Pipe({
	name: 'filter',
})
export class FilterPipe implements PipeTransform {
	transform(data: IGenericEnum[], search: string): IGenericEnum[] {
		return data.filter((x) =>
			x.nombre.toLowerCase().includes(search.toLowerCase())
		);
	}
}
