import React, {FunctionComponent, useEffect, useState} from 'react';
import styled from '@emotion/styled';
import BaseLayout from 'layout/BaseLayout';
import PostLayout from 'layout/PostLayout';
import ContentHead from 'components/Detail/ContentHead';
import ContentBody from 'components/Detail/ContentBody';
import CommentWidget from 'components/Detail/CommentWidget';
import TOC from 'components/Detail/TOC';
import {graphql} from 'gatsby';

const ContentWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 50px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 20px;
        padding: 0 15px;
    }
`;

const MainContent = styled.div`
    flex: 1;
    max-width: 800px;
    width: 100%;

    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

type PostPageItemType = {
    node: {
        html: string;
        frontmatter: {
            title: string;
            summary: string;
            date: string;
            tags: string[];
            thumbnail: {
                childImageSharp: {
                    gatsbyImageData: any;
                };
                publicURL: string;
            };
        };
    };
};

type PostTemplateProps = {
    path: string;
    data: {
        allMarkdownRemark: {
            edges: PostPageItemType[];
        };
    };
    location: {
        href: string;
    };
};

const PostTemplate: FunctionComponent<PostTemplateProps> = ({
                                                                path,
                                                                data,
                                                                location,
                                                            }: PostTemplateProps) => {
    const {
        node: {
            html,
            frontmatter: {
                title,
                summary,
                date,
                tags,
                thumbnail: {
                    childImageSharp: {gatsbyImageData},
                    publicURL,
                },
            },
        },
    } = data.allMarkdownRemark.edges[0];

    // 화면 크기 상태 관리
    const [isMobile, setIsMobile] = useState(false);

    // 화면 크기 감지
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // 초기 실행
        handleResize();

        // 리사이즈 이벤트 리스너 추가
        window.addEventListener('resize', handleResize);

        // cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <BaseLayout
            path={'/'}
            meta={{
                title,
                description: summary,
                url: location.href,
                image: publicURL,
            }}
        >
            <PostLayout>
                <ContentHead title={title} date={date} thumbnail={gatsbyImageData}/>
                <ContentWrapper>
                    <MainContent>
                        <ContentBody html={html} thumbnail={gatsbyImageData}/>
                    </MainContent>
                    {!isMobile && <TOC html={html}/>} {/* 모바일에서는 TOC 숨김 */}
                </ContentWrapper>
                <CommentWidget/>
            </PostLayout>
        </BaseLayout>
    );
};

export default PostTemplate;

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          frontmatter {
            title
            summary
            date(formatString: "YYYY년 MM월 DD일 HH:mm")
            tags
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
              publicURL
            }
          }
        }
      }
    }
  }
`;