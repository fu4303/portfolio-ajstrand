/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Helmet } from "react-helmet";
import { useReducer } from "preact/hooks";

const Meta = () => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>Alex's posts and notes</title>
      <meta name="twitter:title" content="Alex's posts and notes" />
      <meta name="og:title" content="Alex's posts and notes" />
      <meta
        name="description"
        content={"Posts and notes about various topics"}
      />
      <meta
        name="twitter:description"
        content={"Posts and notes about various topics"}
      />
    </Helmet>
  );
};

const List = ({ title, subtitle, secondary, ...props }) => (
  <div css={{ marginTop: "1rem", gridColumn: "2/4" }}>
    <ul css={{ listStyleType: "none", margin: 0, padding: 0 }}>
      {props.children}
    </ul>
  </div>
);

const ListItem = ({ to, logo, contentType, children }) => {
  return (
    <li>
      <a
        to={to}
        href={to}
        css={{
          color: "rgba(255,255,255,0.86)",
          display: "flex",
          borderRadius: "16px",
          textDecoration: "none",
          "&:hover,&:focus": {
            backgroundColor: "#2D3747",
            outline: "none",
          },
          padding: "1rem",
          margin: "0 -1rem",
          borderLeft:
            contentType === "blog-post" || contentType === "post"
              ? "1px solid #3981fe"
              : "none",
        }}
      >
        <span css={{ marginLeft: "10px" }}>{children}</span>
      </a>
    </li>
  );
};

const initialState = {
  tags: [],
  filter: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "addTag":
      return { ...state, tags: state.tags.concat(action.payload) };
    case "removeTag":
      return {
        ...state,
        tags: state.tags.filter((tag) => tag !== action.payload),
      };
    case "filterBy":
      return {
        ...state,
        filter: action.payload,
      };
    default:
      throw new Error("Unexpected action");
  }
};

export default (props) => {
  const [filterState, filterDispatch] = useReducer(reducer, initialState);
  return (
    <div
      css={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns:
          "minmax(1.2rem, 1fr) minmax(auto, 400px) minmax(auto, 400px) minmax(1.2rem, 1fr)",
      }}
    >
      <Meta />
      <h1
        css={{
          fontWeight: 600,
          gridColumn: "2/4",
          marginTop: "3rem",
          fontSize: "48px",
        }}
      >
        Digital Garden{" "}
        <a href="/what-is-a-digital-garden" css={{ fontSize: 16 }}>
          What is this?
        </a>
      </h1>
      <ul
        css={{
          display: "flex",
          listStyleType: "none",
          gridColumn: "2/4",
          "& > li:not(:first-of-type)": {
            marginLeft: "1rem",
          },
          marginTop: "2rem",
        }}
      >
        {Array.from(
          new Set(
            props.posts
              .map((v) => v.tags)
              .filter((v) => !!v)
              .flat(Infinity)
          )
        ).map((value) => (
          <li>
            <button
              css={{
                padding: "10px 16px",
                backgroundColor: filterState.tags.includes(value)
                  ? "#3981fe"
                  : "#10151e",
                color: filterState.tags.includes(value) ? "#eef1f7" : "#3981fe",
                "&:focus": {
                  borderColor: "#3981fe",
                  outline: "none",
                },
              }}
              onClick={() => {
                if (filterState.tags.includes(value)) {
                  filterDispatch({ type: "removeTag", payload: value });
                } else {
                  filterDispatch({ type: "addTag", payload: value });
                }
              }}
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
      <div css={{ gridColumn: "2/4" }}>
        <input
          placeholder="Type here to filter posts..."
          onChange={(e) => {
            filterDispatch({ type: "filterBy", payload: e.target.value });
          }}
          css={{
            width: "100%",
            background: "#10151e",
            padding: "16px",
            flex: 1,
            fontSize: "16px",
            border: "1px solid #2f3542",
            borderRadius: "10px",
            color: "#eef1f7",
            "&:focus": {
              borderColor: "#3981fe",
              outline: "none",
            },
          }}
        />
      </div>
      <List
        title="All Posts"
        secondary={
          <a
            to="/post"
            css={{
              textDecoration: "none",
              // margin is to align baseline with heading
              marginBottom: "2px",
              alignSelf: "flex-end",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            all posts
          </a>
        }
      >
        {props.posts
          .filter(({ tags = [], ...etc }) => {
            if (filterState.tags.length === 0) {
              return true;
            }
            return filterState.tags.some((tag) =>
              tags.includes(tag.toLowerCase())
            );
          })
          .filter(({ title }) =>
            title.toLowerCase().includes(filterState.filter.toLowerCase())
          )
          .sort((aPost, bPost) => {
            const a = new Date(aPost.updatedAt);
            const b = new Date(bPost.updatedAt);
            return a > b ? -1 : a < b ? 1 : 0;
          })
          .map(({ id, title, slug, tags, contentType }) => (
            <ListItem to={slug} key={id} contentType={contentType}>
              {title}
            </ListItem>
          ))}
      </List>
    </div>
  );
};
