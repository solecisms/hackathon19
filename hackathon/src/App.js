import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});


function App() {
    const classes = useStyles();

    const styles = {
    media: {
      height: "20%",
      width: "20%",
      paddingTop: '20%', // 16:9,
      objectFit: "fit",
      textAlign: "centered",
      margin: "auto"
    }

  };

  return (
    <div className="App">
        <Card>
            <CardMedia
              className={classes.media}
              image={require('./pictures/fish.jpg')}
              title="Contemplative Reptile"
              style={styles.media}
            />
        </Card>
        <TextField
            fullWidth
            variant="outlined"
            label="Enter Type of Fish"
        />
        <Button variant="contained">
            Search
        </Button>
    </div>
  );
}

export default App;
