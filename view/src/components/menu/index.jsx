import React from 'react';
import './index.pcss'
import style from './index.pcss.json'
import {NavLink} from "react-router-dom";

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={style.init}>
                <ul className={style.menuArea}>
                    <li>
                        <NavLink to="/" className={style.menu} activeClassName={style.selected} exact>
                            <span>WallHaven</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/home" className={style.menu} activeClassName={style.selected} exact>
                            <span>COS</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/home" className={style.menu} activeClassName={style.selected} exact>
                            <span>二次元</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Menu;