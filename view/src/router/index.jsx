import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import './index.pcss'
import style from './index.pcss.json'
import Home from "../page/home";

class Router extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HashRouter>
                <div className={style.init}>
                    <Route exact path="/" component={Home}/>
                </div>
            </HashRouter>
        );
    }
}

export default Router;