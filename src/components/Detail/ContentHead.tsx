import styled from '@emotion/styled';
import React, {useState} from 'react';
import {Headline2} from 'styles/typography';
import AuthorInfo from './AuthorInfo';
import IconButton from '../Controls/IconButton';
import Tooltip from '../Controls/Tooltip';

const HeadWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding-bottom: 20px;
    margin-bottom: 20px;
`;

const ToolBar = styled.div`
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const IconBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
`;

const Margin = styled.div`
    margin-right: 8px;
`;

interface ContentHeadProps {
    title: string;
    date: string;
}

const ContentHead = ({title, date}: ContentHeadProps) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // 2초 후 원래 상태로 복귀
    };

    return (
        <HeadWrapper>
            <Headline2>{title}</Headline2>
            <ToolBar>
                <a
                    href="https://github.com/Chocochip101"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <AuthorInfo author="초코칩" date={date}/>
                </a>
                <IconBox>
                    <Tooltip tip="준비중...">
                        <IconButton
                            size="xs"
                            icon="share"
                            onClick={() => console.log('share!')}
                        />
                    </Tooltip>
                    <Margin/>
                    <Tooltip
                        width={108}
                        tip={isCopied ? "복사됨" : "클립보드로 복사"}
                        isCopied={isCopied}
                    >
                        <IconButton
                            size="xs"
                            icon="link"
                            onClick={copyToClipBoard}
                            isCopied={isCopied}
                        />
                    </Tooltip>
                </IconBox>
            </ToolBar>
        </HeadWrapper>
    );
};

export default ContentHead;