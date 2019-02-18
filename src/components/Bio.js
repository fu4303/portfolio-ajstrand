import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'

import { rhythm } from '../utils/typography'
import styled from "styled-components";

const StyleLink = styled.a `
color:#bfd1e5;
`;

const Content = styled.div `
  margin-bottom:2rem!important;
`;

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social, typescriptURL, javaURL, springURL } = data.site.siteMetadata
        const blurb = <p>
        Hi, I'm <strong>{author}</strong> and I live and work in Dublin, OH building software for libraries.
        I mainly work with <StyleLink href={typescriptURL}>
        TypeScript
        </StyleLink>, <StyleLink href={javaURL}>
          Java
        </StyleLink> and <StyleLink href={springURL}>
          Spring. 
        </StyleLink>
        {` `}
        <StyleLink href={`https://twitter.com/${social.twitter}`}>
          Follow me on Twitter.
        </StyleLink>
      </p>
        return (
          <Content
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            {blurb}
          </Content>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio