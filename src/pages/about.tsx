import * as React from 'react';
import {graphql} from 'gatsby';
import {IGatsbyImageData} from 'gatsby-plugin-image';
import BaseLayout from 'layout/BaseLayout';
import {PATH} from '../routes/path';
import Profile from 'components/About/Profile';
import Contact from 'components/About/Contact';
import Introduce from 'components/About/Introduce';
import Education from "components/About/Education";
import styled from "@emotion/styled";
import {mediaQuery} from "theme/breakpoints";
import WorkExperience from "components/About/WorkExperience";
import ExtraCurricular from "components/About/ExtraCurricular";

interface AboutPageProps {
    data: {
        site: {
            siteMetadata: {
                title: string;
                description: string;
                siteUrl: string;
            };
        };
        file: {
            childImageSharp: {
                gatsbyImageData: IGatsbyImageData;
            };
            publicURL: string;
        };
    };
}

const AboutPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
    
  max-width: 60%;
  width: 100%;
  padding-bottom: 100px;

  ${mediaQuery.sm} {
    padding-bottom: 60px;
  }
`;

const AboutPage = ({
                       data: {
                           site: {
                               siteMetadata: {title, description, siteUrl},
                           },
                           file: {
                               childImageSharp: {gatsbyImageData},
                               publicURL,
                           },
                       },
                   }: AboutPageProps) => {
    return (
        <BaseLayout path={PATH.about} meta={{title, description, url: siteUrl, image: publicURL}}>
            <AboutPageWrapper>
                <Profile imageData={gatsbyImageData} name="Kiho Kwoun" role="Software Engineer"
                         website="chocochip.co.kr" url="https://chocochip.co.kr" />
                <Introduce description={"Developer who wants to grow by sharing knowledge with others."}></Introduce>
                <Contact github="github.com/Chocochip101" email="dev.chocochip@gmail.com" linkedin="linkedin.com/in/chocochip101/"/>
                <WorkExperience/>
                <Education/>
                <ExtraCurricular/>
            </AboutPageWrapper>
        </BaseLayout>
    );
};

export default AboutPage;

export const aboutPageQuery = graphql`
  query aboutPageQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
    }
  }
`;
