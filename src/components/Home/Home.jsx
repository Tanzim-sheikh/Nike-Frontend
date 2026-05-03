import React from "react";
import ShoeSlider from "../Home/ShoeSlider";
import Product from "../Home/Product";
import Features from "../Home/Features";
import ShopBySports from "../Home/ShopBySports";
import ShopByIcon from "../Home/ShopByIcon";
import Footer from "../Home/Footer";
import Header from "../Home/Header";

const Home = () => {
    return (
        <>
            <Header/>
            <ShoeSlider/>
            <Product />
            <Features/>
            <ShopBySports/>
            <ShopByIcon/>
            <Footer/>
        </>
    );
};

export default Home;
