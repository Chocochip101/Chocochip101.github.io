import React, {useEffect, useState} from 'react';
import styled from '@emotion/styled';

const TOCWrapper = styled.div`
    position: sticky;
    top: 11rem;
    width: 10rem;
    max-height: calc(100vh - 140px);
    overflow-y: auto;
    padding: 10px;
    background-color: #ffffff;
    border-left: 1px solid #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    @media (max-width: 1024px) {
        width: 200px;
    }

    @media (max-width: 768px) {
        position: static;
        width: 100%;
        max-height: none;
        border-left: none;
        border-top: 1px solid #e0e0e0;
        padding: 15px; /* 모바일에서도 패딩 유지 */
        margin-top: 0; /* 상단 여백 제거 */
    }
`;

const TOCList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const TOCItem = styled.li<{ level: number }>`
    margin-left: ${({level}) => (level - 1) * 12}px;
    margin-bottom: 6px;
    font-size: 14px;

    @media (max-width: 768px) {
        margin-left: ${({level}) => (level - 1) * 10}px;
    }
`;

const TOCLink = styled.a<{ active?: boolean }>`
    text-decoration: none;
    color: ${({active}) => (active ? '#007bff' : '#555')};
    transition: color 0.2s ease;
    cursor: pointer;

    &:hover {
        color: #007bff;
    }

    &:visited {
        color: ${({active}) => (active ? '#007bff' : '#555')};
    }
`;

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TOCProps {
    html: string;
}

const TOC: React.FC<TOCProps> = ({html}) => {
    const [toc, setToc] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const headings = doc.querySelectorAll('h1, h2, h3');
        const tocItems: TOCItem[] = Array.from(headings).map((heading, index) => {
            const level = parseInt(heading.tagName.replace('H', ''), 10);
            const text = heading.textContent || '';
            const id =
                heading.id ||
                `${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${index}`;
            heading.id = id;
            return {id, text, level};
        });
        setToc(tocItems);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {rootMargin: '-20% 0px -80% 0px'}
        );

        tocItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [html]);

    const handleScrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const y = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({top: y, behavior: 'smooth'});
        }
    };

    return (
        <TOCWrapper>
            <TOCList>
                {toc.map((item) => (
                    <TOCItem key={item.id} level={item.level}>
                        <TOCLink
                            href={`#${item.id}`}
                            active={activeId === item.id}
                            onClick={(e) => {
                                e.preventDefault();
                                handleScrollTo(item.id);
                            }}
                        >
                            {item.text}
                        </TOCLink>
                    </TOCItem>
                ))}
            </TOCList>
        </TOCWrapper>
    );
};

export default TOC;