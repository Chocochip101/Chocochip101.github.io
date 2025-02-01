import * as React from 'react';
import styled from '@emotion/styled';
import { mediaQuery } from 'theme/breakpoints';

type IntroduceProps = {
    description: string;
};

const IntroduceContainer = styled.section`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    width: 100%;
    padding: 20px 20px;
`;

const IntroduceTitle = styled.h2`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
`;

const IntroduceText = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.lightTheme.text.light[500]};
    text-align: center;
    max-width: 600px;

    ${mediaQuery.sm} {
        padding-bottom: 60px;
    }
`;

const Introduce = ({ description }: IntroduceProps) => {
    return (
        <IntroduceContainer>
            <IntroduceTitle>About</IntroduceTitle>
            <IntroduceText>{description}</IntroduceText>
        </IntroduceContainer>
    );
};

export default Introduce;
