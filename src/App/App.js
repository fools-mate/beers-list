import React, { Component } from 'react';
import { fetchDataFromServer } from '../lib/api';
import './App.css';
import BeerModal from './Components/BeerModal';

class App extends Component {
  state = {
    currentPage: 1,
    numberOfPages: 0,
    beers: [],
    selectedBeer: null,
  };

  componentDidMount() {
    this.fetchBeers(this.state.currentPage);
  }

  fetchBeers(page) {
    fetchDataFromServer(page)
      .then(response =>
        this.setState({
          numberOfPages: response.numberOfPages,
          beers: response.data,
        })
      )
      .catch(e => {
        // Ignore
      });
  }

  handleChangePage = direction => {
    const newPage = this.state.currentPage + direction;

    if (newPage <= 0 || newPage > this.state.numberOfPages) {
      return;
    }

    this.setState({ currentPage: newPage });
    this.fetchBeers(newPage);
  };

  handleToggleModal = beer => {
    this.setState({
      selectedBeer: beer,
    });
  };

  render() {
    return (
      <div className="App">
        <BeerModal
          toggleModal={() => this.handleToggleModal(null)}
          beer={this.state.selectedBeer}
        />
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Alcohol</th>
              <th>Bitterness</th>
            </tr>
          </thead>
          <tbody>
            {this.state.beers.map(beer => (
              <tr
                key={beer.id}
                onClick={() => {
                  this.handleToggleModal(beer);
                }}
              >
                <td>{beer.nameDisplay}</td>
                <td>{beer.abv ? beer.abv + '%' : null}</td>
                <td>{beer.ibu}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          {this.state.currentPage} of {this.state.numberOfPages} pages
        </p>
        <ul className="pagination">
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => this.handleChangePage(-1)}
            >
              Previous Page
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => this.handleChangePage(1)}
            >
              Next Page
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default App;
