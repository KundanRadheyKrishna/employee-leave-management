import Skeleton from "react-loading-skeleton";

const SkeletonWrapper = ({ loading, children, width = 80, height = 20 }) => {
  if (loading) {
    return <Skeleton width={width} height={height} />;
  }

  return children;
};

export default SkeletonWrapper;