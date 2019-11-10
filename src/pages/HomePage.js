import React from 'react';

import FoodDataContainer from '../components/FoodDataContainer';

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showCamera: false,
			showCameraButton: true,
			showLoader: false,
			showData: false,
			cameraResSrc: '',
			foodDataNodes: []
		};
    	this.openCamera = this.openCamera.bind(this);
    	this.processPhoto = this.processPhoto.bind(this);
    	this.clickedFileInput = this.clickedFileInput.bind(this);
    	this.handleRefocus = this.handleRefocus.bind(this);
	}

	openCamera(showCamera) {
		this.setState({
			showCamera: showCamera,
			showCameraButton: !showCamera,
			showLoader: true
		});
		this.inputElement.click();
	}

	processPhoto(e) {
		const imgSrc = URL.createObjectURL(e.target.files[0]);
		const imgPath = e.target.files[0];
		var thisTemp = this
		window.removeEventListener('focus', this.handleRefocus);

		this.setState({
			showCamera: true,
			showCameraButton: false,
			foodDataNodes: []
		});

		setTimeout(function() {
			thisTemp.setState({
				cameraResSrc: imgSrc,
				showData: true,
				showLoader: false,
			});
		}, 1000);

        var reader = new FileReader();
        reader.readAsDataURL(imgPath); 

        reader.onloadend = function() {
            var base64data = reader.result;                
            var xhr = new XMLHttpRequest();

            xhr.open("GET", base64data);
            xhr.responseType = "arraybuffer";

            xhr.onload = function() {
              if (xhr.status === 200) {
                fetch("http://nutriscan.appspot.com/get-predict", {
                    mode: 'cors',
                    headers: {"Content-Type": "image/jpeg"},
                    method: 'POST',
                    body: new Uint8Array(xhr.response)
                }).then(function(response) {
                	if (!response.ok) {
	                    thisTemp.setState({
	                    	foodDataNodes: thisTemp.state.foodDataNodes.concat([<FoodDataContainer foodName = {"Unrecognized Item"} cals = {0} carbs = {0} protein = {0} fat = {0} fiber = {0} calLimit = {2000} />])
	                    });
                	}
                	return response.json();
                }).then(function(parsedJson) {
                    var foodName = parsedJson.foodName;
                    var nutritionInfo = parsedJson.calories;

                    const cals = parseFloat(nutritionInfo['Energy'].split(' ')[0]);
                    const carbs = parseFloat(nutritionInfo['Carbohydrate, by difference'].split(' ')[0]);
                    const protein = parseFloat(nutritionInfo['Protein'].split(' ')[0]);
                    const fat = parseFloat(nutritionInfo['Total lipid (fat)'].split(' ')[0]);
                    const fiber = parseFloat(nutritionInfo['Fiber, total dietary'].split(' ')[0]);
                    console.log(nutritionInfo);

                    var userId = 'User001';
                    var calLimit = 2000;

                    fetch("http://nutriscan.appspot.com/update-calories-by-userid", {
                    	mode: "cors",
                    	method: "POST",
                    	headers: {"Content-Type": "application/json"},
                    	body: JSON.stringify({UserID: userId})
                    });

                    fetch("http://nutriscan.appspot.com/get-total-calories-by-userid", {
                        mode: "cors",
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({UserID: userId})
                    }).then(function(response) {
                        return response.json();
                    }).then(function(calorieLimit) {
                        calLimit = calorieLimit;
                    });

                    thisTemp.setState({
                    	foodDataNodes: thisTemp.state.foodDataNodes.concat([<FoodDataContainer foodName = {foodName} cals = {cals} carbs = {carbs} protein = {protein} fat = {fat} fiber = {fiber} calLimit = {calLimit} />])
                    });
                });
              }
            };
            xhr.send();
        }
	}

	handleRefocus() {
		var thisTemp = this;
		setTimeout(function() {
			if (thisTemp.inputElement.files.length == 0){
				thisTemp.setState({
					showLoader: false,
					showCameraButton: true,
					showCamera: false
				});
			}
		}, 1000);
		window.removeEventListener("focus", this.handleRefocus);
	}

	clickedFileInput() {
		window.addEventListener("focus", this.handleRefocus);
	}

	render() {
		return (
          <main className = "primary">
	          <section className = "main">
	          	<article className = 'home-article'>
	          		<span className = {this.state.showCamera ? "heading hide" : "heading"}>Snap a Picture of Your Meal</span>
	          		<div className = {this.state.showCameraButton ? "camera button" : "camera button hide"} onClick = {() => this.openCamera(true)}><div>○</div></div>
	          		<div className = {this.state.showCamera ? "hide" : ""}></div>
	          		<input className = "choose-photo" ref = {input => this.inputElement = input} type = "file" accept = "image/jpeg" onClick = {this.clickedFileInput} onChange = {this.processPhoto} capture />
	          		<div className = {this.state.showLoader ? "loader" : "loader hide"}></div>
	          		<div className = {this.state.showData ? "result-container show" : "result-container"}>
	          			<img className = "camera-result" src = {this.state.cameraResSrc} />
	          			<div className = "data-container">
	          				{this.state.foodDataNodes}
	          			</div>
	          		</div>
	          		</article>
          	</section>
          </main>
		);
	}
}

export default HomePage;