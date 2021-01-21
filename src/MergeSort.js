import { render } from '@testing-library/react';
import React, {useState, useEffect} from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import './MergeSort.css'

function m_sort(globalArr, start,end,len){
    // console.log(start,end);
    let cur = [];
    for(let i = start ; i<=end ; i++)
        cur[i] = globalArr[i];

    for(let i = 0 ; i<len ; i++){
        if(cur[i] === undefined)
            cur[i] = globalArr[i];
    }

    let me = {
        s : start,
        e : end,
        0 : [...cur],
    };  

    if(start === end || start >= end){
        me.l = me.r = null;
        me["1"] = [...cur];
        return me;
    }

    let m = Math.floor((start + end)/2);
    me.l = m_sort(globalArr, start,m,len);
    me.r = m_sort(globalArr ,m+1,end,len);

    let left = [], right = [];
    for(let i = start ; i<=m ; i++)
        left.push(globalArr[i]);
    for(let i = m+1 ; i<=end ; i++)
        right.push(globalArr[i]);

    let i,j,k; i = j = 0; k = start; 
    while(i<left.length && j<right.length){
        if(left[i] <= right[j]){
            globalArr[k] = left[i];
            i++;
        }else if(left[i] > right[j]){
            globalArr[k] = right[j];
            j++;
        }
        k++;
    }
    while(i<left.length){
        globalArr[k] = left[i];
        i++;
        k++;
    }
    while(j<right.length){
        globalArr[k] = right[j];
        j++;
        k++;
    }
    cur = [];
    for(let i = start ; i<=end ; i++)
        cur[i] = globalArr[i];
    for(let i = 0 ; i<len ; i++){
        if(cur[i] === undefined)
            cur[i] = globalArr[i];
    }
    me["1"] = [...cur];
    return me;
}

// function bfs(tree){
//     let q = [tree];
//     let res = [];
//     while(q.length !== 0){
//         console.log(JSON.parse(JSON.stringify(q)));
//         let sz = q.length, t = [], nextLayer = false;
//         for(let i = 0 ; i<sz ; i++){
//             t.push({...q[i]});
//             if(q[i].l || q[i].r)
//                 nextLayer = true;
//         } res.push([...t]);

//         for(let i = 0 ; i<sz ; i++){
//             if(q[i].l !== null)
//                 q.push({...q[i].l});
//             if(q[i].r !== null)
//                 q.push({...q[i].r});
//             if(q[i].l === null && q[i].r === q[i].l && nextLayer)
//                 q.push({...q[i]});
//             }
//         for(let i = 0 ; i<sz ; i++)
//             q.shift();
//     }
//     return res;
// }

const traverse = (tree, col, arr, count, direc) => {
    if(tree === null)
        return count;

    let mycount = count;
    for(let i = tree.s ; i<=tree.e ; i++)
        col[i] = count;
    let first = [[...tree["0"]], [...col]];

    if(direc === 'root')
        first.push(0);
    if(direc === 'left')
        first.push(1);
    else if(direc === 'right')
        first.push(2);
    arr.push(first);
    count++;
    count = traverse(tree.l, col, arr, count, 'left');
    count++;
    count = traverse(tree.r, col, arr, count, 'right');
    for(let i = tree.s ; i<=tree.e ; i++)
        col[i] = mycount;
    let second = [[...tree["1"]], [...col]];
    second.push(3);
    arr.push(second);
    return count;
} 

const ShowArray = ({dialogue, data, colors, colDict:col_getter}) => {
    // console.log(data, colors, dialogue)
    let finArr = data.reduce((acc, cur, i) => {

        if(acc.length === 0){
            acc.push([i]);
        } else {
            if(colors[acc[acc.length - 1][0]] !== colors[i]){
                acc.push([i]);
            } else {
                acc[acc.length - 1].push(i);
            }
        }

    return acc;
    }, []);

    // console.log("OVER HERE", finArr);

    // finArr = finArr.map(i => i.map(ii => data[ii]));

    // console.log(finArr);
    //    color: rgba(red, green, blue, alpha)
    const messages = ['Starting the Algorithm', 'Recursing left', 'Recursing right', 'Sorting and returning...'];
    let message = messages[dialogue];
    return <div className='body-wrap'>
            <div className='card-header'>
                <h3>{message}</h3>
            </div>
            <div className='card-body'>
                        {finArr.map(i => (
                        <div style={{backgroundColor : col_getter[colors[i[0]]]}} className='card-wrap'>
                            {i.map(ii => {

                                // console.log("IIIII: ", colors[ii], ii, data[ii], col_getter[colors[ii]]);
                                return <div  className='card-part'>
                                    <h2>{data[ii]}</h2>
                                </div>
                            })}
                        </div>
                        ))}
            </div>
        </div>
}

const Banner = () => {
    return <div className='body-wrap'>
        <h3>Please enter an array to get started!</h3>
    </div>
}

export const MergeContent = ({setValue, inputVal, array, setNewArray}) => {

    // console.log("OYEEE",array);
    let [arrays,setArrays] = useState([]);
    let [count, setCount] = useState(0);
    let [colors, setColors] = useState({});
    let [selected, setSelected] = useState(null);

    useEffect(() => {
        if(array === undefined || array === null || array.length === 0)
            return;
        let tree = m_sort([...array],0,array.length - 1, array.length);
        let col = [];
        for(let i in array)
            col.push(1);
        let renderArr = [], count = 1;
        traverse(tree, col, renderArr, count, 'root');
        setArrays(renderArr);
        // console.log(renderArr);
    },[array]);

    const change = (i) => {
        // console.log(i,count);
        if(i)
            setCount(count + 1);
        else 
            setCount(count - 1);
    }

    if(arrays.length > 0)
        {
            // console.log(arrays[count][1])
            let t = {...colors};
            let change = false;
            for(let i of arrays[count][1]){
                if(t[i] === undefined){
                    //make new color...
                    change = true;
                    // console.log("GENEREATATING NEW COLOUR FOR", i);
                    let newColor = `rgba(${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},${Math.floor(Math.random()*155)},0.75)`;
                    t[i] = newColor;
                }
            }
            if(change)
                setColors(t);
        }

    // console.log('ANOTHER ONE', arrays);

    return (
        <>
            {arrays.length > 0 ? <ShowArray dialogue={arrays[count][2]} colDict={colors} data={arrays[count][0]} colors={arrays[count][1]} /> : <Banner/>}
                <button onClick={() => {setCount(0)}}>reset</button>
                {count > 0 ? <button onClick={() => {change(0)}}>prev state</button> : <button disabled>prev state</button>}
                {count < arrays.length - 1 ? <button onClick={() => {change(1)}}>next state</button> : <button disabled>next state</button>}
                {`  `}
                <div className='inputGroup'>
                    <input placeholder='Enter a comma seperated list of integers here!' className='input' value={inputVal} onChange={(e) => {setValue(e.target.value)}}></input>
                    <button onClick={setNewArray}>enter</button>
                </div>
        
        </>
    );
} 

export const MergeSort = () => {
    let [value, setValue] = useState("");
    let [array, setArray] = useState([]);

    const setNewArray = () => {
        // console.log('OKAYYYYYYY', value);
        setArray(value.split(',').map(ele => parseInt(ele,10)));
    }

    return <MergeContent array={array} setNewArray={setNewArray} inputVal={value} setValue={setValue}/>
}