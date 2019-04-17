import React, {Component} from 'react';
import StarWars from './starwars';

class Starwars extends Component {
  constructor() {
    super();
    this.state = {
      starwarsChars: []
    };
  }

  componentDidMount() {
    this.getCharacters('https://swapi.co/api/people/');
  }

  getCharacters = URL => {

    fetch(URL)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ starwarsChars: data.results });
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  render() {
    return (
      <div className="starwars">
        <h1 className="Header">React Wars</h1>
        <StarWars sith={this.state.starwarsChars}/>
      </div>
    );
  }
}
export default Starwars;