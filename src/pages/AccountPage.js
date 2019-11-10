import React from 'react';

import FoodEatenNodeContainer from '../components/FoodEatenNodeContainer';

class AccountPage extends React.Component {
	constructor(props) {
		super(props)
        this.state = {
        	showData: false,
            name: "John Smith",
            cals: 0,
            calLimit: 2000,
            carbs: 0,
            carbLimit: 200,
            protein: 0,
            proteinLimit: 200,
            fat: 0,
            fatLimit: 44,
            fiber: 0,
            fiberLimit: 30,
			diet: "Paleo",
            foodEaten: [],
            foodEatenNodes: []
		};
        this.getMacrosFromName = this.getMacrosFromName.bind(this);
	}
    
    getMacrosFromName(food) {
         var foodJson = JSON.parse(JSON.stringify({
            "Pizza":
            {
                "Energy": "277 kcal",
                "Protein": "10.97 g",
                "Total lipid (fat)": "11.61 g",
                "Carbohydrate, by difference" :  "29.68	g",
                "Fiber, total dietary": "0.6 g"
            },

            "Caesar Salad":
            {
                "Energy": "189 kcal",
                "Protein": "5.91 g",
                "Total lipid (fat)": "15.75 g",
                "Carbohydrate, by difference" :  "7.48	g",
                "Fiber, total dietary": "2 g"
            },

            "Chicken Wings":
            {
                "Energy": "283 kcal",
                "Protein": "18.58 g",
                "Total lipid (fat)": "18.58 g",
                "Carbohydrate, by difference" :  "0	g",
                "Fiber, total dietary": "0 g"
            },
            "Donut":
            {
                "Energy": "324 kcal",
                "Protein": "5.63 g",
                "Total lipid (fat)": "11.27 g",
                "Carbohydrate, by difference" :  "53.52	g",
                "Fiber, total dietary": "1.4 g"
            },
            "Fried Rice":
            {
                "Energy": "170 kcal",
                "Protein": "7.69 g",
                "Total lipid (fat)": "3.21 g",
                "Carbohydrate, by difference" :  "27.24	g",
                "Fiber, total dietary": "1 g"
            },
            "Dumplings":
		    {
		        "Energy": "145 kcal",
		        "Protein": "9.21 g",
		        "Total lipid (fat)": "1.97 g",
		        "Carbohydrate, by difference" :  "23.68	g",
		        "Fiber, total dietary": "1.3 g"
		    },
		    "French Fries":
		    {
		        "Energy": "155 kcal",
		        "Protein": "2.38 g",
		        "Total lipid (fat)": "4.76 g",
		        "Carbohydrate, by difference" :  "25 g",
		        "Fiber, total dietary": "2.4 g"
		    },
		     "Hamburger":
		    {
		        "Energy": "186 kcal",
		        "Protein": "9.3 g",
		        "Total lipid (fat)": "2.33 g",
		        "Carbohydrate, by difference" :  "44.19 g",
		        "Fiber, total dietary": "9.3 g"
		    }
        }));

        if (!foodJson.hasOwnProperty(food)) {
        	var macrosObject = new Object();
	        macrosObject.cals = 0;
	        macrosObject.carbs = 0;
	        macrosObject.protein = 0;
	        macrosObject.fat = 0;
	        macrosObject.fiber = 0;
	        return macrosObject;
        }

        var macrosObject = new Object();
        macrosObject.cals = parseFloat(foodJson[food]['Energy'].split(' ')[0]);
        macrosObject.carbs = parseFloat(foodJson[food]['Carbohydrate, by difference'].split(' ')[0]);
        macrosObject.protein = parseFloat(foodJson[food]['Protein'].split(' ')[0]);
        macrosObject.fat = parseFloat(foodJson[food]['Total lipid (fat)'].split(' ')[0]);
        macrosObject.fiber = parseFloat(foodJson[food]['Fiber, total dietary'].split(' ')[0]);
        return macrosObject;
    }
    
    componentDidMount() {
        var userId = "User001";
        var thisTemp = this;

        fetch("http://nutriscan.appspot.com/get-username-by-userid", {
            mode: "cors",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({UserID: userId})
        }).then(function(response) {
            return response.json();
        }).then(function(name) {
            thisTemp.setState({
                name: name
            });
        });

        fetch("http://nutriscan.appspot.com/get-current-calories-by-userid", {
            mode: "cors",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({UserID: userId})
        }).then(function(response) {
            return response.json();
        }).then(function(cals) {
            thisTemp.setState({
                cals: cals
            });
        });

        fetch("http://nutriscan.appspot.com/get-total-calories-by-userid", {
            mode: "cors",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({UserID: userId})
        }).then(function(response) {
            return response.json();
        }).then(function(calLimit) {
            thisTemp.setState({
                calLimit: calLimit
            });
        });

        fetch("http://nutriscan.appspot.com/get-food-consumed", {
            mode: "cors",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({UserID: userId})
        }).then(function(response) {
            return response.json();
        }).then(function(foodEaten) {
            thisTemp.setState({
                foodEaten: foodEaten
            });

            for (var i = foodEaten.length - 1; i >= 0; i--) {
            	var foodName = foodEaten[i];
            	var food = thisTemp.getMacrosFromName(foodName);

            	thisTemp.setState({
            		foodEatenNodes: thisTemp.state.foodEatenNodes.concat([<FoodEatenNodeContainer index = {i} foodName = {foodName} cals = {food.cals} carbs = {food.carbs} protein = {food.protein} fat = {food.fat} fiber = {food.fiber} />]),
            		carbs: Math.round(thisTemp.state.carbs + food.carbs),
            		protein: Math.round(thisTemp.state.protein + food.protein),
            		fat: Math.round(thisTemp.state.fat + food.fat),
            		fiber: Math.round(thisTemp.state.fiber + food.fiber)
            	})
            }
        });


        // fetch("http://nutriscan.appspot.com/get-diet-by-userid", {
        //     mode: "cors",
        //     method: "POST",
        //     headers: {"Content-Type": "application/json"},
        //     body: JSON.stringify({UserID: userId})
        // }).then(function(response) {
        //     return response.json();
        // }).then(function(diet) {
        //     thisTemp.state({
        //         diet: diet
        //     });
        // });

        setTimeout(function() {
        	thisTemp.setState({
        		showData: true
        	});
        }, 800);
    }

	render() {
		const calPct = Math.round(this.state.cals/this.state.calLimit * 100);
		var calStyle = {
			backgroundSize: calPct + '% 100%, 100% 100%'
		};
		const carbPct = Math.round(this.state.carbs/this.state.carbLimit * 100);
		var carbStyle = {
			backgroundSize: carbPct + '% 100%, 100% 100%'
		};
		const proteinPct = Math.round(this.state.protein/this.state.proteinLimit * 100);
		var proteinStyle = {
			backgroundSize: proteinPct + '% 100%, 100% 100%'
		};
		const fatPct = Math.round(this.state.fat/this.state.fatLimit * 100);
		var fatStyle = {
			backgroundSize: fatPct + '% 100%, 100% 100%'
		};
		const fiberPct = Math.round(this.state.fiber/this.state.fiberLimit * 100);
		var fiberStyle = {
			backgroundSize: fiberPct + '% 100%, 100% 100%'
		};

		return (
          <main className = "primary">
	          <section className = "main">
	          	<article>
		          	<div className = {this.state.showData ? "analytics-container show" : "analytics-container"}>
		          		<header>
		          			<span className = "heading">{this.state.name}</span>
		          		</header>

		          		<div className = "content">
		                    <div>Username: User001</div>
		                    <div>Diet: {this.state.diet}</div><br />

				          	<div className = "data-point">
				          		<span className = "data-heading">Calories Consumed/Calorie Limit: </span>
				          		<span className = "data-number">{this.state.cals}/{this.state.calLimit} Cal</span>
				          		<div className = "data-bar" style = {calStyle}></div>
				          		<span className = "data-number">{calPct}% DV</span>
				          	</div>
				          	<div className = "data-point">
				          		<span className = "data-heading">Carbs Consumed/Carb Limit: </span>
				          		<span className = "data-number">{this.state.carbs}/{this.state.carbLimit} g</span>
				          		<div className = "data-bar" style = {carbStyle}></div>
				          		<span className = "data-number">{carbPct}% DV</span>
				          	</div>
				          	<div className = "data-point">
				          		<span className = "data-heading">Proteins Consumed/Protein Limit: </span>
				          		<span className = "data-number">{this.state.protein}/{this.state.proteinLimit} g</span>
				          		<div className = "data-bar" style = {proteinStyle}></div>
				          		<span className = "data-number">{proteinPct}% DV</span>
				          	</div>
				          	<div className = "data-point">
				          		<span className = "data-heading">Fats Consumed/Fat Limit: </span>
				          		<span className = "data-number">{this.state.fat}/{this.state.fatLimit} g</span>
				          		<div className = "data-bar" style = {fatStyle}></div>
				          		<span className = "data-number">{fatPct}% DV</span>
				          	</div>
				          	<div className = "data-point">
				          		<span className = "data-heading">Fiber Consumed/Fiber Limit: </span>
				          		<span className = "data-number">{this.state.fiber}/{this.state.fiberLimit} g</span>
				          		<div className = "data-bar" style = {fiberStyle}></div>
				          		<span className = "data-number">{fiberPct}% DV</span>
				          	</div><br />

				          	<div className = "food-list">
				          		<span className = "subheading">Past Eaten Foods</span>
				          		{this.state.foodEatenNodes}
				          	</div>
	                    </div>
                    </div>
	          	</article>
          	</section>
          </main>
		);
	}
}

export default AccountPage;