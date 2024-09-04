import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	HostListener,
	AfterViewInit,
} from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
	selector: 'app-signature-pad',
	templateUrl: './signature-pad.component.html',
	styleUrls: ['./signature-pad.component.scss'],
})
export class SignaturePadComponent implements OnInit, AfterViewInit {
	@ViewChild('canvas', { static: false })
	signaturePadElement!: ElementRef<HTMLCanvasElement>;
	signaturePad!: SignaturePad;
	@Output() captureSignatureEvent = new EventEmitter<any>();

	constructor(private elementRef: ElementRef) {}

	ngOnInit(): void {
		this.init();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.init();
	}

	init() {
		this.signaturePadElement.nativeElement =
			this.elementRef.nativeElement.querySelector('canvas');
		this.signaturePadElement.nativeElement.width = 500;
		this.signaturePadElement.nativeElement.height = 200;
		this.signaturePad.clear(); // Clear the pad on init
	}

	ngAfterViewInit(): void {
		this.signaturePad = new SignaturePad(
			this.signaturePadElement.nativeElement,
			{
				penColor: 'rgb(56,128,255)',
				dotSize: 2,
				throttle: 16,
				velocityFilterWeight: 0.8,
				canvasContextOptions: { willReadFrequently: true },
			}
		);
		window.addEventListener('resize', () => this.resizeCanvas());
		window.addEventListener('orientationchange', () => this.resizeCanvas());
	}

	resizeCanvas() {
		const ratio = Math.max(window.devicePixelRatio || 1, 1);
		this.signaturePadElement.nativeElement.width =
			this.signaturePadElement.nativeElement.offsetWidth * ratio;
		this.signaturePadElement.nativeElement.height =
			this.signaturePadElement.nativeElement.offsetHeight * ratio;
		this.signaturePadElement.nativeElement
			.getContext('2d')
			?.scale(ratio, ratio);
		this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
	}

	save(): void {
		const img_64 = this.signaturePad.toDataURL();
		this.captureSignatureEvent.emit(img_64);
	}

	isCanvasBlank(): boolean {
		return this.signaturePad && this.signaturePad.isEmpty() ? true : false;
	}

	clear() {
		this.signaturePad.clear();
	}

	undo() {
		const data = this.signaturePad.toData();
		if (data) {
			data.pop(); // remove the last dot or line
			this.signaturePad.fromData(data);
		}
	}
}
