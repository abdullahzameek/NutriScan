import React from 'react';

class AccountPage extends React.Component {
	constructor(props) {
		super(props)
        this.state = {
        	showData: false,
            name: "John Smith",
            cals: 1000,
            calLimit: 2000,
			diet: "Paleo"
		};
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