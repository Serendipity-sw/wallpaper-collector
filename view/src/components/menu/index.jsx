import React from 'react';
import style from './index.pcss'
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
                </ul>
            </div>
        );
    }
}

export default Menu;