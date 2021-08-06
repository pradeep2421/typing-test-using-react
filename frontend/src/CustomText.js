import React, { useState } from "react";
import { Button } from "react-bootstrap";

function CustomText(props) {
  const [customText, setCustomText] = useState("");
  const settext = props.changeText;
  const handlecustomText = (e) => {
    const temp = e.target.value;
    setCustomText(temp);
  };
  function resetParagraph() {
    const patLength = customText.length;
    if (patLength === 0) return;
    let cnt = [20];
    let sz = customText.length;
    while (sz > 1) {
      cnt.push(20);
      sz--;
    }

    settext("");

    let counter = 20 * patLength;
    let wordSize = Math.round(Math.random() * 8);
    if (wordSize < 4) wordSize = 5;

    while (counter) {
      if (!wordSize) {
        wordSize = Math.round(Math.random() * 8);
        if (wordSize < 4) wordSize = 5;
        settext((text) => text + " ");
      }
      let index = Math.round(Math.random() * patLength);
      if (index === patLength) index--;
      if (cnt[index] > -3) {
        settext((text) => text + customText[index]);
        cnt[index]--;
      } else {
        let res = customText.length - 1;
        while (res > 0 && cnt[res] < 0) res--;
        console.log(customText[res], cnt[res]);
        settext((text) => text + customText[res]);
        cnt[res]--;
      }
      wordSize--;
      counter--;
    }
  }
  return (
    <div className="paragraph">
      Enter characters which you want to practice
      <textarea
        value={customText}
        className="paragraph"
        placeholder="key characters"
        onChange={handlecustomText}
        autoFocus={true}
      ></textarea>
      <Button
        type="button"
        onClick={() => {
          resetParagraph();
        }}
      >
        Build Paragraph
      </Button>
    </div>
  );
}

export default CustomText;
