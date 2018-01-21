import axios from 'axios';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash'
import React, { Component } from 'react'
import { Search, Grid, Header } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';

class SearchBar extends Component {
  //retrieve data using ajax call
  //parse names into title format

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      clickedName: ''
    }
  }

  componentWillMount() {
    this.resetComponent()
  }

  componentDidMount() {
    this.getAllUsers();
  }

  getAllUsers() {
    var user = this.state.username;
    axios.get(`/api/search/users`)
    .then((response) => {
      let searchNames = response.data.map(function(user){
        return { 
            "title": user.first_name + ' ' + user.last_name,
            "description": user.username
        }
      });
      this.setState({
        source: searchNames
      });
    })
    .catch((error) => {
      console.log(error);
    }); 
  }

  resetComponent() {
    this.setState({ isLoading: false, results: [], value: '' })
  }

  handleResultSelect(e, { result }) { 
    //go to profile
    // alert(result.description)
    this.setState({
      redirect: true,
      clickedName: result.description,
      value: '',
    })
    // this.setState({ value: result.title }) 
  }

  handleSearchChange(e, { value }) {
    this.setState({ isLoading: true, value })
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)
      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
      })
    }, 500)
  }

  render() {
    const { isLoading, value, results, source, clickedName } = this.state
    const profileUrl = `/profile/${clickedName}`;

    if (this.state.redirect) {
      return (
      <div className="search-input">
        <Search
          size='large'
          loading={isLoading}
          onResultSelect={this.handleResultSelect.bind(this)}
          onSearchChange={this.handleSearchChange.bind(this)}
          results={results}
          value={value}
          // {...this.props}
        />
        <Redirect to={profileUrl} />
      </div>
      );
      // invoke redirect to profile url function
    }

    return (
      <div>
          <Search
            size='large'
            loading={isLoading}
            onResultSelect={this.handleResultSelect.bind(this)}
            onSearchChange={this.handleSearchChange.bind(this)}
            results={results}
            value={value}
            className="search-input"
            // {...this.props}
          />
      </div>
    )
  }
}


export default SearchBar;
