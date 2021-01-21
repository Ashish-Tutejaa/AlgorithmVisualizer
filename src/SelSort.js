import React from 'react';
import './selSort.css';

function Display({elem : {pivot : piv, current : cur, array : arr, mini}})
    {
    // let {pivot : piv, current : cur, array : arr} = state.elem;
    console.log("MINI", mini);
    let elements = [];
    console.log(arr);
    for(let i = 0, j = 0 ; i<arr.length ; i++, j++)
        {
        console.log(arr[i]);
        elements.push(<div key = {j} className={(i == piv ? ('mid-p'): i == cur ? ('mid-c'): ('mid')) + (i == mini ? ' mini' : '')}>{arr[i]}</div>)
        }
    return <div className='array'>{elements}</div>
    }

export class SelSort extends React.Component
    {
    constructor(props)
        {
        super(props);
        console.log(this);
        this.state = {
            array : []
            }
        this.inputRef = React.createRef();
        this.fxn = this.fxn.bind(this);
        this.spark = this.spark.bind(this); 
        }

        spark()
            {
            console.log(this);
            this.setState((s,p) => {
                let newarr = this.inputRef.current.value.split("-").map(ele => parseInt(ele,10));
                console.log(newarr);
                return Object.assign(s,{sorting : true, array : newarr, pivot : 0, current : 1, mini : 1});
                }, () => {this.fxn(this.state.pivot,this.state.current,this.state.mini)});
            }

        fxn(piv,cur,mini)
            {
            if(piv >= this.state.array.length)
                return new Promise((res,rej) => {res(-1)});
            if(cur >= this.state.array.length)
                {
                
                return new Promise((res,rej) => {
                    setTimeout(() => {

                        this.setState((s,p) => {
                            let newarr = [...s.array];
                            if(newarr[s.pivot] > newarr[s.mini])
                                {
                                    let t = newarr[s.pivot];
                                    newarr[s.pivot] = newarr[s.mini];
                                    newarr[s.mini] = t;
                                }
                            console.log("ARR: ", newarr, {array : newarr});
                            return {array : newarr};
                        }, () => {

                            this.fxn(piv+1,piv+2,piv+1).then(cur => {res(cur)});

                        })

                    },700);

                })
                }

            if(this.state.array[cur] < this.state.array[mini])
                mini = cur;

            this.setState({pivot : piv, current : cur, mini});

            return new Promise((res,rej) => {

                setTimeout(() => {
                    this.fxn(piv,cur+1,mini).then(cur => {res(cur)});
                }, 500);


                })
            }

        render(){
            return (
                <React.Fragment>
                    <input type='textarea' placeholder='enter array with - as delimiter' ref = {this.inputRef}></input>
                    <button onClick={this.spark}>
                        Click to Sort
                    </button>
                    {this.state.sorting ? <Display elem={this.state}/> : null}
                </React.Fragment>
            );
        }
    }

    