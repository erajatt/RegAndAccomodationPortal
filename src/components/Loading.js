import ReactLoading from "react-loading";

const Loading = ({ color, height, width, divHeight, divWidth }) => {
  return (
    <div style={{ margin: "auto", height: divHeight || "64px", width: divWidth || "64px", textAlign:"-webkit-center" }}>
      <ReactLoading
        type={"bars"}
        color={color || "#000"}
        width={width || "100%"}
        height={height||"100%"}
        margin={"20px"}
      />
    </div>
  );
};

export default Loading;
