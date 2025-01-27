import React, {useState} from 'react';
import {PATH} from '../routes/path';
import SearchLayout from '../layout/SearchLayout';
import {Body, Guidance1, Guidance2, Subtitle} from '../styles/typography';
import styled from '@emotion/styled';
import {mediaQuery, theme} from '../theme';
import {TagListProps} from '../components/Post/TagMenu';
import {PostType} from '../@types/Post.types';
import {graphql, Link, navigate} from 'gatsby';

const Container = styled.div`
    max-width: 480px;
    text-align: left;

    ${mediaQuery.sm} {
        max-width: 320px;
    }
`;

const KeywordWrapper = styled.div`
    padding: 40px 0px;
`;

const KeywordBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-top: 12px;
`;

const Keyword = styled.li`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    margin: 8px 0px;
    margin-right: 16px;
    padding: 2px 12px;
    border: 1px solid ${({theme}) => theme.colors.light[300]};
    border-radius: 100px;

    :hover {
        background-color: ${({theme}) => theme.colors.primary.default};
        border: 1px solid ${({theme}) => theme.colors.primary.default};

        & p {
            color: white !important;
        }
    }
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
`;

const SearchInput = styled.input`
    flex: 1;
    height: 40px;
    padding: 0 12px;
    border: 1px solid ${({theme}) => theme.colors.light[300]};
    border-radius: 8px;
    font-size: 16px;
    color: ${({theme}) => theme.colors.dark[100]};

    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.colors.primary.default};
        box-shadow: 0 0 4px ${({theme}) => theme.colors.primary.default};
    }

    ${mediaQuery.sm} {
        font-size: 14px;
    }
`;

const SearchButton = styled.button`
    height: 40px;
    padding: 0 16px;
    background-color: ${({theme}) => theme.colors.primary.default};
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        background-color: ${({theme}) => theme.colors.primary.hover};
    }

    ${mediaQuery.sm} {
        font-size: 14px;
    }
`;

type SearchPageProps = {
    data: {
        allMarkdownRemark: {
            edges: PostType[];
        };
    };
};

const search = ({
                    data: {
                        allMarkdownRemark: {edges},
                    },
                }: SearchPageProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim() === '') return;
        navigate(`/?tag=${encodeURIComponent(searchTerm)}`);
    };

    const tagList = React.useMemo(
        () =>
            edges.reduce(
                (
                    list: TagListProps['categories'],
                    {
                        node: {
                            frontmatter: {tags},
                        },
                    }: PostType,
                ) => {
                    tags.forEach(tag => {
                        if (list[tag] === undefined) list[tag] = 1;
                        else list[tag]++;
                    });

                    list['All']++;

                    return list;
                },
                {All: 0},
            ),
        [edges],
    );

    return (
        <SearchLayout path={PATH.search}>
            <Container>
                <Guidance1>안녕하세요,</Guidance1>
                <Guidance2>무엇을 찾으시나요?</Guidance2>
                <SearchContainer>
                    <SearchInput
                        placeholder="검색어를 입력하세요"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSearch()}
                    />
                    <SearchButton onClick={handleSearch}>검색</SearchButton>
                </SearchContainer>
                <KeywordWrapper>
                    <Subtitle medium textColor={theme.colors.primary.default}>
                        추천 키워드
                    </Subtitle>
                    <KeywordBox>
                        {Object.entries(tagList).map(([key, value]) => (
                            <Link to={`/?tag=${key}`} key={key}>
                                <Keyword>
                                    <Body medium textColor={theme.colors.dark[100]}>
                                        {key} ({value})
                                    </Body>
                                </Keyword>
                            </Link>
                        ))}
                    </KeywordBox>
                </KeywordWrapper>
            </Container>
        </SearchLayout>
    );
};

export default search;

export const searchContentQuery = graphql`
  query searchContentQuery {
    allMarkdownRemark(
      sort: [{ frontmatter: { date: DESC } }, { frontmatter: { title: ASC } }]
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD")
            tags
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 700)
              }
            }
          }
        }
      }
    }
  }
`;
