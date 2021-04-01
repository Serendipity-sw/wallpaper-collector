import React from 'react';
import './index.pcss'
import style from './index.pcss.json'
import Menu from "../../components/menu";

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Menu/>
                <div className={style.contentArea}>
                    <ul>
                        <li className={style.imgArea}>
                            <figure className={style.picture}>
                                <div className={style.img}></div>
                            </figure>
                        </li>
                        <li className={style.imgArea}>
                            <figure className={style.picture}>
                                <div className={style.img}></div>
                            </figure>
                        </li>
                        <li className={style.imgArea}>
                            <figure className={style.picture}>
                                <div className={style.img}></div>
                            </figure>
                        </li>
                        <li className={style.imgArea}>
                            <figure className={style.picture}>
                                <div className={style.img}></div>
                            </figure>
                        </li>
                        <li className={style.imgArea}>
                            <figure className={style.picture}>
                                <div className={style.img}></div>
                            </figure>
                        </li>
                        <li className={style.imgArea}>
                            <figure className={style.picture}>
                                <div className={style.img}></div>
                            </figure>
                        </li>
                        <li className={style.imgArea}>
                            <figure className={style.picture}>
                                <div className={style.img}></div>
                            </figure>
                        </li>
                        <li className={style.imgArea}>
                            <figure className={style.picture}>
                                <div className={style.img}></div>
                            </figure>
                        </li>
                        <li className={style.imgArea}>
                            <figure className={style.picture}>
                                <div className={style.img}></div>
                            </figure>
                        </li>
                        <li className={style.imgArea}>
                            <figure className={style.picture}>
                                <div className={style.img}></div>
                            </figure>
                        </li>
                    </ul>
                </div>
            </>
        );
    }
}

export default Home;