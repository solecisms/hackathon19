import React, { Component } from "react";
import './App.css';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles';


const url = "http://localhost:5000/recipe";

const styles = {
    logo: {
      height: "30%",
      width: "30%",
      paddingTop: '20%', // 16:9,
      objectFit: "fit",
      textAlign: "centered",
      margin: "auto"
  },
    ratings: {
      height: "30%",
      width: "30%",
      paddingTop: '20%', // 16:9,
      objectFit: "fit",
      margin: "auto",
      float: "right"
    }
};

class App extends Component {
    constructor(props) {
    super(props);
    this.state = {
      StockCode: "",
      July: null,
      number: 0,
      canClick: false,
      text: ""
    };
  }
  HandleText = (e) =>{
      console.log(e.target.value)
      this.setState({text:e.target.value})
  }

  Search = () => {
      this.state.canClick = true
      fetch("https://fishbase.ropensci.org/comnames?ComName=" + this.state.text)
          .then(res => res.json())
          .then(
            (result) => {
                console.log(result)
                fetch("https://fishbase.ropensci.org/spawning?StockCode=" + result.data[0].StockCode.toString())
                    .then(res => res.json())
                    .then(
                      (result) => {
                          console.log(result)
                        this.setState({
                          July: result.data[0].Jul
                        });
                      },
                      // Note: it's important to handle errors here
                      // instead of a catch() block so that we don't swallow
                      // exceptions from actual bugs in components.
                      (error) => {
                        this.setState({
                          isLoaded: true,
                          error
                        });
                      }
                    )
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
}

    render(){
        let score;
        if (this.state.canClick) {
          score = <div style={{fontSize: "100px"}}>
            {this.state.July != null && <Card>
                <CardMedia
                  image={require('./pictures/sad.jpg')}
                  style={styles.ratings}
                />
                No Feesh
            </Card>}
            {this.state.July == null && <Card>
                <CardMedia
                  image={require('./pictures/happy.jpg')}
                  style={styles.ratings}
                />
                Go Feesh
            </Card>}
          </div>;
        } else {
          score = <div/>
        }
        return (
          <div className="App">
              <Card>
                  <CardMedia
                    image={require('./pictures/fish.jpg')}
                    title="Contemplative Reptile"
                    style={styles.logo}
                  />
              </Card>
              <br/>
              <br/>
              <TextField
                  style={{width: "80%"}}
                  variant="outlined"
                  label="Enter Type of Fish"
                  onChange={this.HandleText}
              />
              <br/>
              <Button onClick={this.Search} variant="contained">
                  Search
              </Button>
              <br/>
              <br/>
            {score}
          </div>
        );
    }
}

export default App;
