import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-signature-pad',
	templateUrl: './signature-pad.component.html',
	styleUrls: ['./signature-pad.component.scss'],
})
export class SignaturePadComponent implements OnInit {
	title = 'signature';
	drawing = false;
	mousePos = { x: 0, y: 0 };
	lastPos = this.mousePos;

	@Output() captureSignatureEvent = new EventEmitter<string>();

	ngOnInit() {
		this.DrawSignatureLogic();
	}

	DrawSignatureLogic = () => {
		window.requestAnimationFrame =
			window.requestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};

		const canvas = document.getElementById(
			'sig-canvas'
		) as HTMLCanvasElement;
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.strokeStyle = '#222222';
		ctx.lineWidth = 4;

		canvas.addEventListener('mousedown', this.onMouseDown, false);
		canvas.addEventListener('mouseup', this.onMouseUp, false);
		canvas.addEventListener('mousemove', this.onMouseMove, false);

		canvas.addEventListener('touchmove', this.onTouchMove, false);
		canvas.addEventListener('touchend', this.onTouchEnd, false);

		document.body.addEventListener(
			'touchstart',
			this.onTouchStartBody,
			false
		);
		document.body.addEventListener('touchend', this.onTouchEndBody, false);
		document.body.addEventListener(
			'touchmove',
			this.onTouchMoveBody,
			false
		);

		this.drawLoop();
	};

	getMousePos = (canvasDom: HTMLCanvasElement, mouseEvent: MouseEvent) => {
		const rect = canvasDom.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top,
		};
	};

	getTouchPos = (canvasDom: HTMLCanvasElement, touchEvent: TouchEvent) => {
		const rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top,
		};
	};

	renderCanvas = () => {
		const canvas = document.getElementById(
			'sig-canvas'
		) as HTMLCanvasElement;
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

		if (this.drawing) {
			ctx.moveTo(this.lastPos.x, this.lastPos.y);
			ctx.lineTo(this.mousePos.x, this.mousePos.y);
			ctx.stroke();
			this.lastPos = this.mousePos;
		}
	};

	clearCanvas = () => {
		const canvas = document.getElementById(
			'sig-canvas'
		) as HTMLCanvasElement;
		canvas.width = canvas.width;
	};

	drawLoop = () => {
		requestAnimationFrame(this.drawLoop);
		this.renderCanvas();
	};

	onMouseDown = (e: MouseEvent) => {
		this.drawing = true;
		this.lastPos = this.getMousePos(e.target as HTMLCanvasElement, e);
	};

	onMouseUp = () => {
		this.drawing = false;
	};

	onMouseMove = (e: MouseEvent) => {
		this.mousePos = this.getMousePos(e.target as HTMLCanvasElement, e);
	};

	onTouchMove = (e: TouchEvent) => {
		const touch = e.touches[0];
		const me = new MouseEvent('mousemove', {
			clientX: touch.clientX,
			clientY: touch.clientY,
		});
		e.target!.dispatchEvent(me);
	};

	onTouchEnd = () => {
		const me = new MouseEvent('mouseup', {});
		const canvas = document.getElementById(
			'sig-canvas'
		) as HTMLCanvasElement;
		canvas.dispatchEvent(me);
	};

	onTouchStartBody = (e: TouchEvent) => {
		const canvas = document.getElementById(
			'sig-canvas'
		) as HTMLCanvasElement;
		if (e.target == canvas) {
			e.preventDefault();
		}
	};

	onTouchEndBody = (e: TouchEvent) => {
		const canvas = document.getElementById(
			'sig-canvas'
		) as HTMLCanvasElement;
		if (e.target == canvas) {
			e.preventDefault();
		}
	};

	onTouchMoveBody = (e: TouchEvent) => {
		const canvas = document.getElementById(
			'sig-canvas'
		) as HTMLCanvasElement;
		if (e.target == canvas) {
			e.preventDefault();
		}
	};

	onSubmitButtonClick = () => {
		const canvas = document.getElementById(
			'sig-canvas'
		) as HTMLCanvasElement;
		const dataUrl = canvas.toDataURL();
		this.captureSignatureEvent.emit(dataUrl);
	};
}
