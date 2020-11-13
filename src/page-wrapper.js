/** @jsx jsx */
import { jsx } from "@emotion/core";
import { MDXProvider } from "@mdx-js/preact";
import { Fragment } from "preact";
import { Flex } from "./temp/componentsList.js";

import Header from "./temp/Header.js";
import ThemeWrap from "./temp/theme.js";

import {
  MetaDetails,
  GlobalStyles,
  Details,
  Footer,
} from "./sharedComponents.js";

const Obj = {};

const PageWrapper = ({ children, ...props }) => {
  let title = "Alex Strand's Digital Garden";
  let description = "MDX, Svelte, Kotlin, Rust";

  return (
    <ThemeWrap>
      <MDXProvider components={Obj}>
        <Flex flexDirection="column" height="100vh">
          <GlobalStyles />
          <MetaDetails title={title} description={description} />
          <Details />
          <Header />
          <Fragment>{children}</Fragment>
          <Footer flex="0" />
        </Flex>
      </MDXProvider>
    </ThemeWrap>
  );
};

export default PageWrapper;
