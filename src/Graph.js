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

export default class Graph extends React.Component{

    constructor(props){
        super(props);
        let t = [], b = [];
        for(let i = 0 ; i<50 ; i++)
            t.push(0);
        
        for(let i = 0 ; i<20 ; i++){
            b.push([...t]);
        }
        this.state = {board : b};
        this.vis = JSON.parse(JSON.stringify(this.state.board));
        this.vis[0][0] = 2;
        this.vis[19][49] = 2;
        this.stack = [];
        this.n = 50;
        this.m = 20;
        this.timer = 50;
        this.toggleState = this.toggleState.bind(this);
    }

    check(i,j){
        // console.log('CHECKING',this);
        // console.log(i,j);
        let cond = false;
        if((i + j) === 0)
            cond = true;
        else 
            cond = (i>=0 && j>=0 && i<this.m && j<this.n && this.vis[i][j] === 0);
        return (i>=0 && j>=0 && i<this.m && j<this.n && this.state.board[i][j] === 0 && cond);
    }

    pushChildren(i,j){
        let xd = [-1,1,0,0];
        let yd = [0,0,1,-1];
        let swaps = [], perm = [0,1,2,3];
        for(let i = 0 ; i<100 ; i++){
            swaps.push([Math.floor(Math.random()*3),Math.floor(Math.random()*3)])
        }
        for(let i = 0 ; i<100 ; i++)
            {
            let t = perm[swaps[i][0]];
            perm[swaps[i][0]] = perm[swaps[i][1]];
            perm[swaps[i][1]] = t;
            }
        for(let k = 0 ; k<4 ; k++){
            if(this.check(xd[perm[k]] + i, yd[perm[k]] + j)){
                this.stack.push([xd[perm[k]] + i, yd[perm[k]] + j, i, j]);
            }
        }
    // console.log('pushed', this.stack);
    }

    dfs(found){
        // console.log('dsfing...');
        let [x,y,parx,pary] = this.stack[this.stack.length - 1];
        if(found === true){
            while(this.vis[x][y] !== 2){
                this.stack.pop();
                x = this.stack[this.stack.length - 1][0];
                y = this.stack[this.stack.length - 1][1];
                parx = this.stack[this.stack.length - 1][2];
                pary = this.stack[this.stack.length - 1][3];
            }
        }
        if(this.vis[x][y] === 1){
            this.stack.pop();

            this.setState((s) => {
                let t = JSON.parse(JSON.stringify(s.board));
                t[x][y] = 0;
                return {board : t};
            }, () => {
                setTimeout(() => {
                    this.dfs(found);
                }, this.timer);
            })

        } else if(this.vis[x][y] === 2 && (x+y > 0)){
            this.stack.pop();
            this.vis[parx][pary] = 2;
            this.setState((s) => {
                let t = JSON.parse(JSON.stringify(s.board));
                t[x][y] = 3;
                return {board : t};
            }, () => {
                setTimeout(() => {
                    this.dfs(true);
                }, this.timer);
            })
        }else if(this.check(x,y)){
            //push children to stack.
            // let that = this;
            this.pushChildren(x,y);
            this.vis[x][y] = 1;
            this.setState((s) => {
                let t = JSON.parse(JSON.stringify(s.board));
                t[x][y] = 2;
                return {board : t};
            }, () => {
                setTimeout(() => {
                    this.dfs(found);
                }, this.timer);
            })
        }
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
            <h1>DFS</h1>
            <Matrix data={this.state.board} handleDrag={(e) => {this.toggleState(e)}}/>
            <button onClick={() => {
                // console.log(this.stack);
                this.stack.push([0,0,-1,-1]);
                // console.log(this.stack);
                this.dfs(false);
            }}>start</button>
        </>)
    }

}