import * as React from "react";
import { getRegisteredStyles, insertStyles } from "./utils/index.js";
import { serializeStyles } from "./serialize.js";
import { withEmotionCache, ThemeContext } from "./context.js";
import { isBrowser } from "./utils.js";

let classnames = (args) => {
  let len = args.length;
  let i = 0;
  let cls = "";
  for (; i < len; i++) {
    let arg = args[i];
    if (arg == null) continue;

    let toAdd;
    switch (typeof arg) {
      case "boolean":
        break;
      case "object": {
        if (Array.isArray(arg)) {
          toAdd = classnames(arg);
        } else {
          toAdd = "";
          for (const k in arg) {
            if (arg[k] && k) {
              toAdd && (toAdd += " ");
              toAdd += k;
            }
          }
        }
        break;
      }
      default: {
        toAdd = arg;
      }
    }
    if (toAdd) {
      cls && (cls += " ");
      cls += toAdd;
    }
  }
  return cls;
};
function merge(registered, css, className) {
  const registeredStyles = [];

  const rawClassName = getRegisteredStyles(
    registered,
    registeredStyles,
    className
  );

  if (registeredStyles.length < 2) {
    return className;
  }
  return rawClassName + css(registeredStyles);
}

export const ClassNames = withEmotionCache((props, context) => {
  return React.createElement(ThemeContext.Consumer, {}, (theme) => {
    let rules = "";
    let serializedHashes = "";
    let hasRendered = false;

    let css = (...args) => {
      if (hasRendered && process.env.NODE_ENV !== "production") {
        throw new Error("css can only be used during render");
      }
      let serialized = serializeStyles(args, context.registered);
      if (isBrowser) {
        insertStyles(context, serialized, false);
      } else {
        let res = insertStyles(context, serialized, false);
        if (res !== undefined) {
          rules += res;
        }
      }
      if (!isBrowser) {
        serializedHashes += ` ${serialized.name}`;
      }
      return `${context.key}-${serialized.name}`;
    };
    let cx = (...args) => {
      if (hasRendered && process.env.NODE_ENV !== "production") {
        throw new Error("cx can only be used during render");
      }
      return merge(context.registered, css, classnames(args));
    };
    let content = { css, cx, theme };
    let ele = props.children(content);
    hasRendered = true;
    if (!isBrowser && rules.length !== 0) {
      return React.createElement(
        React.Fragment,
        {},
        React.createElement("style", {
          [`data-emotion-${context.key}`]: serializedHashes.substring(1),
          dangerouslySetInnerHTML: { __html: rules },
          nonce: context.sheet.nonce,
        }),
        ele
      );
    }
    return ele;
  });
});
