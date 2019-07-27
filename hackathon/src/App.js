import React, { Component } from "react";
import './App.css';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles';


const ap = "https://biocache-ws.ala.org.au/ws/occurrences/search?q=";

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
      text: "",
     occurrences: null,
     lat : null,
     long : null,
    };
  }
  myFetch(){

      fetch(ap+this.state.text+"&lat="+this.state.lat+"&lon="+this.state.long+"&radius=9000000")
         .then((response) => response.json())

         .then((res) =>
               {console.log(res.totalRecords)
                console.log(res)
               this.setState({occurrences: res.totalRecords})})
   }
  HandleText = (e) =>{
      console.log(e.target.value)
      this.setState({text:e.target.value})
  }

  componentWillMount() {
        if(navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(position => {
                      console.log(position.coords);
                      this.setState({lat : position.coords.latitude})
                      this.setState({long : position.coords.longitude})
                      });
              } else {
                  console.error("Geolocation is not supported by this browser!");
          }

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
                        this.myFetch();
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
        let test = this.state.occurrences;
        let latitude = this.state.lat;
        let longitude = this.state.long;
        let score;
        if (this.state.canClick) {
          score = <div style={{fontSize: "50px"}}>
          <p>There are {test} {this.state.text} in Australia<br/>You are at {latitude}, {longitude}<br/> I am coming for you</p>
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
