import './main.scss';

// import example from './images/example.svg'

// import * as _ from 'lodash';






// Create a class property without a constructor
class Game {
    name = 'Violin Charades'
  }
  const myGame = new Game()
  // Create paragraph node
  const p = document.createElement('p')
  p.textContent = `I like ${myGame.name}.`

function component() {
    const element = document.createElement('div');

    // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.innerHTML = 'Hello'

    return element;
}

document.body.appendChild(component());


// Create heading node
const heading = document.createElement('h1')
heading.textContent = 'Interesting!'

// Append heading node to the DOM
const app = document.querySelector('#root')!
app.append(heading)