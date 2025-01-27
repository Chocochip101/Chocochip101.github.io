import * as React from 'react';
import {graphql} from 'gatsby';
import {IGatsbyImageData} from 'gatsby-plugin-image';
import {PostType} from 'types/Post.types';
import {PATH} from '../routes/path';
import BaseLayout from 'layout/BaseLayout';
import Blog from 'components/Blog';

type ReviewsPageProps = {
    location: { search: string };
    data: {
        site: {
            siteMetadata: {
                title: string;
                description: string;
                siteUrl: string;
            };
        };
        allMarkdownRemark: {
            edges: PostType[];
        };
        file: {
            childImageSharp: {
                gatsbyImageData: IGatsbyImageData;
            };
            publicURL: string;
        };
    };
};

const ReviewPage = ({
                       location: {search},
                       data: {
                           site: {
                               siteMetadata: {title, description, siteUrl},
                           },
                           allMarkdownRemark: {edges},
                           file: {
                               childImageSharp: {gatsbyImageData},
                               publicURL,
                           },
                       },
                   }: ReviewsPageProps) => {
    const [mounted, setMounted] = React.useState<boolean>(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        mounted && (
            <BaseLayout
                path={PATH.reviews}
                meta={{title, description, url: siteUrl, image: publicURL}}
            >
                {/* Blog */}
                <Blog posts={edges} selectedTag={"후기"}/>
            </BaseLayout>
        )
    );
};

export default ReviewPage;

export const postContentQuery = graphql`
  query postContentQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMarkdownRemark(
        filter: { frontmatter: { tags: { in: ["후기"] } } }
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
    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
    }
  }
`;
