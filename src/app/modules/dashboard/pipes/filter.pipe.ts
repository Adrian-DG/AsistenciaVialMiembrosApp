import { Pipe, PipeTransform } from '@angular/core';
import { IGenericEnum } from '../../cache/interfaces/igeneric-enum';
import { IMetricasViewModel } from '../interfaces/imetricas-view-model';

@Pipe({
	name: 'filter',
})
export class FilterPipe implements PipeTransform {
	transform(
		data: IMetricasViewModel[],
		search: string
	): IMetricasViewModel[] {
		return data.filter((x) =>
			x.nombre.toLowerCase().includes(search.toLowerCase())
		);
	}
}
