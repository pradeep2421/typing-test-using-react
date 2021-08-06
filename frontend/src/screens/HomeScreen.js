import { React, useEffect } from "react";

import Paragraph from "../components/Paragraph";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listParagraphs } from "../actions/paragraphActions";
export default function HomeScreen() {
  const dispatch = useDispatch();
  const paragraphList = useSelector((state) => state.paragraphList);
  const { loading, error, paragraphs } = paragraphList;
  console.log(paragraphs);
  useEffect(() => {
    dispatch(listParagraphs());
  }, []);
  return (
    <div>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <div className="row center">
          {paragraphs.map((paragraph) => (
            <Paragraph key={paragraph._id} paragraph={paragraph}></Paragraph>
          ))}
        </div>
      )}
    </div>
  );
}
