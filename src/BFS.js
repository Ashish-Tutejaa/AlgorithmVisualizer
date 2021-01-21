import React from 'react'

function Matrix({data,handleDrag}){
    return <table>
            <tbody>
            {
                data.map((ele,i) => {
                    return <tr key={i}>{
                        ele.map((one,j) => {
                            let name = " ";
                            if(one === 0)
                                name = name + "white";
                            else if(one === 1) 
                                name = name + "gray";
                            else if(one === 2)
                                name = name + "green";
                            else if(one === 3)
                                name = name + "golden";
                            
                            if(i+j === 0)
                                name = name + ' start';
                            if(i === data.length - 1 && j === ele.length - 1)  
                                name = name + ' end';

                            return <td key={100*i + j} onClick={handleDrag} id={`${i},${j}`}className={name}>{
                            }</td>
                        })
                    }</tr>
                })
            }
            </tbody>
        </table>
}

export default class BFS extends React.Component{

    constructor(props){
        super(props);
        let t = [], b = [], vis = [], vt = [];
        for(let i = 0 ; i<50 ; i++){
            t.push(0);
            vt.push([]);
        }
        
        for(let i = 0 ; i<20 ; i++){
            b.push([...t]);
            vis.push([...vt]);
        }
        this.state = {board : b};
        this.vis = vis;
        this.stack = [];
        this.n = 50;
        this.m = 20;
        this.timer = 100;
        this.toggleState = this.toggleState.bind(this);
    }

    check(i,j){
        return (i>=0 && j>=0 && i<this.m && j<this.n && this.state.board[i][j] === 0 && this.vis[i][j].length === 0);
    }

    pushChildren(i,j){
        console.log('pushhh')
        let xd = [-1,1,0,0];
        let yd = [0,0,1,-1];
        for(let k = 0 ; k<4 ; k++){
            if(this.check(xd[k] + i, yd[k] + j)){
                this.stack.push([xd[k] + i, yd[k] + j]);
                console.log('actual push', xd[k] + i, yd[k] + j);
                this.vis[xd[k] + i][ yd[k] + j] = [i,j];
            }
        }
    // console.log('pushed', this.stack);
    }

    bfs(found,par){
        if(found){
            //continue backtrac
            let [x,y] = par;
            if(x === 0 && y === 0)
            return;
            else {
                this.setState((s) => {
                    let t = JSON.parse(JSON.stringify(s.board));
                    t[x][y] = 3;
                    return {board : t};
                }, () => {
                    setTimeout(() => {
                        this.bfs(true,this.vis[x][y]);
                    }, this.timer);
                })
            }
        return;
        }

        let [x,y] = this.stack[0];
        this.stack.shift();


        if(x === 19 && y === 49){
           //backtrack
           this.setState((s) => {
                let t = JSON.parse(JSON.stringify(s.board));
                t[x][y] = 3;
                return {board : t};
            }, () => {
                setTimeout(() => {
                    this.bfs(true,this.vis[x][y]);
                }, this.timer);
            })
            return;
        }
            //push children to stack.
            // let that = this;
            this.pushChildren(x,y);
            this.setState((s) => {
                let t = JSON.parse(JSON.stringify(s.board));
                t[x][y] = 2;
                return {board : t};
            }, () => {
                setTimeout(() => {
                    this.bfs(found);
                }, this.timer);
            })
        
    }

    toggleState(e){
        // console.log('idhar');
        let [x,y] = e.target.id.split(",").map(ele => parseInt(ele,10));
        if(x + y === 0)
            return;
        if(x === this.n - 1 && y === this.m - 1)
            return;  
        // console.log(x,y);
        this.setState((s) => {
            let t = JSON.parse(JSON.stringify(s.board));
            t[x][y] = (t[x][y] === 1 ? 0 : 1);
            return {board : t}
        })
    }

    render(){
        return (<>
            <h1>BFS</h1>
            <Matrix data={this.state.board} handleDrag={(e) => {this.toggleState(e)}}/>
            <button onClick={() => {
                // console.log(this.stack);
                this.stack.push([0,0]);
                // console.log(this.stack);
                this.bfs(false);
            }}>start</button>
        </>)
    }

}