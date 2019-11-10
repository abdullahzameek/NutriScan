import React from 'react';

class FoodEatenNodeContainer extends React.Component {
	constructor(props) {
		super(props);
		this.timeStamp = props.index;
		this.foodName = props.foodName;
		this.cals = props.cals;
		this.carbs = props.carbs;
		this.protein = props.protein;
		this.fat = props.fat;
		this.fiber = props.fiber;
		this.state = {
			showInfo: false
		};
		this.showInfo = this.showInfo.bind(this);
	}

	showInfo() {
		this.setState({
			showInfo: !this.state.showInfo
		});
	}

	render() {
		return (
          <div className = "food-data-container">
	          <header>
	          	<span className = "data-heading" onClick = {this.showInfo}><u>{this.foodName} - {this.timeStamp + ':' + Math.floor(Math.random() * 50 + 10)}</u></span>
	          </header>

	          <div className = {this.state.showInfo ? "content show" : "content"}>
	      		<span className = "data-heading">Calories: {this.cals} Cal</span>
	      		<span className = "data-heading">Carbs: {this.carbs} g</span>
	      		<span className = "data-heading">Protein: {this.protein} g</span>
	      		<span className = "data-heading">Fats: {this.fat} g</span>
	      		<span className = "data-heading">Fiber: {this.fiber} g</span>
	          </div>
          </div>
		);
	}
}

export default FoodEatenNodeContainer;