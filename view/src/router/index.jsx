import React from 'react';
import {HashRouter, NavLink, Route} from 'react-router-dom';
import './index.pcss'
import style from './index.pcss.json'

class Router extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HashRouter>
                <div className={style.init}>
                </div>
            </HashRouter>
        );
    }
}

export default Router;