import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AccountPage from './pages/AccountPage';

import Logo from './assets/images/logo.png';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNav: false,
      activeNav: 'home'
    };
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav(showNav, activeNav) {
    this.setState({
      showNav: showNav,
      activeNav: activeNav
    });
  }

  render() {
    return (
      <div className = "wrapper">
        <Router>
          <header className = "primary">
            <nav>
              <span className = "heading"><Link className = "nav-link" to = "/" onClick = {() => this.toggleNav(false, "home")}><img src = {Logo}/></Link></span>

              <ul className = {this.state.showNav ? "nav-buttons links show" : "nav-buttons links"}>
                <li><Link className = {this.state.activeNav == "home" ? "nav-link active" : "nav-link"} to = "/" onClick = {() => this.toggleNav(false, "home")}>HOME</Link></li>
                <li><Link className = {this.state.activeNav == "about" ? "nav-link active" : "nav-link"} to = "/about" onClick = {() => this.toggleNav(false, "about")}>ABOUT</Link></li>
                <li><Link className = {this.state.activeNav == "account" ? "nav-link active" : "nav-link"} to = "/account" onClick = {() => this.toggleNav(false, "account")}>ACCOUNT</Link></li>
              </ul>
              
              <a className = {this.state.showNav ? "menu-icon active" : "menu-icon"} onClick = {() => this.toggleNav(!this.state.showNav, this.state.activeNav)}>
                  <div className = "menu-icon-div"></div>
                  <div className = "menu-icon-div"></div>
                  <div className = "menu-icon-div"></div>
              </a>
            </nav>
          </header>

          <Route path = "/" exact render = {() => <HomePage />} />
          <Route path = "/about" exact render = {() => <AboutPage />} />
          <Route path = "/account" exact render = {() => <AccountPage />} />

          <footer className = "primary">
            <section className = "main">
              <article>
                <header>
                  <span className = "heading"><Link className = "nav-link" to = "/" onClick = {() => this.toggleNav(false, "home")}>NutriScan</Link></span>
                </header>

                <div className = "content">
                  <span className = "links">
                    <Link className = "nav-link active" to = "/" onClick = {() => this.toggleNav(false, "home")}>Home</Link>
                    <Link className = "nav-link" to = "/about" onClick = {() => this.toggleNav(false, "about")}>About</Link>
                    <Link className = "nav-link" to = "/account" onClick = {() => this.toggleNav(false, "account")}>Account</Link>
                  </span>
                </div>
                    
                <footer>
                    <span>{'\u00A9'} NutriScan Co.</span>
                </footer>
              </article>
            </section>
          </footer>
        </Router>
      </div>
    );
  }
}

export default App;
