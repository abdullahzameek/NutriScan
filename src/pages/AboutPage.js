import React from 'react';

class AboutPage extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
          <main className = "primary">
	          <section className = "main">
	          	<article>
	          		<header>
	          			<span className = "heading">About NutriScan</span>
	          		</header>
	          	</article>
          	</section>
          </main>
		);
	}
}

export default AboutPage;