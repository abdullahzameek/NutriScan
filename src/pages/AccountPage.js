import React from 'react';

class AccountPage extends React.Component {
	constructor(props) {
		super(props)
        this.state = {
            name: "",
            calorieLimit: "",
            currentCalories: "",
			diet: ""
		};

	}
    
    componentDidMount() {
        var userId = "User001";
        var thisTemp = this;
        fetch("http://nutriscan.appspot.com/get-name-by-userid", {
            mode: "cors",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({UserID: userId})
        }).then(function(response) {
            return response.json();
        }).then(function(name) {
            alert(name);
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
        }).then(function(calories) {
            thisTemp.setState({
                currentCalories: calories
            });
        });
        fetch("http://nutriscan.appspot.com/get-calorie-limit-by-userid", {
            mode: "cors",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({UserID: userId})
        }).then(function(response) {
            return response.json();
        }).then(function(calorieLimit) {
            thisTemp.state({
                calorieLimit: calorieLimit
            });
        });
        fetch("http://nutriscan.appspot.com/get-diet-by-userid", {
            mode: "cors",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({UserID: userId})
        }).then(function(response) {
            return response.json();
        }).then(function(diet) {
            thisTemp.state({
                diet: diet
            });
        });
    }

	render() {
		return (
          <main className = "primary">
	          <section className = "main">
	          	<article>
	          		<br />
	          		<br />
	          		<br />
	          		<br />
	          		<br />
	          		Accoutn JERMO SUCC
                    <div>Username: User001</div>
                    <div>Name: {this.state.name}</div>
                    <div>Current Calories: {this.state.currentCalories}</div>
                    <div>Calorie Limit: {this.state.calorieLimit}</div>
                    <div>Diet: {this.state.diet}</div>
	          	</article>
          	</section>
          </main>
		);
	}
}

export default AccountPage;