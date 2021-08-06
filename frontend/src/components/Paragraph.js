import { React } from "react";

function Paragraph(props) {
  const { paragraph } = props;
  return (
    <div key={paragraph._id} className="card">
      <a href={`/paragraph/${paragraph._id}`}>
        <p>{paragraph.para}</p>
      </a>
      <div className="card-body">
        <a href={`/paragraph/${paragraph._id}`}>
          <h2>{paragraph.name}</h2>
        </a>

        <div className="price">{paragraph.words} Words</div>
      </div>
    </div>
  );
}

export default Paragraph;
