import React from 'react';
import Tree from 'react-d3-tree';
import './App.css';

// function recObj()
//   {
//   this.attributes = {};
//   this.children = [];
//   this.name = null;
//   }

// function fib(a,args)
//   {
//   var obj = new recObj();
//   for(var i = 0 ; i<arguments.length-1 ; i++)
//     obj.attributes[arguments[arguments.length-1][i]] = arguments[i];

//   if(a === 0 || a === 1){

//     obj.name = a;
//     return {
//       tree : obj,
//       res : a
//     }
//   }

//   var resA = fib(a-1,args);
//   var resB = fib(a-2,args);

//   obj.children.push(resA.tree)
//   obj.children.push(resB.tree)
//   obj.name = resA.res + resB.res;
//     return {
//       tree : obj,
//       res : resA.res + resB.res
//     }
//   }

// const data = [fib(5,["val"]).tree,];
// console.log(fib)

// console.log(data[0].tree)

function Row({elements, pivot, selected}){
  for(var i = 0 ; i<elements.length ; i++){
    if(Number.isNaN(elements[i]))
      return <p>Incorrect input detected.</p>
  }

  var list = elements.map((cur,index) => {
    var classs = "element";
    if(selected !== null && index === selected[0])
    classs = "element" + " blue-first";
    if(selected !== null &&  index === selected[1])
    classs = "element" + " blue-second";
    if(pivot !== null && index === pivot)
      classs = "element" + " green";

    return (<div className={classs}>
        <h3>{cur}</h3>
    </div>);
  })

  return (
  <div className='rowList'>
    {list}
  </div>
  );
}

class App extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      array : []
    }
  // this.handleArr = this.handleArr.bind(this);
  this.arrayVal = React.createRef();
  this.sort = this.sort.bind(this);
  this.bSort = this.bSort.bind(this);
  this.setPiv = this.setPiv.bind(this);
  this.setCur = this.setCur.bind(this);
  }

  setPiv(i){
  this.setState({
    pivot : i,
  })
  }

  setCur(a,b){
    this.setState({
      current : [a,b],
    })
  }

  bSort(i,j){
    this.setPiv(i);
    
    if(i == 0)
    return new Promise((res,rej) => {
      res(0);
    });

    
    if(j < i)
    {
      this.setCur(j,j+1);

      return new Promise((res,rej) => {
        setTimeout(
        () => {
          this.setState((s,props) => {
            var ns = [...s.array]
            if(ns[j] > ns[j+1])
                {
                var t = ns[j+1];
                ns[j+1] = ns[j];
                ns[j] = t;
                }
            return {
              array : ns
            }
          },
              () => {
                setTimeout(
                  () => {
                    this.bSort(i,j+1).then(resolve => {
                      res(resolve)
                    })
                  }
                  ,500);
              }
          );
         
        }
        ,750);
      })

      }
      
    else if(j == i)
      {
        return new Promise((res,rej) => {
          setTimeout(
            () => {
              this.bSort(i-1,0,0).then(resolve => {
                res(resolve)
              })
            }
            ,750);
        })
      }
  }

  sort(){
    this.setState((s,p) => {
      return {
        array : this.arrayVal.current.value.split(",").map(cur => parseInt(cur,10)),
        sorting : true,
        pivot : null,
        current : null,
      }
    }, 
    
    () => {
      
        this.bSort(this.state.array.length-1, 0, 0).then(resolve => {
          console.log(resolve)
          console.log("OFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
          this.setState({
            sorting : false,
          })
        })
    }

    )

  }

  render(){

      return (
        <React.Fragment>
          <div>hi</div>
          <input disabled={this.state.sorting} placeholder="enter array elements seperated by ',' only." type='textarea' ref={this.arrayVal}/>
          <select>
            <option>Bubble Sort</option>
            <option>Selection Sort</option>
            <option>Insertion Sort</option>
            <option>Merge Sort</option>
            <option>Quick Sort</option>
          </select>
          {this.state.sorting ? <p>SORTING...</p> : null}
          <button disabled={this.state.sorting} onClick={this.sort}>
            Sort
          </button>
          <Row pivot={this.state.pivot} selected={this.state.current} style={{margin:"50px"}} elements={this.state.array}/>
        </React.Fragment>
      );

  }

}

export default App;
