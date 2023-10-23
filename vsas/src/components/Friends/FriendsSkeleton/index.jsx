import React from "react";
import ContentLoader from "react-content-loader";

const FriendsSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 127.5 117.5"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="20" y="105" rx="3" ry="3" width="88" height="12" />
    <circle cx="64" cy="45" r="34" />
  </ContentLoader>
);

export default FriendsSkeleton;
