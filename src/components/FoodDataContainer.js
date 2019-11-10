import React from 'react';

import PieChart from '../components/PieChart';

class FoodDataContainer extends React.Component {
	constructor(props) {
		super(props);
		this.foodName = props.foodName;
		this.cals = props.cals;
		this.carbs = props.carbs;
		this.protein = props.protein;
		this.fat = props.fat;
		this.fiber = props.fiber;
        this.calLimit = props.calLimit;
		this.calPct = Math.round(this.cals/this.calLimit * 100);
		this.carbsPct = Math.round(this.carbs/(this.calLimit * 0.1) * 100);
		this.proteinPct = Math.round(this.protein/((this.calLimit * 0.1)) * 100);
		this.fatPct = Math.round(this.fat/(this.calLimit * (0.2/9)) * 100);
		this.fiberPct = Math.round(this.fiber/30 * 100);
	}

	render() {
		var calStyle = {
			backgroundSize: this.calPct + '% 100%, 100% 100%'
		};
		var carbStyle = {
			backgroundSize: this.carbsPct + '% 100%, 100% 100%'
		};
		var proteinStyle = {
			backgroundSize: this.proteinPct + '% 100%, 100% 100%'
		};
		var fatStyle = {
			backgroundSize: this.fatPct + '% 100%, 100% 100%'
		};
		var fiberStyle = {
			backgroundSize: this.fiberPct + '% 100%, 100% 100%'
		};

		return (
          <div className = "food-data-container">
	          <header>
	          	<span className = "data-heading">{this.foodName}</span>
	          </header>

	          <div className = "content">
	          	<PieChart carbs = {this.carbs} protein = {this.protein} fat = {this.fat} fiber = {this.fiber} />

	          	<div className = "data-point">
	          		<span className = "data-heading">Calories: </span>
	          		<span className = "data-number">{this.cals} Cal</span>
	          		<div className = "data-bar" style = {calStyle}></div>
	          		<span className = "data-number">{this.calPct}% DV</span>
	          	</div>
	          	<div className = "data-point">
	          		<span className = "data-heading">Carbs: </span>
	          		<span className = "data-number">{this.carbs} g</span>
	          		<div className = "data-bar" style = {carbStyle}></div>
	          		<span className = "data-number">{this.carbsPct}% DV</span>
	          	</div>
	          	<div className = "data-point">
	          		<span className = "data-heading">Protein: </span>
	          		<span className = "data-number">{this.protein} g</span>
	          		<div className = "data-bar" style = {proteinStyle}></div>
	          		<span className = "data-number">{this.proteinPct}% DV</span>
	          	</div>
	          	<div className = "data-point">
	          		<span className = "data-heading">Fats: </span>
	          		<span className = "data-number">{this.fat} g</span>
	          		<div className = "data-bar" style = {fatStyle}></div>
	          		<span className = "data-number">{this.fatPct}% DV</span>
	          	</div>
	          	<div className = "data-point">
	          		<span className = "data-heading">Fiber: </span>
	          		<span className = "data-number">{this.fiber} g</span>
	          		<div className = "data-bar" style = {fiberStyle}></div>
	          		<span className = "data-number">{this.fiberPct}% DV</span>
	          	</div>
	          </div>
          </div>
		);
	}
}

export default FoodDataContainer;