import {Global, ThemeProvider} from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import {globalStyle} from 'styles';
import Footer from 'components/Navigation/Footer';
import Header from 'components/Navigation/Header';
import {theme} from 'theme/index';
import {mediaQuery} from 'theme/breakpoints';
import {Helmet} from 'react-helmet';

const Body = styled.main`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;

    max-width: 1200px;
    width: 100%;
    min-height: calc(100vh - 80px); // minus footer height
    height: 100%;
    padding: 0px 40px;
    padding-top: 72px; // padding to header height
    margin: 0 auto;
    background-color: ${({theme}) => theme.lightTheme.backgroundColor};
    transition: all 0.5s ease-in-out;

    ${mediaQuery.sm} {
        padding: 40px 0px;
        padding-top: 72px;
    }
`;

type BaseLayoutProps = {
    path: string;
    children: React.ReactNode;
    meta?: {
        title: string;
        description: string;
        image: string;
        url: string;
    };
};

const INITIAL_META = {
    title: 'Chocochip Blog',
    description: "Chocochips Tech Blog",
    image: '/static/profile-image.jpeg',
    url: 'https://blog.chocochip.co.kr/',
};

const BaseLayout = ({path, children, meta}: BaseLayoutProps) => {
    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <html lang="ko"/>
                <title>{meta ? meta.title : INITIAL_META.title}</title>
                <meta
                    name="description"
                    content={meta ? meta.description : INITIAL_META.description}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8"/>

                <meta property="og:type" content="website"/>
                <meta
                    property="og:title"
                    content={meta ? meta.title : INITIAL_META.title}
                />
                <meta
                    property="og:description"
                    content={meta ? meta.description : INITIAL_META.description}
                />
                <meta
                    property="og:image"
                    content={meta ? meta.image : INITIAL_META.image}
                />
                <meta property="og:url" content={meta ? meta.url : INITIAL_META.url}/>
                <meta
                    property="og:site_name"
                    content={meta ? meta.title : INITIAL_META.title}
                />
                <meta
                    name="google-site-verification"
                    content="AeVWzvBApSe4tJz0xn1wSTpJBQJb-QLALeMbZ3y9yV4"
                />
            </Helmet>
            <Global styles={globalStyle}/>
            <Header path={path}/>
            <Body>{children}</Body>
            <Footer/>
        </ThemeProvider>
    );
};

export default BaseLayout;
