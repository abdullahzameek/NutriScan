import React from 'react';

class AccountPage extends React.Component {
	constructor(props) {
		super(props)
        this.state = {
        	showData: false,
            name: "John Smith",
            cals: 1000,
            calLimit: 2000,
			diet: "Paleo",
            foodEaten: []
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
            }
        }));
        var macrosObject = new Object();
        macrosObject.protein = foodJson[food]["Protein"];
        macrosObject.fat = foodJson[food]["Total lipid (fat)"];
        macrosObject.carbs = foodJson[food]["Carbohydrate, by difference"];
        macrosObject.fiber = foodJson[food]["Fiber, total dietary"];
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
	                    </div>
                    </div>
	          	</article>
          	</section>
          </main>
		);
	}
}

export default AccountPage;