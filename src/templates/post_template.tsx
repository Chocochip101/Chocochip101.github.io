import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import BaseLayout from 'layout/BaseLayout';
import PostLayout from 'layout/PostLayout';
import ContentHead from 'components/Detail/ContentHead';
import ContentBody from 'components/Detail/ContentBody';
import CommentWidget from 'components/Detail/CommentWidget';
import TOC from 'components/Detail/TOC';
import { graphql } from 'gatsby';

const ContentWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 50px; /* 간격 증가로 TOC 오른쪽 이동 */
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 20px; /* 모바일에서 간격 줄임 */
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

const PostTemplate: FunctionComponent<PostTemplateProps> = function ({
                                                                         path,
                                                                         data,
                                                                         location,
                                                                     }: PostTemplateProps) {
    const {
        node: {
            html,
            frontmatter: {
                title,
                summary,
                date,
                tags,
                thumbnail: {
                    childImageSharp: { gatsbyImageData },
                    publicURL,
                },
            },
        },
    } = data.allMarkdownRemark.edges[0];

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
                <ContentHead title={title} date={date} thumbnail={gatsbyImageData} />
                <ContentWrapper>
                    <MainContent>
                        <ContentBody html={html} thumbnail={gatsbyImageData} />
                    </MainContent>
                    <TOC html={html} />
                </ContentWrapper>
                <CommentWidget /> {/* CommentWidget를 ContentWrapper 밖으로 이동 */}
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