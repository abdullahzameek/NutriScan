import React from 'react';

(function () {
	var requestAnimationFrame = window.requestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

const fps = 60;

class PieChart extends React.Component {
	constructor(props) {
		super(props);
		this.carbs = props.carbs;
		this.protein = props.protein;
		this.fat = props.fat;
		this.fiber = props.fiber;
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	componentDidMount() {
		const canvas = this.refs.piechart;
		const ctx = canvas.getContext('2d');

		if (window.innerWidth > 768) {
			canvas.style.width = window.innerWidth/4 + "px";
		} else {
			canvas.style.width = 150 + "px";
		}

		canvas.width = parseInt(canvas.style.width.slice(0, canvas.style.width.length - 2)) * 5;
		canvas.height = canvas.width * (2/3);
		canvas.style.height = canvas.height/5 + "px";

		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var carbPct = 0;
		var proteinPct = 0;
		var fatPct = 0;
		var fiberPct = 0;

		if (this.carbs + this.protein + this.fat + this.fiber == 0) {
			ctx.lineWidth = canvas.width/10;
			ctx.strokeStyle = "#eee";
			ctx.beginPath();
			ctx.arc(canvas.width/3, canvas.height/2, canvas.width/4, 0, 2 * Math.PI);
			ctx.stroke();
		} else {
			carbPct = this.carbs/(this.carbs + this.protein + this.fat + this.fiber);
			proteinPct = this.protein/(this.carbs + this.protein + this.fat + this.fiber);
			fatPct = this.fat/(this.carbs + this.protein + this.fat + this.fiber);
			fiberPct = this.fiber/(this.carbs + this.protein + this.fat + this.fiber);
			const carbAngle = Math.PI * 2 * carbPct;
			const proteinAngle = Math.PI * 2 * proteinPct;
			const fatAngle = Math.PI * 2 * fatPct;
			const fiberAngle = Math.PI * 2 * fiberPct;

			ctx.lineWidth = canvas.width/10;
			ctx.strokeStyle = "#FF9800";
			ctx.beginPath();
			ctx.arc(canvas.width/3, canvas.height/2, canvas.width/4, 0, carbAngle);
			ctx.stroke();
			ctx.strokeStyle = "#FF5722";
			ctx.beginPath();
			ctx.arc(canvas.width/3, canvas.height/2, canvas.width/4, carbAngle, carbAngle + proteinAngle);
			ctx.stroke();
			ctx.strokeStyle = "#FFEB3B";
			ctx.beginPath();
			ctx.arc(canvas.width/3, canvas.height/2, canvas.width/4, carbAngle + proteinAngle, carbAngle + proteinAngle + fatAngle);
			ctx.stroke();
			ctx.strokeStyle = "#00E676";
			ctx.beginPath();
			ctx.arc(canvas.width/3, canvas.height/2, canvas.width/4, carbAngle + proteinAngle + fatAngle, carbAngle + proteinAngle + fatAngle + fiberAngle);
			ctx.stroke();
			ctx.strokeStyle = "#fff";
			ctx.beginPath();
			ctx.arc(canvas.width/3, canvas.height/2, canvas.width/4, 0, 0.05);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(canvas.width/3, canvas.height/2, canvas.width/4, carbAngle, carbAngle + 0.05);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(canvas.width/3, canvas.height/2, canvas.width/4, carbAngle + proteinAngle, carbAngle + proteinAngle + 0.05);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(canvas.width/3, canvas.height/2, canvas.width/4, carbAngle + proteinAngle + fatAngle, carbAngle + proteinAngle + fatAngle + 0.05);
			ctx.stroke();

			ctx.fillStyle = "#FF9800";
			ctx.fillRect(canvas.width - canvas.width/3.5, canvas.height/8, canvas.width/15, canvas.width/15);
			ctx.fillStyle = "#FF5722";
			ctx.fillRect(canvas.width - canvas.width/3.5, 2 * canvas.height/8 + canvas.width/15, canvas.width/15, canvas.width/15);
			ctx.fillStyle = "#FFEB3B";
			ctx.fillRect(canvas.width - canvas.width/3.5, 3 * canvas.height/8 + 2 * canvas.width/15, canvas.width/15, canvas.width/15);
			ctx.fillStyle = "#00E676";
			ctx.fillRect(canvas.width - canvas.width/3.5, 4 * canvas.height/8 + 3 * canvas.width/15, canvas.width/15, canvas.width/15);
		}

		ctx.fillStyle = "#000";
		ctx.font = canvas.width/30 + "px Arial";
		ctx.textBaseline = "middle";
		ctx.fillText(Math.round(carbPct * 100) + "% Carbs", canvas.width - canvas.width/3.5 + canvas.width/12, canvas.height/8 + canvas.width/30);
		ctx.fillText(Math.round(proteinPct * 100) + "% Protein", canvas.width - canvas.width/3.5 + canvas.width/12, 2 * canvas.height/8 + canvas.width/15 + canvas.width/30);
		ctx.fillText(Math.round(fatPct * 100) + "% Fat", canvas.width - canvas.width/3.5 + canvas.width/12, 3 * canvas.height/8 + 2 * canvas.width/15 + canvas.width/30);
		ctx.fillText(Math.round(fiberPct * 100) + "% Fiber", canvas.width - canvas.width/3.5 + canvas.width/12, 4 * canvas.height/8 + 3 * canvas.width/15 + canvas.width/30);
	}

	render() {
		return (
			<canvas ref = "piechart"></canvas>
		);
	}
}

export default PieChart;    