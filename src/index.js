import _ from 'lodash'
import Point from './lib'

function myCanvas() {
    //todo: testing output. Remove it later.
    const myCanva = document.createElement('canvas');
    myCanva.width = 1200;
    myCanva.height = 800;
    
    const ctx = myCanva.getContext("2d");

    const point = new Point(10, 10, 'test1');

    point.Draw(ctx);

    return myCanva;
  }
  
  document.body.appendChild(myCanvas());