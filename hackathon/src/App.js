import React, { Component } from "react";
import './App.css';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
const ap = "https://biocache-ws.ala.org.au/ws/occurrences/search?q=";

const ScoreTotal = withStyles(theme =>({
  root: {
  },
}))(CircularProgress);

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
      fish: "",
      hasClicked: false,
     occurrences: null,
     lat : null,
     long : null,
     userType: null,
    };
  }

  myLocalFetch(){
      fetch(ap+ this.state.fish.toLowerCase().replace(/ /g,"+")+"&lat="+this.state.lat+"&lon="+this.state.long+"&radius=30")
         .then((response) => response.json())

         .then((res) =>
               {//console.log(res.totalRecords)
                //console.log(res)
               this.setState({occurrences: res.totalRecords})})
   }
   myGlobalFetch(){
       fetch(ap+this.state.fish.toLowerCase().replace(/ /g,"+"))
          .then((response) => response.json())

          .then((res) =>
                {//console.log(res.totalRecords)
                 //console.log(res)
                this.setState({occurrences: res.totalRecords})})
    }
  HandleText = (e) =>{
     // console.log(e.target.value)
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

    shopperSearch = () =>{
        this.Search(1)
        this.setState({userType:1})
    }
    fisherSearch = () =>{
        this.Search(0)
        this.setState({userType:0})
    }
  Search = (num) => {
      this.setState({hasClicked: true})
      this.setState({fish: this.state.text})
      fetch("https://fishbase.ropensci.org/comnames?ComName=" + this.state.fish.toLowerCase().replace(/ /g,"+"))
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
                        if (num === 1){
                            this.myGlobalFetch()
                        } else {
                            this.myLocalFetch()
                        }
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
    calcScore(num, spawn, occ) {
        let score = 100;
        if (spawn !== 0){
            score -= 25;
        }
        if (num === 0){
            if(occ >= 300);
            else{
                score -= ((500 - occ)/500) * 50;
            }
        }
        else if (num === 1){
            if(occ >= 2500);
            else{
                score -= ((2500 - occ)/2500) * 50;
            }
        }
        return score;
        }

    render(){
        let test = this.state.occurrences;
        let latitude = this.state.lat;
        let longitude = this.state.long;
        let infoSection;
        let score;
        let popScore;


        if (this.state.hasClicked) {
            score = this.calcScore(this.state.userType,this.state.July,test);
            score = score.toFixed(2);
            if (this.state.userType === 0){
                if(test >= 300){
                    popScore = 100;
                }
                else{
                    popScore -= ((500 - test)/500) * 100;
                }
            }
            else if (this.state.userType === 1){
                if(test >= 2500){
                    popScore = 100;
                }
                else{
                    popScore -= ((2500 - test)/2500) * 100;
                }
            }
            console.log(popScore);
          infoSection = <div style={{fontSize: "50px"}}>
          <p>{this.state.fish}<br/>
          Score: {score}</p>
          <ScoreTotal variant = "static" value = {score} color = "secondary"/>

          {this.state.userType === 1 && <p>
              There are {test} in Australia </p>


          }
          {this.state.userType !== 1 && <p>
               There are {test} in your local area</p>
          }<p>
          You are at {latitude}, {longitude}</p>
            {score < 50 && <Card>
                <CardMedia
                  image={require('./pictures/sad.jpg')}
                  style={styles.ratings}
                />
                No Feesh
            </Card>}
            {score >= 50 && <Card>
                <CardMedia
                  image={require('./pictures/happy.jpg')}
                  style={styles.ratings}
                />
                Go Feesh
            </Card>}
          </div>;
        } else {
          infoSection = <div/>
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
              <br/>
              <Button onClick={this.shopperSearch} variant="contained" >
                  I am a shopper
              </Button>
              <Button onClick={this.fisherSearch} variant="contained" >
                  I am a fisher
              </Button>
              <br/>
              <br/>
            {infoSection}

          </div>
        );
    }
}

export default App;
