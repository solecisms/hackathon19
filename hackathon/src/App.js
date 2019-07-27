import React, { Component } from "react";
import './App.css';
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Image from 'material-ui-image';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const ap = "https://biocache-ws.ala.org.au/ws/occurrences/search?q=";

const ScoreTotal = withStyles(theme =>({
  root: {
  },
}))(CircularProgress);

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
            if(occ >= 20000);
            else{
                score -= ((20000 - occ)/20000) * 50;
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

        if (this.state.hasClicked) {
            score = this.calcScore(this.state.userType,this.state.July,test);
            score = score.toFixed(2);
          infoSection = <div style={{fontSize: "20px"}}>
          <p id="info">{this.state.fish}<br/>
          {document.getElementById("info").scrollIntoView()}
          Score: {score}</p>
          <ScoreTotal variant = "static" value = {score} color = "secondary"/>

          {this.state.userType === 1 && <p>
              There have been {test} recorded occurrences in Australia </p>


          }
          {this.state.userType !== 1 && <p>
              There have been {test} recorded occurrences in your local area</p>
          }<p>
          Your position is {latitude}, {longitude}</p>
            {score < 50 &&
                //<CardMedia
                  //image={require('./pictures/sad.jpg')}
                  //style={styles.ratings}
                ///>
                <div>Unsustainable!</div>
            }
            {score >= 50 &&
                //<CardMedia
                //  image={require('./pictures/happy.jpg')}
                //  style={styles.ratings}
                ///>
                <div>Sustainable!</div>
            }
          </div>;
        } else {
          infoSection = <div id="info"/>
        }



        return (
            <div className="App">
                <Container maxWidth="sm" style ={{width: "20%", height : "20%"}}>
                    <Image
                        src={require("./pictures/fish.jpg")}
                        //style={{width: '20%' , height: '20%'}}
                    />
                </Container>
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
                <Grid container spacing={10} justify="center">
                    <Grid item>
                        <Box>
                            <Fab onClick={this.shopperSearch} variant="extended" size="large">
                                I am a shopper
                            </Fab>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box>
                            <Fab onClick={this.fisherSearch} variant="extended" size="large">
                                I am a fisher
                            </Fab>
                        </Box>
                    </Grid>
                </Grid>
                <br/>
                <br/>
                {infoSection}
            </div>
        );
    }
}

export default App;
