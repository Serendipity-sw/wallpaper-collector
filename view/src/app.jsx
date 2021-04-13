import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import Router from '@/router/index';
import './app.pcss';
import 'antd/dist/antd.css'
import 'react-photo-view/dist/index.css';


const store = createStore(rootReducer, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
));
ReactDOM.render([
    <Provider key="store" store={store}>
        <Router/>
    </Provider>
], document.getElementById('root'));
