import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ShowText from "../components/ShowText";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";
import { detailsParagraph } from "../actions/paragraphActions";
function ParagraphScreen(props) {
  const dispatch = useDispatch();
  const paragraphId = props.match.params.id;
  const paragraphDetails = useSelector((state) => state.paragraphDetails);

  const { loading, error, paragraph } = paragraphDetails;

  useEffect(() => {
    dispatch(detailsParagraph(paragraphId));
  }, []);
  return (
    <div className="App">
      <div>
        {loading ? (
          <Loading></Loading>
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <div>
            <Link to="/">Back To Home</Link>
            <ShowText text={paragraph.para} finalEmail={"ab"}></ShowText>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParagraphScreen;
